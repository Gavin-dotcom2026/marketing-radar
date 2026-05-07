# Marketing Radar / 营销雷达

> 帮营销人从分散的信息海里筛出值得关注的品牌案例、平台变化、行业趋势、报告数据和创意观点。

## 当前状态

**产品原型 v1** — 静态前端已上线，前端会优先读取 `public/data.json`；如果数据文件不存在，会自动回退到内置示例数据。

## 本地预览

```bash
cd public
python3 -m http.server 8901
# 打开 http://localhost:8901
```

## 部署到 Cloudflare Pages

### 最短路径（GitHub + Cloudflare）

1. 把本项目上传到 GitHub 仓库
2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
3. 进入 Workers & Pages → Create application → Pages
4. 连接该 GitHub 仓库
5. Root directory 留空
6. Build command 留空
7. Build output directory 填 `public`
8. Deploy — 获得 `*.pages.dev` 地址

### 手动上传

也可以直接上传 `public/` 目录到 Cloudflare Pages，无需 GitHub。

## 目录结构

```
public/
  index.html    — 主页面
  styles.css    — 深色主题样式
  app.js        — 数据 + 渲染逻辑
```

## 功能

- 精选页：AI 评分筛选后的高价值内容，左侧时间轴
- 全部动态：包含未达精选阈值的全部条目
- 营销日报：按类别自动分组汇总
- 案例爆文：品牌案例 + 创意观点合集
- 关于：产品说明和信源介绍
- 全局搜索和分类/信源等级筛选（精选 + 全部动态共用）
- 响应式布局，支持桌面和移动端

## 自动更新

仓库包含 GitHub Actions workflow：

```txt
.github/workflows/update-data.yml
```

默认每 8 小时运行一次：

```yaml
schedule:
  - cron: "0 */8 * * *"
```

流程：

```txt
抓取 data/sources.json 里的公开 RSS/Atom 信源
→ 规则判断营销相关性
→ 可选 AI 摘要、推荐理由、五维评分
→ 写入 public/data.json
→ 如果数据有变化，自动 commit
→ Cloudflare Pages 因 commit 自动重新部署
```

也可以在 GitHub 仓库的 **Actions → Update marketing data → Run workflow** 手动触发。

## AI 分析配置

不配置 API Key 时，脚本会使用规则评分，保证自动更新先跑通。

如果要启用 AI 分析，在 GitHub 仓库进入：

```txt
Settings → Secrets and variables → Actions → New repository secret
```

可选 DeepSeek：

```txt
AI_PROVIDER=deepseek
DEEPSEEK_API_KEY=你的 DeepSeek API Key
AI_MODEL=deepseek-chat
```

可选 OpenAI：

```txt
AI_PROVIDER=openai
OPENAI_API_KEY=你的 OpenAI API Key
AI_MODEL=gpt-4.1-mini
```

脚本只会分析新增 URL，已有内容会复用历史分析结果，避免重复消耗 API。

## 信源配置

信源文件：

```txt
data/sources.json
```

每个信源字段：

```json
{
  "name": "Marketing Dive",
  "handle": "@marketingdive",
  "tier": "T2",
  "type": "营销媒体",
  "categoryHint": "行业趋势",
  "feedUrl": "https://www.marketingdive.com/feeds/news/"
}
```

可以继续增加 RSS/Atom 信源。脚本会容错，单个信源失败不会中断整轮更新。

## 后续计划

- 扩充真实信源抓取（RSS / API / HTML scraper）
- 调优 AI 五维评分 + 规则引擎精选
- 事件聚类和去重
- 真实原文链接替换
- 用户登录和个性化推送
- 每日自动日报和飞书/邮件推送
