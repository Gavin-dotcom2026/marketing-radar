# Marketing Radar / 营销雷达

> 帮营销人从分散的信息海里筛出值得关注的品牌案例、平台变化、行业趋势、报告数据和创意观点。

## 当前状态

**产品原型 v1** — 静态前端，使用示例数据（来源为真实近期营销媒体文章标题和摘要，原文链接仅供参考，非具体文章直链）。

## 本地预览

```bash
cd public
python3 -m http.server 8901
# 打开 http://localhost:8901
```

## 部署到 Cloudflare Pages

### 最短路径（GitHub + Cloudflare）

1. 把 `apps/marketing-radar` 上传到 GitHub 仓库
2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
3. 进入 Workers & Pages → Create application → Pages
4. 连接该 GitHub 仓库
5. 项目根目录选择 `apps/marketing-radar`
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

## 后续计划

- 接入真实信源抓取（RSS / API / HTML scraper）
- AI 五维评分 + 规则引擎精选
- 事件聚类和去重
- 真实原文链接替换
- 用户登录和个性化推送
- 每日自动日报和飞书/邮件推送
