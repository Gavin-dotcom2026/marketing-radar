const categories = ["全部", "平台动态", "品牌案例", "行业趋势", "报告数据", "创意观点"];

const demoItems = [
  {
    id: "item_001",
    title: "茉莉奶白来「支持」采茶阿姨了！",
    sourceName: "SocialBeta",
    sourceHandle: "@socialbeta",
    sourceTier: "T2",
    sourceType: "营销媒体",
    publishedAt: "2026-05-07T10:30:00+08:00",
    category: "品牌案例",
    score: 76,
    isFeatured: true,
    summary: "茉莉奶白围绕采茶阿姨做公益叙事，用温暖的情感故事建立品牌好感度。",
    recommendation: "茶饮品牌可以参考这种'供应链故事化'的打法，把原料端变成品牌内容资产。",
    tags: ["茶饮", "公益营销", "品牌故事"],
    entities: ["茉莉奶白", "茶饮", "公益"],
    originalUrl: "https://socialbeta.com/",
    scores: { spread: 78, reusable: 80, commercial: 72, freshness: 82, credibility: 72 }
  },
  {
    id: "item_002",
    title: "每日黑巧携手 SOU・SOU 推出春日限定礼盒",
    sourceName: "SocialBeta",
    sourceHandle: "@socialbeta",
    sourceTier: "T2",
    sourceType: "营销媒体",
    publishedAt: "2026-05-07T09:45:00+08:00",
    category: "品牌案例",
    score: 73,
    isFeatured: false,
    summary: "季节性联名礼盒结合日系设计品牌，用限定感和视觉差异化驱动社媒传播。",
    recommendation: "食品品牌做联名时，选择设计感强的小众品牌比流量 IP 更容易做出质感。",
    tags: ["联名", "限定礼盒", "食品"],
    entities: ["每日黑巧", "SOU・SOU", "食品"],
    originalUrl: "https://socialbeta.com/",
    scores: { spread: 74, reusable: 76, commercial: 70, freshness: 78, credibility: 72 }
  },
  {
    id: "item_003",
    title: "多邻国把麦当劳的铲子「偷」火了？",
    sourceName: "SocialBeta",
    sourceHandle: "@socialbeta",
    sourceTier: "T2",
    sourceType: "营销媒体",
    publishedAt: "2026-05-06T16:00:00+08:00",
    category: "创意观点",
    score: 82,
    isFeatured: true,
    summary: "多邻国与麦当劳的跨界互动引爆社媒讨论，核心是品牌人格化带来的'梗'传播力。",
    recommendation: "品牌社媒人格化运营的极致案例，适合所有想做年轻化社媒的品牌研究其'人设'逻辑。",
    tags: ["跨界互动", "社媒人格化", "品牌梗"],
    entities: ["多邻国", "麦当劳", "社媒"],
    originalUrl: "https://socialbeta.com/",
    scores: { spread: 92, reusable: 84, commercial: 70, freshness: 85, credibility: 72 }
  },
  {
    id: "item_004",
    title: "金典让常温奶迈进「鲜活时代」",
    sourceName: "SocialBeta",
    sourceHandle: "@socialbeta",
    sourceTier: "T2",
    sourceType: "营销媒体",
    publishedAt: "2026-05-06T14:00:00+08:00",
    category: "品牌案例",
    score: 75,
    isFeatured: false,
    summary: "金典通过产品重新定位，把常温奶从'保质期长'的弱势变成'锁鲜技术'的优势叙事。",
    recommendation: "成熟品类做增长，核心是重新定义消费者的比较框架，而不是加功能。",
    tags: ["产品定位", "乳制品", "品牌升级"],
    entities: ["金典", "伊利", "乳制品"],
    originalUrl: "https://socialbeta.com/",
    scores: { spread: 70, reusable: 78, commercial: 76, freshness: 74, credibility: 74 }
  },
  {
    id: "item_005",
    title: "哈啰官宣黄渤为品牌代言人",
    sourceName: "SocialBeta",
    sourceHandle: "@socialbeta",
    sourceTier: "T2",
    sourceType: "营销媒体",
    publishedAt: "2026-05-05T11:00:00+08:00",
    category: "品牌案例",
    score: 71,
    isFeatured: false,
    summary: "哈啰选择黄渤做代言，锚定大众化、接地气的品牌调性，配合周年节点发布。",
    recommendation: "出行品牌选代言人的逻辑是'可信的日常感'，不是流量明星。",
    tags: ["代言人", "出行", "品牌传播"],
    entities: ["哈啰", "黄渤", "出行"],
    originalUrl: "https://socialbeta.com/",
    scores: { spread: 72, reusable: 68, commercial: 74, freshness: 72, credibility: 72 }
  },
  {
    id: "item_006",
    title: "优衣库打造「随时随地」五一小剧场",
    sourceName: "SocialBeta",
    sourceHandle: "@socialbeta",
    sourceTier: "T2",
    sourceType: "营销媒体",
    publishedAt: "2026-05-05T09:30:00+08:00",
    category: "创意观点",
    score: 74,
    isFeatured: false,
    summary: "优衣库用短场景视频展示日常穿搭的多场景适配，强调产品百搭属性而非促销。",
    recommendation: "服装品牌在节日大促期间选择'不打折、打内容'是一种差异化策略。",
    tags: ["服装", "内容营销", "节日"],
    entities: ["优衣库", "五一", "服装"],
    originalUrl: "https://socialbeta.com/",
    scores: { spread: 73, reusable: 76, commercial: 72, freshness: 74, credibility: 74 }
  },
  {
    id: "item_007",
    title: "喜茶的拙趣设计，好学吗？",
    sourceName: "数英",
    sourceHandle: "@digitaling",
    sourceTier: "T2",
    sourceType: "营销媒体",
    publishedAt: "2026-05-06T15:00:00+08:00",
    category: "创意观点",
    score: 79,
    isFeatured: true,
    summary: "讨论喜茶近年视觉风格从精致转向日常、拙朴的品牌表达策略为何有效。",
    recommendation: "品牌视觉不一定越精致越好，'不完美'反而能建立更强的亲近感和辨识度。",
    tags: ["品牌设计", "视觉策略", "茶饮"],
    entities: ["喜茶", "品牌设计", "茶饮"],
    originalUrl: "https://www.digitaling.com/articles",
    scores: { spread: 80, reusable: 82, commercial: 74, freshness: 78, credibility: 74 }
  },
  {
    id: "item_008",
    title: "品牌祛魅：东鹏0糖、宋柚汁的教训是什么？",
    sourceName: "数英",
    sourceHandle: "@digitaling",
    sourceTier: "T2",
    sourceType: "营销媒体",
    publishedAt: "2026-05-05T14:00:00+08:00",
    category: "行业趋势",
    score: 80,
    isFeatured: true,
    summary: "从两个品牌降温案例回看年轻消费环境下的品牌风险：热度来得快去得也快。",
    recommendation: "新消费品牌需要区分'热度'和'心智'，后者才是持续增长的根基。",
    tags: ["品牌风险", "新消费", "饮料"],
    entities: ["东鹏", "宋柚汁", "新消费"],
    originalUrl: "https://www.digitaling.com/articles",
    scores: { spread: 78, reusable: 84, commercial: 78, freshness: 76, credibility: 76 }
  },
  {
    id: "item_009",
    title: "社区营造，正在成为商业的新变量",
    sourceName: "数英",
    sourceHandle: "@digitaling",
    sourceTier: "T2",
    sourceType: "营销媒体",
    publishedAt: "2026-05-04T16:00:00+08:00",
    category: "行业趋势",
    score: 78,
    isFeatured: true,
    summary: "社区营造从空间和人群连接出发，正在变成新的商业抓手和品牌触达方式。",
    recommendation: "线下零售和地产商业应关注社区营造的商业化路径，这不是公益而是增长策略。",
    tags: ["社区", "线下商业", "新零售"],
    entities: ["社区营造", "线下", "商业地产"],
    originalUrl: "https://www.digitaling.com/articles",
    scores: { spread: 74, reusable: 82, commercial: 76, freshness: 78, credibility: 74 }
  },
  {
    id: "item_010",
    title: "热点来了，为什么出圈的品牌不是你？",
    sourceName: "数英",
    sourceHandle: "@digitaling",
    sourceTier: "T2",
    sourceType: "营销媒体",
    publishedAt: "2026-04-30T11:00:00+08:00",
    category: "创意观点",
    score: 77,
    isFeatured: true,
    summary: "分析借势传播失灵的原因，强调'被用户想起'比短暂曝光更关键。",
    recommendation: "借势营销的关键不是速度，而是品牌与热点之间的'天然关联度'。",
    tags: ["借势营销", "传播", "出圈"],
    entities: ["热点营销", "社媒", "传播"],
    originalUrl: "https://www.digitaling.com/articles",
    scores: { spread: 80, reusable: 78, commercial: 72, freshness: 74, credibility: 74 }
  },
  {
    id: "item_011",
    title: "杰士邦五一在江苏街头打响即时零售整合战",
    sourceName: "数英",
    sourceHandle: "@digitaling",
    sourceTier: "T2",
    sourceType: "营销媒体",
    publishedAt: "2026-04-30T09:30:00+08:00",
    category: "品牌案例",
    score: 76,
    isFeatured: true,
    summary: "线下场景联动即时零售的整合案例，围绕场景化心智做消费渗透。",
    recommendation: "即时零售 + 线下场景的组合适合高频消费品，核心是让'需要'和'买到'之间零延迟。",
    tags: ["即时零售", "线下", "整合营销"],
    entities: ["杰士邦", "即时零售", "美团"],
    originalUrl: "https://www.digitaling.com/articles",
    scores: { spread: 76, reusable: 78, commercial: 76, freshness: 74, credibility: 72 }
  },
  {
    id: "item_012",
    title: "伊利×胡兵：今年的春夏大秀赛道伊利闯进来了",
    sourceName: "广告门",
    sourceHandle: "@adquan",
    sourceTier: "T2",
    sourceType: "行业媒体",
    publishedAt: "2026-05-06T17:00:00+08:00",
    category: "品牌案例",
    score: 74,
    isFeatured: false,
    summary: "伊利用 AI 和胡兵做时装秀风格的品牌激活，把乳品品牌带入时尚场域。",
    recommendation: "跨品类的表达方式能打破消费者的认知惯性，但需要执行品质支撑。",
    tags: ["跨界", "AI创意", "乳制品"],
    entities: ["伊利", "胡兵", "AI"],
    originalUrl: "https://www.adquan.com/",
    scores: { spread: 74, reusable: 72, commercial: 72, freshness: 78, credibility: 70 }
  },
  {
    id: "item_013",
    title: "B站五四短片《赢》：献给正在折腾的年轻人",
    sourceName: "广告门",
    sourceHandle: "@adquan",
    sourceTier: "T2",
    sourceType: "行业媒体",
    publishedAt: "2026-05-06T14:30:00+08:00",
    category: "创意观点",
    score: 75,
    isFeatured: true,
    summary: "B站五四短片延续平台对年轻人的情感连接，用'赢'的重新定义做价值观输出。",
    recommendation: "平台品牌片的价值在于定义社区文化，而不是拿播放量，适合长期主义品牌参考。",
    tags: ["品牌片", "青年文化", "B站"],
    entities: ["B站", "青年", "品牌片"],
    originalUrl: "https://www.adquan.com/",
    scores: { spread: 78, reusable: 74, commercial: 68, freshness: 80, credibility: 74 }
  },
  {
    id: "item_014",
    title: "AI 能让触达更精准，但泰兰尼斯为什么还在坚持古法营销？",
    sourceName: "广告门",
    sourceHandle: "@adquan",
    sourceTier: "T2",
    sourceType: "行业媒体",
    publishedAt: "2026-05-06T11:00:00+08:00",
    category: "行业趋势",
    score: 77,
    isFeatured: true,
    summary: "童鞋品牌泰兰尼斯在 AI 精准投放时代仍选择高曝光传统营销，探讨其背后逻辑。",
    recommendation: "品类认知阶段决定营销策略：新品类需要广度曝光建认知，成熟品类才适合精准收割。",
    tags: ["传统营销", "品类策略", "母婴"],
    entities: ["泰兰尼斯", "童鞋", "AI"],
    originalUrl: "https://www.adquan.com/",
    scores: { spread: 72, reusable: 80, commercial: 76, freshness: 78, credibility: 72 }
  },
  {
    id: "item_015",
    title: "世界杯版权费有没有泡沫？",
    sourceName: "广告门",
    sourceHandle: "@adquan",
    sourceTier: "T2",
    sourceType: "行业媒体",
    publishedAt: "2026-05-07T11:00:00+08:00",
    category: "行业趋势",
    score: 81,
    isFeatured: true,
    summary: "探讨世界杯版权在中国市场是否仍能为品牌和媒体提供足够的商业回报。",
    recommendation: "体育营销预算分配需要重新评估大赛IP vs 日常赛事社区运营的 ROI。",
    tags: ["体育营销", "版权", "世界杯"],
    entities: ["世界杯", "体育", "版权"],
    originalUrl: "https://www.adquan.com/",
    scores: { spread: 82, reusable: 78, commercial: 82, freshness: 84, credibility: 76 }
  },
  {
    id: "item_016",
    title: "星巴克、安慕希、乐高、理想、三角洲行动、美团 — 4月品牌谁最反差",
    sourceName: "广告门",
    sourceHandle: "@adquan",
    sourceTier: "T2",
    sourceType: "行业媒体",
    publishedAt: "2026-05-02T10:00:00+08:00",
    category: "品牌案例",
    score: 78,
    isFeatured: true,
    summary: "月度盘点对比多个品牌的反差营销动作，从不同行业找到共性打法。",
    recommendation: "'反差感'是当下低成本出圈的核心机制，适合做月度创意选题参考。",
    tags: ["月度盘点", "反差营销", "多品牌"],
    entities: ["星巴克", "乐高", "美团"],
    originalUrl: "https://www.adquan.com/",
    scores: { spread: 80, reusable: 80, commercial: 74, freshness: 76, credibility: 72 }
  },
  {
    id: "item_017",
    title: "卫生纸也能做爆款？创始人马桶直播 50 小时，捐 50% 利润",
    sourceName: "Morketing",
    sourceHandle: "@morketing",
    sourceTier: "T2",
    sourceType: "营销媒体",
    publishedAt: "2026-05-07T10:38:00+08:00",
    category: "品牌案例",
    score: 80,
    isFeatured: true,
    summary: "Who Gives A Crap 用极端直播 + 公益捐赠驱动品牌知名度，低成本高传播的 DTC 打法。",
    recommendation: "创始人 IP + 极端行为 + 公益承诺的三连组合适合新品牌冷启动，但需要真实感。",
    tags: ["DTC", "直播", "公益"],
    entities: ["Who Gives A Crap", "DTC", "直播"],
    originalUrl: "https://www.morketing.com/",
    scores: { spread: 86, reusable: 80, commercial: 72, freshness: 84, credibility: 72 }
  },
  {
    id: "item_018",
    title: "何润东'零成本'翻红：爆款生产权从品牌转移到用户侧",
    sourceName: "Morketing",
    sourceHandle: "@morketing",
    sourceTier: "T2",
    sourceType: "营销媒体",
    publishedAt: "2026-05-07T10:20:00+08:00",
    category: "行业趋势",
    score: 78,
    isFeatured: true,
    summary: "何润东的翻红案例说明：爆款内容的生产权正在从品牌/明星转移到用户侧。",
    recommendation: "品牌需要从'制造爆款'转向'提供爆款素材'，让用户成为传播的主体。",
    tags: ["用户共创", "翻红", "社媒传播"],
    entities: ["何润东", "UGC", "社媒"],
    originalUrl: "https://www.morketing.com/",
    scores: { spread: 84, reusable: 78, commercial: 70, freshness: 82, credibility: 70 }
  },
  {
    id: "item_019",
    title: "AI Native 时代，新营销到底怎么做？",
    sourceName: "Morketing",
    sourceHandle: "@morketing",
    sourceTier: "T2",
    sourceType: "营销媒体",
    publishedAt: "2026-05-07T09:48:00+08:00",
    category: "行业趋势",
    score: 83,
    isFeatured: true,
    summary: "AI 原生时代的营销讨论实录：从工具辅助到重新定义营销团队的工作方式。",
    recommendation: "营销团队应开始思考'AI 原生'的组织结构，而不只是把 AI 当工具用。",
    tags: ["AI营销", "组织变革", "效率"],
    entities: ["AI", "营销", "组织"],
    originalUrl: "https://www.morketing.com/",
    scores: { spread: 78, reusable: 86, commercial: 84, freshness: 84, credibility: 76 }
  },
  {
    id: "item_020",
    title: "LVMH 出售多家品牌；OpenAI 推出自助广告管理器；豆包开始收费",
    sourceName: "Morketing",
    sourceHandle: "@morketing",
    sourceTier: "T2",
    sourceType: "营销媒体",
    publishedAt: "2026-05-06T09:57:00+08:00",
    category: "平台动态",
    score: 79,
    isFeatured: true,
    summary: "日报速览：LVMH 品牌组合调整、OpenAI 进军广告工具、字节豆包商业化提速。",
    recommendation: "OpenAI 自助广告管理器值得关注，可能改变中小品牌的广告投放门槛。",
    tags: ["日报", "奢侈品", "AI广告"],
    entities: ["LVMH", "OpenAI", "豆包"],
    originalUrl: "https://www.morketing.com/",
    scores: { spread: 76, reusable: 74, commercial: 84, freshness: 86, credibility: 74 }
  },
  {
    id: "item_021",
    title: "喜茶北京泡泡玛特城市乐园店开业",
    sourceName: "Morketing",
    sourceHandle: "@morketing",
    sourceTier: "T2",
    sourceType: "营销媒体",
    publishedAt: "2026-04-30T13:02:00+08:00",
    category: "品牌案例",
    score: 73,
    isFeatured: false,
    summary: "喜茶在泡泡玛特城市乐园开设主题店，IP 联动 + 场景零售的组合。",
    recommendation: "茶饮品牌的场景化开店策略值得关注，门店选址即内容选题。",
    tags: ["茶饮", "IP联动", "线下"],
    entities: ["喜茶", "泡泡玛特", "线下"],
    originalUrl: "https://www.morketing.com/",
    scores: { spread: 74, reusable: 72, commercial: 72, freshness: 74, credibility: 72 }
  },
  {
    id: "item_022",
    title: "QuestMobile 2026 中国移动互联网春季大报告：结构性大变局来临",
    sourceName: "QuestMobile",
    sourceHandle: "@questmobile",
    sourceTier: "T1.5",
    sourceType: "数据平台",
    publishedAt: "2026-04-28T10:00:00+08:00",
    category: "报告数据",
    score: 88,
    isFeatured: true,
    summary: "用户跨行业、跨终端迁移加速，部分行业黏性飙涨，流量格局正在重构。",
    recommendation: "品牌媒介规划需根据用户迁移趋势调整触达策略，跨端投放不再是加分项而是必选项。",
    tags: ["移动互联网", "用户迁移", "流量格局"],
    entities: ["移动互联网", "用户", "终端"],
    originalUrl: "https://www.questmobile.com.cn/blog/blog-new.html",
    scores: { spread: 82, reusable: 90, commercial: 90, freshness: 86, credibility: 94 }
  },
  {
    id: "item_023",
    title: "QuestMobile 2026 Q1 AI 应用洞察：豆包月活 3.4 亿领跑",
    sourceName: "QuestMobile",
    sourceHandle: "@questmobile",
    sourceTier: "T1.5",
    sourceType: "数据平台",
    publishedAt: "2026-04-21T10:00:00+08:00",
    category: "报告数据",
    score: 85,
    isFeatured: true,
    summary: "豆包、千问、DeepSeek 月活分别达 3.4 亿、1.7 亿、1.3 亿，AI 应用竞争进入下半场。",
    recommendation: "AI 应用的用户规模已足够大，品牌应开始考虑在 AI 应用内的营销触达机会。",
    tags: ["AI应用", "月活数据", "豆包"],
    entities: ["豆包", "千问", "DeepSeek"],
    originalUrl: "https://www.questmobile.com.cn/blog/blog-new.html",
    scores: { spread: 80, reusable: 84, commercial: 86, freshness: 82, credibility: 94 }
  },
  {
    id: "item_024",
    title: "QuestAuto：2026 Q1 新能源汽车市场盘点，TOP10 厂商活跃量均超百万",
    sourceName: "QuestMobile",
    sourceHandle: "@questmobile",
    sourceTier: "T1.5",
    sourceType: "数据平台",
    publishedAt: "2026-04-29T10:00:00+08:00",
    category: "报告数据",
    score: 79,
    isFeatured: true,
    summary: "新能源汽车活跃用户突破 4200 万，蔚来以微弱优势力压赛力斯进入 TOP5。",
    recommendation: "汽车品牌的数字化触点已足够密集，车主社区和 OTA 更新是新的营销渠道。",
    tags: ["新能源", "汽车", "用户规模"],
    entities: ["蔚来", "赛力斯", "新能源"],
    originalUrl: "https://www.questmobile.com.cn/blog/blog-new.html",
    scores: { spread: 74, reusable: 80, commercial: 82, freshness: 78, credibility: 92 }
  },
  {
    id: "item_025",
    title: "泉州文旅给一把椅子开了新品发布会",
    sourceName: "广告门",
    sourceHandle: "@adquan",
    sourceTier: "T2",
    sourceType: "行业媒体",
    publishedAt: "2026-04-30T14:00:00+08:00",
    category: "创意观点",
    score: 79,
    isFeatured: true,
    summary: "泉州文旅用'给椅子开发布会'的荒诞创意传递城市'松弛感'定位。",
    recommendation: "城市文旅营销的核心不是景点罗列，而是用一个记忆点锚定城市人格。",
    tags: ["文旅", "城市营销", "创意"],
    entities: ["泉州", "文旅", "城市营销"],
    originalUrl: "https://www.adquan.com/",
    scores: { spread: 84, reusable: 80, commercial: 70, freshness: 78, credibility: 72 }
  },
  {
    id: "item_026",
    title: "Apple 母亲节文案出炉，比去年差远了",
    sourceName: "数英",
    sourceHandle: "@digitaling",
    sourceTier: "T2",
    sourceType: "营销媒体",
    publishedAt: "2026-04-30T15:00:00+08:00",
    category: "创意观点",
    score: 74,
    isFeatured: false,
    summary: "对比苹果在两岸三地的母亲节文案差异，适合看全球品牌的本地化执行水平。",
    recommendation: "全球品牌的区域文案对比是很好的学习素材，关键看'情感精度'而非'创意高度'。",
    tags: ["Apple", "节日文案", "本地化"],
    entities: ["Apple", "母亲节", "文案"],
    originalUrl: "https://www.digitaling.com/articles",
    scores: { spread: 76, reusable: 72, commercial: 66, freshness: 78, credibility: 74 }
  },
  {
    id: "item_027",
    title: "青岛啤酒升级：消失的中年味",
    sourceName: "数英",
    sourceHandle: "@digitaling",
    sourceTier: "T2",
    sourceType: "营销媒体",
    publishedAt: "2026-04-29T10:00:00+08:00",
    category: "品牌案例",
    score: 72,
    isFeatured: false,
    summary: "解读青岛啤酒的包装和视觉更新，重点是'简化'如何帮老品牌摆脱年龄标签。",
    recommendation: "老品牌年轻化的关键不是加潮流元素，而是减掉那些让它'显老'的东西。",
    tags: ["品牌升级", "包装设计", "啤酒"],
    entities: ["青岛啤酒", "品牌升级", "啤酒"],
    originalUrl: "https://www.digitaling.com/articles",
    scores: { spread: 70, reusable: 76, commercial: 70, freshness: 72, credibility: 72 }
  },
  {
    id: "item_028",
    title: "余承东：中国汽车缺的不是技术，是审美",
    sourceName: "Morketing",
    sourceHandle: "@morketing",
    sourceTier: "T2",
    sourceType: "营销媒体",
    publishedAt: "2026-05-07T10:28:00+08:00",
    category: "行业趋势",
    score: 76,
    isFeatured: true,
    summary: "余承东关于汽车设计审美的观点引发讨论，指向产品力中'非技术因素'的权重正在上升。",
    recommendation: "汽车营销的竞争维度正在从性能参数转向设计语言和情感价值。",
    tags: ["汽车", "设计", "产品力"],
    entities: ["华为", "汽车", "设计"],
    originalUrl: "https://www.morketing.com/",
    scores: { spread: 78, reusable: 74, commercial: 74, freshness: 82, credibility: 72 }
  },
  {
    id: "item_029",
    title: "蜜雪冰城用接水小猫方师傅做社媒传播",
    sourceName: "SocialBeta",
    sourceHandle: "@socialbeta",
    sourceTier: "T2",
    sourceType: "营销媒体",
    publishedAt: "2026-05-06T10:00:00+08:00",
    category: "品牌案例",
    score: 75,
    isFeatured: true,
    summary: "蜜雪冰城用一只网红猫做品牌联动，meme 驱动的轻量传播成本极低。",
    recommendation: "宠物 IP + 品牌梗的组合是当下最轻的社媒内容打法，适合预算有限的品牌。",
    tags: ["meme", "宠物IP", "茶饮"],
    entities: ["蜜雪冰城", "宠物IP", "社媒"],
    originalUrl: "https://socialbeta.com/",
    scores: { spread: 82, reusable: 74, commercial: 68, freshness: 78, credibility: 70 }
  },
  {
    id: "item_030",
    title: "从硅谷爆款到卖身清盘，Allbirds 做错了什么？",
    sourceName: "Morketing",
    sourceHandle: "@morketing",
    sourceTier: "T2",
    sourceType: "营销媒体",
    publishedAt: "2026-04-17T10:25:00+08:00",
    category: "行业趋势",
    score: 82,
    isFeatured: true,
    summary: "Allbirds 从 DTC 明星到清盘的复盘：产品差异化消失后，品牌溢价无法支撑增长。",
    recommendation: "DTC 品牌必须持续投入产品创新，单靠品牌故事和渠道效率不可持续。",
    tags: ["DTC", "品牌衰退", "鞋服"],
    entities: ["Allbirds", "DTC", "运动"],
    originalUrl: "https://www.morketing.com/",
    scores: { spread: 80, reusable: 86, commercial: 78, freshness: 72, credibility: 76 }
  }
];

let items = demoItems;
let dataMode = "demo";
let dailySummary = "";

const state = {
  view: "featured",
  category: "全部",
  tier: "all",
  search: ""
};

const $ = (sel) => document.querySelector(sel);

async function init() {
  await loadLiveData();
  renderFilters();
  renderView();
  bindEvents();
  updateControlsVisibility();
  updateClearBtn();
}

async function loadLiveData() {
  try {
    const response = await fetch("./data.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    if (!Array.isArray(payload.items) || !payload.items.length) throw new Error("empty items");
    items = payload.items;
    dataMode = "live";
    dailySummary = payload.dailySummary || "";
    const generatedAt = payload.generatedAt ? new Date(payload.generatedAt) : null;
    const modeLabel = payload.mode === "ai" ? "AI 分析" : "规则分析";
    $("#dataStatus").textContent = generatedAt
      ? `Live · ${modeLabel} · 最近更新 ${formatDateTime(generatedAt)}`
      : `Live · ${modeLabel}`;
  } catch (error) {
    items = demoItems;
    dataMode = "demo";
    $("#dataStatus").textContent = "Prototype · 当前内容为示例数据，链接仅用于来源参考";
    console.info(`Using demo data: ${error.message}`);
  }
}

function bindEvents() {
  $("#searchInput").addEventListener("input", (e) => {
    state.search = e.target.value.trim().toLowerCase();
    updateClearBtn();
    renderView();
  });
  $("#tierFilter").addEventListener("change", (e) => {
    state.tier = e.target.value;
    updateClearBtn();
    renderView();
  });
  $("#clearBtn").addEventListener("click", clearFilters);
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => switchView(btn.dataset.view));
  });
}

function hasActiveFilters() {
  return state.search !== "" || state.category !== "全部" || state.tier !== "all";
}

function updateClearBtn() {
  $("#clearBtn").style.display = hasActiveFilters() ? "" : "none";
}

function clearFilters() {
  state.search = "";
  state.category = "全部";
  state.tier = "all";
  $("#searchInput").value = "";
  $("#tierFilter").value = "all";
  renderFilters();
  updateClearBtn();
  renderView();
}

function switchView(view) {
  state.view = view;
  document.querySelectorAll(".nav-btn").forEach((b) => b.classList.toggle("active", b.dataset.view === view));
  document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
  $(`#${view}View`).classList.add("active");
  updateControlsVisibility();
  renderView();
}

function updateControlsVisibility() {
  const show = state.view === "featured" || state.view === "all";
  $("#globalControls").style.display = show ? "" : "none";
}


function renderView() {
  switch (state.view) {
    case "featured": renderTimeline("featuredTimeline", getFiltered(true)); break;
    case "all": renderTimeline("allTimeline", getFiltered(false)); break;
    case "daily": renderDaily(); break;
    case "fmcg": renderIndustry("fmcg", "fmcgTimeline"); break;
    case "baby": renderIndustry("baby", "babyTimeline"); break;
    case "tech3c": renderIndustry("tech3c", "tech3cTimeline"); break;
  }
}

function ageHours(iso) {
  return Math.max(0, (Date.now() - new Date(iso).getTime()) / 36e5);
}

function displayRank(item) {
  const freshness = Math.max(0, 100 - ageHours(item.publishedAt) * 0.8);
  return item.score * 0.82 + freshness * 0.18;
}

function getFiltered(onlyFeatured) {
  const filtered = items.filter((item) => {
    if (onlyFeatured && !item.isFeatured) return false;
    if (state.category !== "全部" && item.category !== state.category) return false;
    if (state.tier !== "all" && item.sourceTier !== state.tier) return false;
    if (state.search) {
      const hay = [item.title, item.sourceName, item.category, item.summary, ...item.tags, ...item.entities].join(" ").toLowerCase();
      if (!hay.includes(state.search)) return false;
    }
    return true;
  });
  if (onlyFeatured) {
    return filtered.sort((a, b) => displayRank(b) - displayRank(a));
  }
  return filtered.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
}

function renderFilters() {
  $("#categoryFilters").innerHTML = categories
    .map((c) => `<button class="${c === state.category ? 'active' : ''}" data-cat="${c}">${c}</button>`)
    .join("");
  document.querySelectorAll("[data-cat]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.category = btn.dataset.cat;
      renderFilters();
      updateClearBtn();
      renderView();
    });
  });
}

function groupByDate(list) {
  const groups = new Map();
  list.forEach((item) => {
    const d = new Date(item.publishedAt);
    const key = `${d.getMonth() + 1}月${d.getDate()}日`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  });
  return groups;
}

function formatTime(iso) {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function formatDateTime(date) {
  return `${date.getMonth() + 1}月${date.getDate()}日 ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function renderTimeline(containerId, list) {
  const container = $(`#${containerId}`);
  if (!list.length) {
    const parts = [];
    if (state.search) parts.push(`关键词"${state.search}"`);
    parts.push(state.category === "全部" ? "全部分类" : state.category);
    parts.push(state.tier === "all" ? "全部信源" : state.tier);
    container.innerHTML = `
      <div class="empty-state">
        <h3>没有匹配的内容</h3>
        <p>当前筛选：${parts.join(' · ')}</p>
        <button class="clear-btn" onclick="clearFilters()">清空筛选</button>
      </div>`;
    return;
  }
  const groups = groupByDate(list);
  let html = '';
  groups.forEach((dateItems, dateLabel) => {
    html += `<div class="date-group"><div class="date-label">${dateLabel}</div><div class="timeline-items">`;
    dateItems.forEach((item, idx) => {
      const isLast = idx === dateItems.length - 1;
      html += renderTimelineRow(item, isLast);
    });
    html += '</div></div>';
  });
  container.innerHTML = html;
}

function renderTimelineRow(item, isLast) {
  return `
    <div class="timeline-row">
      <div class="time-col">
        <div class="time">${formatTime(item.publishedAt)}</div>
        <div class="dot"></div>
        <div class="line" ${isLast ? 'style="opacity:0"' : ''}></div>
      </div>
      ${renderCard(item)}
    </div>
  `;
}

function renderCard(item) {
  return `
    <article class="card">
      <div class="card-top">
        <div class="card-meta">
          <span class="card-source">${item.sourceName}</span>
          <span class="card-handle">${item.sourceHandle || ''}</span>
          <span>${item.sourceTier} · ${item.sourceType}</span>
        </div>
        <div class="card-badges">
          ${item.isFeatured ? '<span class="card-featured-badge">精选</span>' : ''}
          <span class="card-score">${item.score}</span>
        </div>
      </div>
      <h3 class="card-title">${item.title}</h3>
      <p class="card-summary">${item.summary}</p>
      ${item.recommendation ? `<p class="card-recommendation"><span class="card-rec-label">推荐理由：</span>${item.recommendation}</p>` : ''}
      <div class="card-tags">
        <span class="tag cat">${item.category}</span>
        ${item.tags.map((t) => `<span class="tag">${t}</span>`).join('')}
      </div>
      <div class="card-footer">
        <span class="card-scores"><span>传播 ${item.scores.spread}</span><span>借鉴 ${item.scores.reusable}</span><span>商业 ${item.scores.commercial}</span><span>时效 ${item.scores.freshness}</span><span>可信 ${item.scores.credibility}</span></span>
        <a class="card-link" href="${item.originalUrl}" target="_blank" rel="noreferrer">${dataMode === "live" ? "原文" : "示例来源"} →</a>
      </div>
    </article>
  `;
}

function renderDaily() {
  const cats = categories.slice(1);
  let summaryHtml = '';
  if (dailySummary) {
    summaryHtml = `
      <div class="daily-summary">
        <h3>今日营销洞察</h3>
        <p>${dailySummary}</p>
      </div>
    `;
  }
  $("#dailyGrid").innerHTML = summaryHtml + cats.map((cat) => {
    const group = items.filter((i) => i.category === cat && i.isFeatured).sort((a, b) => b.score - a.score).slice(0, 5);
    return `
      <section class="daily-section">
        <h3>${cat}<span style="opacity:0.5;font-weight:400;margin-left:8px">${group.length} 条</span></h3>
        ${group.map((i) => `
          <div class="daily-item">
            <h4>${i.title}</h4>
            <p>${i.summary}</p>
          </div>
        `).join('')}
      </section>
    `;
  }).join('');
}

const industryKeywords = {
  fmcg: ["食品", "饮料", "日化", "美妆", "个护", "护肤", "洗护", "零食", "乳制品", "啤酒", "白酒", "茶饮", "咖啡", "奶茶", "可口可乐", "百事", "宝洁", "联合利华", "欧莱雅", "雀巢", "伊利", "蒙牛", "农夫山泉", "元气森林", "喜茶", "瑞幸", "星巴克", "蜜雪冰城", "奈雪", "茉莉奶白", "每日黑巧", "青岛啤酒", "金典", "安慕希", "美年达", "coca-cola", "pepsi", "unilever", "p&g", "nestlé", "nestle", "starbucks", "fmcg", "cpg", "snack", "dairy", "skincare"],
  baby: ["母婴", "童装", "亲子", "育儿", "婴儿", "奶粉", "婴配粉", "纸尿裤", "童鞋", "儿童", "早教", "玩具", "孕产", "贝拉米", "飞鹤", "泰兰尼斯", "好奇", "帮宝适", "巴拉巴拉", "乐高", "infant", "toddler", "maternity", "diaper", "lego", "pampers"],
  tech3c: ["手机", "数码", "家电", "笔记本", "平板", "耳机", "芯片", "半导体", "新能源汽车", "电动车", "华为", "小米", "OPPO", "vivo", "三星", "索尼", "戴森", "大疆", "特斯拉", "蔚来", "理想汽车", "比亚迪", "iphone", "samsung", "xiaomi", "huawei", "sony", "dyson", "tesla", "smartphone", "qualcomm", "智能手机", "智能家居"]
};

const industryExclude = {
  baby: ["toyota", "汽车", "ev push", "电动车"],
  tech3c: ["beverage", "beer", "unilever", "ab inbev", "啤酒", "饮料", "food", "dollar general", "streaming", "linkedin", "cmo", "agentic ai", "a/b test", "email"],
  fmcg: []
};

function filterByIndustry(industry) {
  const keywords = industryKeywords[industry] || [];
  const exclude = industryExclude[industry] || [];
  return items.filter((item) => {
    const hay = [item.title, item.summary, ...(item.tags || []), ...(item.entities || [])].join(" ").toLowerCase();
    if (!keywords.some((kw) => hay.includes(kw.toLowerCase()))) return false;
    if (exclude.some((ex) => hay.includes(ex.toLowerCase()))) return false;
    return true;
  }).sort((a, b) => b.score - a.score);
}

function renderIndustry(industry, containerId) {
  const list = filterByIndustry(industry);
  renderTimeline(containerId, list);
}

init();
