import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const SOURCES_PATH = new URL("../data/sources.json", import.meta.url);
const OUTPUT_PATH = new URL("../public/data.json", import.meta.url);
const MAX_ITEMS = Number(process.env.MAX_ITEMS || 200);
const AI_PROVIDER = process.env.AI_PROVIDER || inferAiProvider();
const AI_MODEL = process.env.AI_MODEL || defaultModel(AI_PROVIDER);

const categories = ["平台动态", "品牌案例", "行业趋势", "报告数据", "创意观点"];

const keywordRules = [
  ["平台动态", ["ads", "advertising", "google", "meta", "tiktok", "shop", "commerce", "platform", "api", "campaign manager", "广告", "投放", "平台", "小红书", "抖音", "电商"]],
  ["品牌案例", ["brand", "campaign", "creative", "activation", "launch", "coca-cola", "nike", "mcdonald", "starbucks", "品牌", "案例", "联名", "官宣", "代言", "上新"]],
  ["报告数据", ["report", "study", "research", "data", "trend", "survey", "forecast", "insight", "报告", "研究", "数据", "洞察", "趋势"]],
  ["创意观点", ["creative", "creator", "social", "content", "culture", "influencer", "storytelling", "创意", "文案", "设计", "内容", "社媒"]],
  ["行业趋势", ["marketing", "consumer", "retail", "media", "agency", "growth", "strategy", "营销", "消费", "增长", "商业", "零售", "行业"]]
];

const marketingKeywords = [
  "marketing", "brand", "advertising", "campaign", "consumer", "retail", "commerce", "social",
  "creator", "media", "agency", "content", "influencer", "customer", "shop", "tiktok", "google",
  "meta", "ads", "analytics", "measurement", "trend", "report", "creative", "growth"
  , "营销", "品牌", "广告", "案例", "消费", "商业", "创意", "文案", "设计", "社媒", "电商", "零售", "增长", "趋势", "报告", "小红书", "抖音"
];

async function main() {
  const sources = JSON.parse(await readFile(SOURCES_PATH, "utf8"));
  const existing = (await readExisting()).filter((item) => isUsableArticleUrl(item.originalUrl));
  const existingByUrl = new Map(existing.map((item) => [normalizeUrl(item.originalUrl), item]));

  const fetched = [];
  for (const source of sources) {
    try {
      const entries = source.feedUrl ? await fetchFeed(source) : await fetchHtmlSource(source);
      fetched.push(...entries.map((entry) => normalizeEntry(entry, source)));
      console.log(`Fetched ${entries.length} from ${source.name}`);
    } catch (error) {
      console.warn(`Skip ${source.name}: ${error.message}`);
    }
  }

  const fresh = dedupeByTitleAndSource(dedupeByUrl(fetched))
    .filter((item) => isMarketingRelated(item))
    .filter((item) => isUsableArticleUrl(item.originalUrl))
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  const analyzed = [];
  for (const item of fresh) {
    const old = existingByUrl.get(normalizeUrl(item.originalUrl));
    if (old) {
      analyzed.push(old);
      continue;
    }
    const relevant = await isRelevantForMarketers(item);
    if (!relevant) {
      console.log(`  Skip (not relevant): ${item.title.slice(0, 40)}`);
      continue;
    }
    analyzed.push(await analyzeItem(item));
  }

  const merged = dedupeByTitleAndSource(dedupeByUrl([...analyzed, ...existing]))
    .map((item) => ({ ...item, title: cleanSourceTitle(item.title, { name: item.sourceName }) }))
    .map((item) => rescoreItem(item))
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, MAX_ITEMS);

  const dailySummary = await generateDailySummary(merged);

  const payload = {
    generatedAt: new Date().toISOString(),
    mode: hasAiKey() ? "ai" : "rules",
    dailySummary,
    sources: sources.map(({ name, tier, type, feedUrl }) => ({ name, tier, type, feedUrl })),
    items: merged
  };

  const before = await readTextIfExists(OUTPUT_PATH);
  const next = `${JSON.stringify(payload)}\n`;
  if (stableHash(before) === stableHash(next)) {
    console.log("No data change.");
    return;
  }
  await writeFile(OUTPUT_PATH, next);
  console.log(`Wrote ${merged.length} items to public/data.json`);
}

async function fetchHtmlSource(source) {
  const response = await fetch(source.pageUrl, {
    headers: {
      "user-agent": "Mozilla/5.0 MarketingRadarBot/0.1 (+https://marketing-radar.pages.dev)",
      "accept": "text/html,application/xhtml+xml"
    }
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const html = await response.text();
  const entries = parseHtmlLinks(html, source);
  if (!entries.length) throw new Error("no article links parsed");
  return entries;
}

async function fetchFeed(source) {
  const response = await fetch(source.feedUrl, {
    headers: {
      "user-agent": "MarketingRadarBot/0.1 (+https://marketing-radar.pages.dev)",
      "accept": "application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9, */*;q=0.8"
    }
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const xml = await response.text();
  const entries = parseRss(xml);
  if (!entries.length) throw new Error("no feed entries parsed");
  return entries;
}

function parseRss(xml) {
  const itemBlocks = xml.match(/<item\b[\s\S]*?<\/item>/gi);
  if (itemBlocks?.length) {
    return itemBlocks.map((block) => ({
      title: textFromTag(block, "title"),
      link: textFromTag(block, "link") || attrFromTag(block, "link", "href"),
      publishedAt: textFromTag(block, "pubDate") || textFromTag(block, "dc:date"),
      summary: textFromTag(block, "description") || textFromTag(block, "content:encoded")
    })).filter((entry) => entry.title && entry.link);
  }

  const entryBlocks = xml.match(/<entry\b[\s\S]*?<\/entry>/gi) || [];
  return entryBlocks.map((block) => ({
    title: textFromTag(block, "title"),
    link: atomAlternateLink(block) || attrFromTag(block, "link", "href") || textFromTag(block, "link"),
    publishedAt: textFromTag(block, "published") || textFromTag(block, "updated"),
    summary: textFromTag(block, "summary") || textFromTag(block, "content")
  })).filter((entry) => entry.title && entry.link);
}

function parseHtmlLinks(html, source) {
  const includes = source.linkIncludes || [];
  const seen = new Set();
  const entries = [];
  const links = html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi);
  for (const match of links) {
    const href = match[1];
    if (includes.length && !includes.some((part) => href.includes(part))) continue;
    const title = cleanText(match[2]);
    if (title.length < 6 || title.length > 120) continue;
    const link = absoluteUrl(href, source.pageUrl);
    const key = normalizeUrl(link);
    if (seen.has(key)) continue;
    seen.add(key);
    entries.push({
      title,
      link,
      publishedAt: extractNearbyDate(html, href) || new Date().toISOString(),
      summary: title
    });
    if (entries.length >= 30) break;
  }
  return entries;
}

function extractNearbyDate(html, href) {
  const index = html.indexOf(href);
  if (index < 0) return "";
  const slice = html.slice(Math.max(0, index - 500), Math.min(html.length, index + 500));
  const candidates = [...slice.matchAll(/20\d{2}[-年]\d{1,2}[-月]\d{1,2}日?(?:\s+\d{1,2}:\d{2})?/g)];
  for (const m of candidates) {
    const charBefore = slice[m.index - 1] || "";
    if (charBefore === "/" || charBefore === "=") continue;
    const raw = m[0].replace("年", "-").replace("月", "-").replace("日", "");
    const parsed = new Date(raw);
    if (Number.isNaN(parsed.getTime())) continue;
    return raw;
  }
  return "";
}

function normalizeEntry(entry, source) {
  const title = cleanSourceTitle(cleanText(entry.title), source);
  const summary = cleanText(stripHtml(entry.summary || title)).slice(0, 180);
  const originalUrl = absoluteUrl(entry.link, source.feedUrl);
  const publishedAt = safeDate(entry.publishedAt);
  const category = guessCategory(`${title} ${summary}`, source.categoryHint);

  return {
    id: stableHash(originalUrl).slice(0, 12),
    title,
    sourceName: source.name,
    sourceHandle: source.handle,
    sourceTier: source.tier,
    sourceType: source.type,
    publishedAt,
    category,
    score: 60,
    isFeatured: false,
    summary,
    recommendation: "",
    tags: guessTags(`${title} ${summary}`),
    entities: guessEntities(title),
    originalUrl,
    scores: {
      spread: 60,
      reusable: 60,
      commercial: 60,
      freshness: freshnessScore(publishedAt),
      credibility: credibilityScore(source.tier)
    }
  };
}

function cleanSourceTitle(title, source) {
  let next = title;
  if (source.name === "数英") {
    next = next.replace(/^文章频道\s*-\s*/, "");
  }
  if (source.name === "Morketing") {
    next = next
      .replace(/\s+查看详情$/g, "")
      .replace(/\s+\S+\s+20\d{2}-\d{1,2}-\d{1,2}\s+\d{1,2}:\d{2}.*$/g, "")
      .replace(/^20\d{2}-\d{1,2}-\d{1,2}\s+\d{1,2}:\d{2}\s+/, "");
  }
  return next.trim();
}

async function isRelevantForMarketers(item) {
  if (!hasAiKey()) return isMarketingRelated(item);
  try {
    const endpoint = aiEndpoint();
    const apiKey = aiKey();
    const prompt = [
      "你是营销行业信息筛选员。判断以下内容是否对营销从业者有参考价值。",
      "营销从业者关心：品牌营销案例、广告创意、消费者洞察、媒介投放、增长策略、行业趋势、平台政策变化、新品上市、代言联名、零售电商。",
      "不关心：纯技术开发（API/SDK/代码）、纯科学研究、社会新闻、娱乐八卦、个人生活方式。",
      "只回答 yes 或 no，不要解释。",
      `标题：${item.title}`,
      `来源：${item.sourceName}`,
      `摘要：${item.summary}`
    ].join("\n");
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json", "authorization": `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: 0,
        max_tokens: 3
      })
    });
    if (!response.ok) return true;
    const data = await response.json();
    const answer = (data.choices?.[0]?.message?.content || "").trim().toLowerCase();
    return answer.startsWith("yes");
  } catch {
    return true;
  }
}

async function generateDailySummary(items) {
  if (!hasAiKey()) return "";
  const featured = items.filter((i) => i.isFeatured).sort((a, b) => b.score - a.score).slice(0, 15);
  if (!featured.length) return "";
  const digest = featured.map((i) => `[${i.category}] ${i.title} — ${i.summary.slice(0, 60)}`).join("\n");
  try {
    const endpoint = aiEndpoint();
    const apiKey = aiKey();
    const prompt = [
      "你是营销行业的资深编辑。根据今天的精选内容，写一段 150-200 字的'今日营销洞察'。",
      "要求：提炼 2-3 个值得营销人关注的趋势或信号，用具体的品牌/事件/数据佐证，语气专业但不学术，像资深同事在早会上的 3 分钟分享。",
      "不要用'总之'、'综上'结尾，不要列点，写成自然段落。",
      "\n今日精选内容：",
      digest
    ].join("\n");
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json", "authorization": `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5,
        max_tokens: 400
      })
    });
    if (!response.ok) return "";
    const data = await response.json();
    return (data.choices?.[0]?.message?.content || "").trim();
  } catch {
    return "";
  }
}

async function analyzeItem(item) {
  if (hasAiKey()) {
    try {
      return await analyzeWithAi(item);
    } catch (error) {
      console.warn(`AI fallback for ${item.title}: ${error.message}`);
    }
  }
  return analyzeWithRules(item);
}

async function analyzeWithAi(item) {
  const endpoint = aiEndpoint();
  const apiKey = aiKey();
  const prompt = [
    "你是一个资深营销情报分析员。请分析这条营销/品牌/广告/消费者趋势信息。",
    "只返回 JSON，不要 Markdown。",
    "字段：category, summary, recommendation, tags, entities, scores。",
    "category 必须是：平台动态、品牌案例、行业趋势、报告数据、创意观点 之一。",
    "summary 要求：2-3句话，必须具体说明'谁做了什么、怎么做的、结果如何'，不要泛泛概括。如果原文标题已经说清楚了，就在此基础上补充关键细节（数据、方法、品牌名）。禁止出现'探讨了…'、'分析了…'这类空洞表述。",
    "scores 包含 spread, reusable, commercial, freshness, credibility，分数 0-100。",
    `标题：${item.title}`,
    `来源：${item.sourceName} (${item.sourceTier})`,
    `原摘要：${item.summary}`
  ].join("\n");

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: AI_MODEL,
      messages: [
        { role: "system", content: "你只输出严格 JSON。" },
        { role: "user", content: prompt }
      ],
      temperature: 0.2,
      response_format: { type: "json_object" }
    })
  });
  if (!response.ok) throw new Error(`AI HTTP ${response.status}`);
  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("empty AI content");
  const analysis = JSON.parse(content);
  return finalizeItem(item, analysis);
}

function analyzeWithRules(item) {
  const text = `${item.title} ${item.summary}`.toLowerCase();
  const spread = scoreByWords(text, ["viral", "social", "creator", "influencer", "culture", "campaign"], 58);
  const reusable = scoreByWords(text, ["case", "strategy", "brand", "creative", "content", "launch"], 62);
  const commercial = scoreByWords(text, ["ads", "commerce", "retail", "shop", "measurement", "revenue", "customer"], 60);
  const freshness = freshnessScore(item.publishedAt);
  const credibility = credibilityScore(item.sourceTier);
  return finalizeItem(item, {
    category: item.category,
    summary: item.summary || `来自 ${item.sourceName} 的营销动态，建议进一步查看原文判断与业务的关联度。`,
    recommendation: recommendationFor(item.category),
    tags: item.tags,
    entities: item.entities,
    scores: { spread, reusable, commercial, freshness, credibility }
  });
}

function rescoreItem(item) {
  const category = item.category;
  const scores = item.scores || {};
  const baseScore = (scores.spread || 60) * 0.22 + (scores.reusable || 60) * 0.24 + (scores.commercial || 60) * 0.28 + (scores.freshness || 60) * 0.14 + (scores.credibility || 60) * 0.12;
  const finalScore = Math.round(baseScore * tierWeight(item.sourceTier) * contentTypeMultiplier(item, category));
  const score = Math.min(99, finalScore);
  return { ...item, score, isFeatured: score >= featuredThreshold(category) };
}

function contentTypeMultiplier(item, category) {
  const text = `${item.title} ${item.summary} ${(item.tags || []).join(" ")}`.toLowerCase();
  const technicalSignals = [
    "api", "developer", "sdk", "structured data", "data api",
    "wordpress", "bot", "server", "conversion reporting",
    "google analytics data api"
  ];
  const marketingValueSignals = [
    "品牌", "案例", "campaign", "消费者", "consumer",
    "洞察", "insight", "创意", "creative", "增长",
    "联名", "代言", "社媒", "creator", "retail",
    "world cup", "母亲节", "新品", "品牌营销"
  ];
  let multiplier = 1;
  if (technicalSignals.some((word) => text.includes(word))) multiplier -= 0.18;
  if (marketingValueSignals.some((word) => text.includes(word))) multiplier += 0.12;
  if (category === "品牌案例" || category === "创意观点") multiplier += 0.08;
  if (item.sourceName === "Google Ads Developer Blog") multiplier -= 0.12;
  return Math.max(0.72, Math.min(1.18, multiplier));
}

function finalizeItem(item, analysis) {
  const scores = {
    spread: clampScore(analysis.scores?.spread),
    reusable: clampScore(analysis.scores?.reusable),
    commercial: clampScore(analysis.scores?.commercial),
    freshness: clampScore(analysis.scores?.freshness ?? freshnessScore(item.publishedAt)),
    credibility: clampScore(analysis.scores?.credibility ?? credibilityScore(item.sourceTier))
  };
  const category = categories.includes(analysis.category) ? analysis.category : item.category;
  const baseScore = scores.spread * 0.22 + scores.reusable * 0.24 + scores.commercial * 0.28 + scores.freshness * 0.14 + scores.credibility * 0.12;
  const finalScore = Math.round(baseScore * tierWeight(item.sourceTier) * contentTypeMultiplier(item, category));

  return {
    ...item,
    category,
    score: Math.min(99, finalScore),
    isFeatured: finalScore >= featuredThreshold(category),
    summary: cleanText(analysis.summary || item.summary).slice(0, 180),
    recommendation: cleanText(analysis.recommendation || recommendationFor(category)).slice(0, 160),
    tags: normalizeList(analysis.tags || item.tags).slice(0, 5),
    entities: normalizeList(analysis.entities || item.entities).slice(0, 5),
    scores
  };
}

function isMarketingRelated(item) {
  const text = `${item.title} ${item.summary}`.toLowerCase();
  return marketingKeywords.some((word) => text.includes(word)) || item.sourceTier === "T1";
}

function guessCategory(text, fallback = "行业趋势") {
  const lower = text.toLowerCase();
  let best = [fallback, 0];
  for (const [category, words] of keywordRules) {
    const hits = words.filter((word) => lower.includes(word)).length;
    if (hits > best[1]) best = [category, hits];
  }
  return best[0];
}

function guessTags(text) {
  const lower = text.toLowerCase();
  const tags = [];
  const dict = [
    ["AI营销", ["ai", "artificial intelligence", "genai"]],
    ["广告产品", ["ads", "advertising", "campaign manager", "广告", "投放"]],
    ["社媒", ["social", "creator", "influencer", "社媒", "小红书", "抖音"]],
    ["内容营销", ["content", "storytelling", "内容", "文案"]],
    ["电商", ["commerce", "retail", "shop", "电商", "零售"]],
    ["消费者趋势", ["consumer", "trend", "insight", "消费", "趋势", "洞察"]],
    ["品牌", ["brand", "campaign", "品牌", "案例", "联名"]]
  ];
  for (const [tag, words] of dict) {
    if (words.some((word) => lower.includes(word))) tags.push(tag);
  }
  return tags.length ? tags : ["营销动态"];
}

function guessEntities(title) {
  return title
    .split(/[：:|,，;；\-–—]/)
    .map((part) => cleanText(part))
    .filter((part) => part.length >= 2 && part.length <= 28)
    .slice(0, 3);
}

function recommendationFor(category) {
  const map = {
    "平台动态": "这类变化可能影响投放、内容分发或转化链路，建议关注是否需要调整渠道策略。",
    "品牌案例": "适合拆解其创意机制、媒介节奏和可迁移打法，沉淀为案例库素材。",
    "行业趋势": "可作为选题、客户简报或策略判断的趋势信号，建议结合行业数据继续验证。",
    "报告数据": "适合进入日报和趋势库，用于支撑策略判断、提案和客户沟通。",
    "创意观点": "可作为创意会和内容选题输入，重点看观点是否能迁移到当前品牌场景。"
  };
  return map[category] || map["行业趋势"];
}

function featuredThreshold(category) {
  return {
    "平台动态": 76,
    "品牌案例": 72,
    "行业趋势": 74,
    "报告数据": 74,
    "创意观点": 72
  }[category] || 74;
}

function tierWeight(tier) {
  return { T1: 1.04, "T1.5": 1.02, T2: 1.0 }[tier] || 1;
}

function credibilityScore(tier) {
  return { T1: 94, "T1.5": 88, T2: 74 }[tier] || 70;
}

function freshnessScore(iso) {
  const ageHours = Math.max(0, (Date.now() - new Date(iso).getTime()) / 36e5);
  if (ageHours < 24) return 92;
  if (ageHours < 72) return 84;
  if (ageHours < 168) return 74;
  if (ageHours < 720) return 62;
  return 50;
}

function scoreByWords(text, words, base) {
  return Math.min(92, base + words.filter((word) => text.includes(word)).length * 6);
}

function normalizeList(value) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => cleanText(String(item))).filter(Boolean);
}

function dedupeByUrl(items) {
  const seen = new Set();
  const result = [];
  for (const item of items) {
    const key = normalizeUrl(item.originalUrl);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }
  return result;
}

function dedupeByTitleAndSource(items) {
  const seen = new Set();
  const result = [];
  for (const item of items) {
    const key = `${item.sourceName}::${cleanText(item.title).toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }
  return result;
}

function isUsableArticleUrl(url) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "www.blogger.com" && parsed.pathname.includes("/feeds/")) return false;
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function normalizeUrl(url) {
  try {
    const parsed = new URL(url);
    parsed.hash = "";
    return parsed.toString().replace(/\/$/, "");
  } catch {
    return url || "";
  }
}

function absoluteUrl(url, base) {
  try {
    return new URL(url, base).toString();
  } catch {
    return url;
  }
}

function safeDate(value) {
  const date = value ? new Date(value) : new Date();
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function textFromTag(block, tag) {
  const escaped = tag.replace(":", "\\:");
  const match = block.match(new RegExp(`<${escaped}[^>]*>([\\s\\S]*?)<\\/${escaped}>`, "i"));
  return match ? decodeXml(stripCdata(match[1])) : "";
}

function attrFromTag(block, tag, attr) {
  const escaped = tag.replace(":", "\\:");
  const match = block.match(new RegExp(`<${escaped}[^>]*\\s${attr}=["']([^"']+)["'][^>]*>`, "i"));
  return match ? decodeXml(match[1]) : "";
}

function atomAlternateLink(block) {
  const links = block.match(/<link\b[^>]*>/gi) || [];
  const alternate = links.find((link) => /rel=["']alternate["']/i.test(link) && /type=["']text\/html["']/i.test(link))
    || links.find((link) => /rel=["']alternate["']/i.test(link));
  if (!alternate) return "";
  const match = alternate.match(/\shref=["']([^"']+)["']/i);
  return match ? decodeXml(match[1]) : "";
}

function stripCdata(value) {
  return value.replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "");
}

function stripHtml(value) {
  return value.replace(/<[^>]+>/g, " ");
}

function cleanText(value) {
  return decodeXml(stripHtml(String(value || ""))).replace(/\s+/g, " ").trim();
}

function decodeXml(value) {
  return String(value || "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'");
}

function clampScore(value) {
  const score = Number(value);
  if (!Number.isFinite(score)) return 60;
  return Math.max(0, Math.min(100, Math.round(score)));
}

async function readExisting() {
  try {
    const payload = JSON.parse(await readFile(OUTPUT_PATH, "utf8"));
    return Array.isArray(payload.items) ? payload.items : [];
  } catch {
    return [];
  }
}

async function readTextIfExists(path) {
  try {
    return await readFile(path, "utf8");
  } catch {
    return "";
  }
}

function stableHash(value) {
  return createHash("sha256").update(String(value || "")).digest("hex");
}

function inferAiProvider() {
  if (process.env.DEEPSEEK_API_KEY) return "deepseek";
  if (process.env.OPENAI_API_KEY) return "openai";
  return "none";
}

function hasAiKey() {
  return Boolean(aiKey());
}

function aiKey() {
  if (AI_PROVIDER === "deepseek") return process.env.DEEPSEEK_API_KEY;
  if (AI_PROVIDER === "openai") return process.env.OPENAI_API_KEY;
  return "";
}

function aiEndpoint() {
  if (process.env.AI_BASE_URL) return `${process.env.AI_BASE_URL.replace(/\/$/, "")}/chat/completions`;
  if (AI_PROVIDER === "deepseek") return "https://api.deepseek.com/chat/completions";
  return "https://api.openai.com/v1/chat/completions";
}

function defaultModel(provider) {
  if (provider === "deepseek") return "deepseek-chat";
  if (provider === "openai") return "gpt-4.1-mini";
  return "";
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
