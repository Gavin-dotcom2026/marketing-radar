# Marketing Radar 交接文档

## 项目概况

项目名：

```txt
Marketing Radar / 营销雷达
```

本地路径：

```txt
/Users/gavin/codex/apps/marketing-radar
```

GitHub 仓库：

```txt
https://github.com/Gavin-dotcom2026/marketing-radar
```

线上地址：

```txt
https://marketing-radar.pages.dev
```

部署平台：

```txt
Cloudflare Pages Free
```

项目类型：

```txt
纯静态前端 + GitHub Actions 定时抓取 + DeepSeek AI 分析
```

## 当前已完成

### 前端页面

文件：

```txt
public/index.html
public/styles.css
public/app.js
```

页面风格参考 AIHOT：

- 深色背景
- 顶部横向导航
- 单列时间线
- 左侧时间轴
- 内容卡片
- 推荐理由高亮
- 分数 badge
- 分类/tag
- 搜索/筛选/清空筛选
- 移动端适配

页面栏目：

- 精选
- 全部动态
- 营销日报
- 案例爆文
- 关于

前端逻辑：

- 优先读取 `public/data.json`
- 如果读取不到，回退到内置 demo 数据
- 线上已能正常显示 `data.json` 数据

### 自动化更新

GitHub Actions 文件：

```txt
.github/workflows/update-data.yml
```

当前计划：

```yaml
schedule:
  - cron: "0 */8 * * *"
```

含义：

```txt
每 8 小时自动更新一次
```

也可以手动触发：

```txt
GitHub -> Actions -> Update marketing data -> Run workflow
```

流程：

```txt
抓取信源
-> DeepSeek AI 分析
-> 生成 public/data.json
-> 自动 commit
-> Cloudflare Pages 自动部署
```

### 数据抓取脚本

文件：

```txt
scripts/update-data.mjs
```

功能：

- 读取信源配置
- 抓 RSS/Atom
- 抓部分 HTML 页面
- 提取真实文章 URL
- 去重
- 判断营销相关性
- 调 AI 生成分类、中文摘要、推荐理由、标签、实体、五维评分
- 生成 `public/data.json`

当前 AI 模式已经生效，线上数据：

```json
"mode": "ai"
```

### 信源配置

文件：

```txt
data/sources.json
```

当前接入信源包括：

- SocialBeta
- 数英
- Morketing
- Marketing Dive
- Think with Google
- Google Ads Developer Blog
- Adweek
- MarTech
- Search Engine Land

其中：

- 数英、Marketing Dive、Think with Google、Google Ads Developer Blog、Adweek、MarTech、Search Engine Land 走 RSS/Atom
- SocialBeta、Morketing 走 HTML 首页解析
- 广告门暂未接入，因为常规 RSS/页面路径不稳定

### AI 配置

AI Key 不在代码里。

配置位置：

```txt
GitHub -> Settings -> Secrets and variables -> Actions
```

当前应有 Secrets：

```txt
AI_PROVIDER=deepseek
AI_MODEL=deepseek-chat
DEEPSEEK_API_KEY=***
```

注意：

- 不要把 API Key 写进代码
- 不要提交到 GitHub
- 不要放到前端
- 如果 key 泄露，需要去 DeepSeek 后台撤销并重建

## 当前主要问题

用户反馈：

```txt
Google / 技术 / API 类内容排得太靠前
```

原因：

- T1 信源权重过高
- 平台/API/AI 关键词容易被规则或 AI 打高分
- 精选页排序更接近按时间展示，营销价值优先级不够
- Marketing Radar 应该优先展示品牌案例、消费者洞察、营销策略、创意观点、行业趋势，而不是开发者 API 更新

## 下一步任务：调优评分与排序

### 1. 修改精选页排序

文件：

```txt
public/app.js
```

当前问题：

`getFiltered()` 里统一按发布时间排序：

```js
.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
```

要求：

- `精选` 页按营销价值排序
- `全部动态` 页继续按发布时间排序

建议：

```js
function ageHours(iso) {
  return Math.max(0, (Date.now() - new Date(iso).getTime()) / 36e5);
}

function displayRank(item) {
  const freshness = Math.max(0, 100 - ageHours(item.publishedAt) * 0.8);
  return item.score * 0.82 + freshness * 0.18;
}
```

然后：

```txt
if onlyFeatured: sort by displayRank desc
else: sort by publishedAt desc
```

### 2. 修改评分公式

文件：

```txt
scripts/update-data.mjs
```

在 `finalizeItem()` 里加入内容类型调节。

新增函数：

```js
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

  if (technicalSignals.some((word) => text.includes(word))) {
    multiplier -= 0.18;
  }

  if (marketingValueSignals.some((word) => text.includes(word))) {
    multiplier += 0.12;
  }

  if (category === "品牌案例" || category === "创意观点") {
    multiplier += 0.08;
  }

  if (item.sourceName === "Google Ads Developer Blog") {
    multiplier -= 0.12;
  }

  return Math.max(0.72, Math.min(1.18, multiplier));
}
```

注意：

`category` 要先算出来，再传入 `contentTypeMultiplier()`。

把：

```js
const finalScore = Math.round(baseScore * tierWeight(item.sourceTier));
```

改成：

```js
const finalScore = Math.round(
  baseScore *
  tierWeight(item.sourceTier) *
  contentTypeMultiplier(item, category)
);
```

### 3. 调整信源等级权重

当前：

```js
function tierWeight(tier) {
  return { T1: 1.12, "T1.5": 1.04, T2: 0.94 }[tier] || 1;
}
```

建议改成：

```js
function tierWeight(tier) {
  return { T1: 1.04, "T1.5": 1.02, T2: 1.0 }[tier] || 1;
}
```

理由：

```txt
T1 表示可信，不表示一定更值得营销人优先看。
```

### 4. 调整精选阈值

当前平台动态可能太容易精选。

建议：

```js
function featuredThreshold(category) {
  return {
    "平台动态": 76,
    "品牌案例": 72,
    "行业趋势": 74,
    "报告数据": 74,
    "创意观点": 72
  }[category] || 74;
}
```

### 5. 重新生成数据

执行：

```bash
cd /Users/gavin/codex/apps/marketing-radar
node scripts/update-data.mjs
```

检查前 30 条：

```bash
node - <<'NODE'
const data = require('./public/data.json');
for (const item of data.items.slice(0,30)) {
  console.log(`${item.score} ${item.sourceName} ${item.category} | ${item.title}`);
}
NODE
```

理想效果：

- SocialBeta、数英、Morketing、Marketing Dive 的案例/趋势内容进入前排
- Google Ads Developer Blog 的 API/开发者更新不再大面积靠前
- Google/平台内容仍可出现，但必须对营销人有明显价值
- `全部动态` 保持按时间倒序

### 6. 提交推送

```bash
git status
git add public/app.js scripts/update-data.mjs public/data.json
git commit -m "Tune ranking for marketing value"
git pull --rebase origin main
git push
```

如果 `public/data.json` rebase 冲突：

```bash
node scripts/update-data.mjs
git add public/data.json
GIT_EDITOR=true git rebase --continue
git push
```

原因：

```txt
public/data.json 是自动生成文件，GitHub Actions 也会改它。
```

## 验收标准

- 本地脚本能跑完
- `public/data.json` 仍然是 AI 数据
- `mode` 应为：

```json
"mode": "ai"
```

- 精选页不再被 Google 技术/API 更新主导
- 全部动态仍按时间倒序
- Cloudflare 部署成功
- 线上地址可正常访问：

```txt
https://marketing-radar.pages.dev
```

## 常用命令

本地预览：

```bash
cd /Users/gavin/codex/apps/marketing-radar/public
python3 -m http.server 8901
```

手动运行抓取：

```bash
cd /Users/gavin/codex/apps/marketing-radar
node scripts/update-data.mjs
```

查看 GitHub Actions：

```bash
gh run list --workflow update-data.yml --limit 5
```

手动触发 GitHub Actions：

```bash
gh workflow run update-data.yml
```

查看线上数据：

```bash
curl -fsSL https://marketing-radar.pages.dev/data.json
```

## 2026-05-07 更新记录

### 已完成

1. 精选页排序改为 displayRank（score * 0.82 + 时效 * 0.18），全部动态保持时间倒序
2. 新增 contentTypeMultiplier() 评分调节，压低技术/API 内容，拉高品牌案例
3. 信源权重压平：T1 1.04 / T1.5 1.02 / T2 1.0
4. 精选阈值按分类差异化：平台动态 76、品牌案例 72、创意观点 72、行业趋势 74、报告数据 74
5. 导航栏去掉案例爆文，新增快消/母婴/3C 行业专区（关键词匹配 + 排除规则）
6. 关于页精简，反馈邮箱 gavin.xu@wppmedia.com
7. 新增信源：36氪 (RSS) + 爱范儿 (RSS)
8. AI 二分类质量筛选：DeepSeek 先判断 yes/no，只有 yes 才进入完整分析
9. 摘要 prompt 强化：要求具体说明谁做了什么、数据、方法，禁止空洞表述
10. 营销日报增加 AI 今日营销洞察总结（150-200字趋势段落）
11. Morketing 日期解析修复（跳过 URL 路径中的假日期）
12. 去掉 Prototype banner
13. data.json 改为 minified 输出（减小部署体积）

### Cloudflare 部署注意事项

- Cloudflare Account ID: 7446afc62b99f7e9ce7941cbc8e9cc74
- 如果自动部署后网站 500，通常是 asset cache 损坏
- 解决方法：本地用 wrangler 强制重新上传

```bash
CLOUDFLARE_API_TOKEN=xxx npx wrangler pages deploy public --project-name=marketing-radar --skip-caching
```

### DeepSeek API

- 本地测试需带环境变量：DEEPSEEK_API_KEY=sk-xxx node scripts/update-data.mjs
- GitHub Actions 里已配好 secrets，自动生效
- 每次更新数据会调用：1次/条 二分类筛选 + 1次/条 完整分析 + 1次 日报总结

## 后续可拓展

### 优先接入信源（RSS 已验证可用）

- 华丽志 luxe.co/feed（美妆时尚，补快消专区）
- 极客公园 geekpark.net/rss（科技，补 3C 专区）

### 需要 HTML 解析或 RSSHub

- 广告门
- 刀法
- 品牌星球
- Campaign Asia（RSS 不可用）
- 母婴行业观察

### 长期规划

- 竞品监控：用户输入关注品牌名，自动高亮聚合
- 周报邮件推送（Resend 免费额度）
- 热点预警：关键词频次突增检测
- 行业日历 + 营销节点提醒

### 加信源注意事项

每加一个信源，都要先本地跑通，确认：

- 能抓到内容
- URL 是真实文章页
- 不会频繁 403/404
- 数据不会污染排序
- 行业专区关键词能正确匹配

再提交上线。
