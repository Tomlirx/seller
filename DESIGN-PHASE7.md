# 岚玉 Phase 7 — 深色奢华改版 + UX 补齐（执行手册）

> 本文档是 Phase 7 全部设计决策与执行状态的唯一权威记录，供任何模型/会话无缝接手。
> 每完成一个子阶段：先 `npm run build` + Claude Preview 验证，再单独 commit，然后**更新本文档底部的执行状态表**。

## 背景与来源

用户要求 Review [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md)（70+ 知名品牌 DESIGN.md 设计系统），借鉴优秀设计全方位更新岚玉商城。已 Review Ferrari / Apple / Airbnb / Nike 四份文档，提炼的是**规矩**而非配色。

**用户已拍板的决策（勿再讨论）：**
1. 范围 = 视觉精修 + UX 补齐，分多个独立可验证 commit。
2. 方向 = **深色奢华珠宝风**（Cartier/Van Cleef 式）：暖黑画布（#1A1815，非纯黑）、米白文字、金色唯一强调色、**商品图保留浅色舞台**（"深墙上的画框"策略——商品实拍是浅灰底手机图，浅色卡片在深底上反而成为视觉焦点）、hero 保留浅色水墨摄影不加遮罩。
3. 保留中文双语文案、Noto Serif SC 标题、Inter/Noto Sans 正文。

**借鉴的设计规矩（写代码时必须遵守）：**
- Ferrari：display 字重 400-500 从不粗黑；8px 间距阶梯；唯一强调色且少用；CTA 大写 + `tracking-[0.12em]`；CTA/卡片 **0 圆角**；96px+ 章节留白。
- Apple：唯一 drop-shadow（`--shadow-product`）只给商品图，**chrome 永不加阴影**；按钮按压 `scale(0.95)`（已做成全局规则）；`:focus-visible` 2px 金色实线；章节用底色交替（canvas / canvas-soft）做分隔。
- Airbnb：表单输入 52px 高、1px 发丝边、聚焦=边框加粗为金色（`focus:border-gold focus:shadow-[inset_0_0_0_1px_var(--gold)]`，无 glow）；卡片 hover 单层级浮起。
- Nike：商品卡解剖 = 满铺方图（bg-stage）→ 名称(serif medium) → 分类副标(text-sm text-text-faint) → 价格(text-gold)；所有商品图统一浅色舞台 `--stage`；语义色只上文字；商品网格手机端 8px 缝（`gap-2 sm:gap-6`）。

## 令牌体系（globals.css，已实现）

| 令牌 | 值 | 用途 |
|---|---|---|
| `--canvas` | #1A1815 | 页面底（暖黑）|
| `--canvas-soft` | #201D19 | 交替章节底 |
| `--surface` | #26221D | 浮起 chrome：输入框/下拉/订单卡/骨架屏 |
| `--footer` | #141210 | 页脚 |
| `--stage` | #F2EDE5 | **唯一**浅色商品舞台 |
| `--stage-ink` / `--stage-ink-soft` | #5C4B3A / #6E5D49 | **压在浅色图像上的文字，永不随主题翻转**（hero 浮层、editorial 浮层、浅色图内占位符）|
| `--text` / `--text-muted` / `--text-faint` | #EDE7DC / #A99D8D / #8F8375 | 正文三档（14.4/6.7/4.8:1 对比度）|
| `--gold` / `--gold-deep` | #C9A479 / #B48A57 | 唯一强调色 / hover 深一档 |
| `--line` / `--line-strong` | #35302A / #4A4238 | 发丝线 |
| `--danger` / `--success` | #E5847C / #9DBBA7 | 语义色只上文字 |
| `--shadow-product` | 0 24px 48px -12px rgba(0,0,0,.5) | 唯一阴影，仅商品图 |

**别名翻转**：`--ivory→canvas、--ivory-light→surface、--ink→text、--ink-soft→text-muted、--gold-soft→gold-deep、--jade/--jade-deep→success`，因此存量 `bg-ivory`/`text-ink` 类自动变深色。

**⚠️ 关键坑（已踩过）**：CSS 自定义属性里的 `var()` 在**定义处**（:root）完成替换，子树覆盖不会重解析。所以 `.theme-light`（admin 浅色作用域，挂在 `src/app/admin/layout.tsx` 的 main 上）必须用**字面量**重新声明所有别名（--ivory/--ink/...），不能只覆盖 --text。globals.css 里已有正确实现，勿改回 var() 链。

**全局规则（@layer base，已实现）**：按钮/`[data-cta]` 按压 scale(0.95)；`:focus-visible` 2px 金色 outline；::selection 金底黑字。给链接型 CTA 记得加 `data-cta` 属性。

## 常用样式配方（新写代码直接抄）

- 主 CTA（金底）：`h-[52px] bg-gold text-canvas uppercase tracking-[0.12em] text-sm hover:bg-gold-deep transition-colors disabled:opacity-50`（0 圆角）
- 次 CTA（描边）：`border border-gold/40 text-gold px-8 py-4 text-sm uppercase tracking-[0.12em] hover:bg-gold hover:text-canvas transition-colors` + `data-cta`
- 表单输入：`h-[52px] w-full bg-surface border border-line px-4 text-ink placeholder:text-text-faint focus:outline-none focus:border-gold focus:shadow-[inset_0_0_0_1px_var(--gold)]`
- 页面头部三件套：`<p className="text-xs tracking-[0.3em] text-gold mb-3">EYEBROW</p>` + `<h1 className="font-serif text-3xl text-ink mb-4">标题</h1>` + `<Divider className="mb-8" />`
- 商品图容器：`bg-stage overflow-hidden relative`，hover 浮起 `group-hover:-translate-y-1 group-hover:shadow-[var(--shadow-product)] transition-[transform,box-shadow] duration-300`
- 状态芯片：`text-[11px] tracking-[0.15em] border px-2.5 py-1`（PAID 金字金边40%、PENDING muted、FULFILLED success、CANCELLED faint）
- "实物原图" badge：`bg-canvas/85 text-text-strong`（显式深底浅字，不随主题翻）

## 执行状态（接手时先看这里 + `git log --oneline -10`）

| 阶段 | 内容 | 状态 | commit |
|---|---|---|---|
| 7.1 | 令牌地基 + 全局规则 + admin `.theme-light` | ✅ 已提交 | `5b22e6a` |
| 7.2 | page.tsx/footer/nav 硬编码 hex 清扫，章节 canvas/canvas-soft A/B 交替 | ✅ 已提交 | `ebe0387` |
| 7.3 | hero 文字层 stage-ink 适配 + 移动端 isLight=true + CTA 大写 | ✅ 已提交 | `49184d6` |
| 7.4 | ProductCard Nike 解剖（+category 副标+价格+stage+浮起）、精选系列补价格、网格 gap-2 sm:gap-6、gallery 主图 shadow-product、category-grid stage | ✅ 已提交 | `706ed66` |
| 7.5 | login/signup/orders/success 纳入设计系统 + text-red-600→text-danger | ✅ 已提交 | `9f08eca` |
| 7.6 | UX 补齐：not-found.tsx / 两个 loading.tsx / OG 元数据 | ✅ 已提交 | `2f86cc4` |
| 7.7 | 收尾：其余 CTA 统一 + 全流程回归 + push | ✅ 完成 | 见 git log |

**Phase 7 全部完成。** 后续可选优化：珍珠类商品原图构图偏小（需重拍/重裁）；搜索与收藏功能仍是占位。

### 7.5 已完成明细（提交时用）
- `login/login-form.tsx`、`signup/page.tsx`：眉题 ACCOUNT + serif h1 + Divider + 大写字段 label + 52px 输入/按钮规范
- `orders/page.tsx`：PageContainer(max-w-3xl py-16) 头部三件套；STATUS_LABELS 芯片（待付款/已付款/已发货/已取消）；订单卡 `bg-surface border border-line p-6`；空状态 + 去逛逛 CTA
- `checkout/success/page.tsx`：`<ClearCartOnMount/>` 保留在最前；金圈对勾 SVG；ORDER CONFIRMED 眉题；双 CTA（金底查看订单/描边继续浏览）
- `text-red-600 → text-danger`：products/[slug]（Out of stock）、cart/page.tsx（2处）、buy-now-button、newsletter-form。admin 文件里的 red-600 **故意保留**（admin 不在本次范围）
- 建议 commit message 主题：`Bring auth, orders, and checkout-success into the design system`

### 7.6 待做规格（Next 16 约定已核对 node_modules/next/dist/docs；generateMetadata 的 params 是 Promise 必须 await）
1. **`src/app/not-found.tsx`**（新建）：PageContainer py-32 居中——眉题 PAGE NOT FOUND、serif 大号 404、Divider、muted 一行说明、双 CTA（返回首页 / 浏览品类）。会自动接住商品/分类页的 `notFound()`。
2. **`src/app/collections/[category]/loading.tsx`**（新建）：骨架屏对齐 7.4 卡片解剖——9 张 `aspect-square bg-surface animate-pulse` + 名称/分类/价格三条 bar，网格 `grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-6`。**用 bg-surface 别用 stage**（避免深色页面闪浅块）。
3. **`src/app/products/[slug]/loading.tsx`**（新建）：双栏骨架（左方图+缩略图行，右眉题/标题/价格/文字条/52px 按钮块）。
4. **元数据**：`layout.tsx` 加 `metadataBase`（`process.env.NEXT_PUBLIC_SITE_URL` 兜底 `http://localhost:3000`）+ `openGraph { siteName, locale: "zh_CN", type: "website", images: ["/marketing/lanyu-moongate.png"] }` + `twitter { card: "summary_large_image" }`；`products/[slug]/page.tsx` 加 `generateMetadata`（把商品查询提成 React `cache()` 帮助函数与页面共用，避免双查询；og image 用 `imageUrls[0]`）；`collections/[category]/page.tsx` 加 `generateMetadata`（用 `categoryLabel`）。

### 7.7 待做规格
- 清扫其余 CTA 至配方标准：`add-to-cart-button.tsx`、`buy-now-button.tsx`、`sticky-add-to-cart-bar.tsx`（bar 本体 `bg-surface border-t border-line`）、`newsletter-form.tsx`、`back-to-top.tsx`（去 shadow-lg → `border border-gold/40`，chrome 禁阴影）、cart 页结算按钮（现仍是 `bg-gold text-ivory-light rounded`→ 按主 CTA 配方去圆角）。
- 全流程回归（见下），然后 `git push`（用户惯例是每轮完成后 push）。

## 验证清单（每阶段执行）

1. `npm run build` 干净。
2. Claude Preview（launch.json 里 server 名 `seller-dev`，端口 3000）走全流程：首页 → /collections/BANGLE → 商品详情 → 加购（购物袋徽标+1）→ /cart → 结算按钮命中 /api/checkout。
3. login/signup/orders/checkout/success 渲染正常；admin（`/admin/products`）保持浅色可用。测试账号：`admin@example.com` / `admin12345`（prisma/seed.ts 默认值）。
4. 移动端 390px：底部导航、hero 图下文字块（浅字压深底）、sticky bar。
5. `grep -rn 'bg-\[#\|text-\[#\|border-\[#' src --include='*.tsx' | grep -v admin` 应为空（hero rgba 渐变除外）。
6. Tab 键出金色 focus 描边；按钮按压有收缩。
7. 截图偶尔全空白是 headless 渲染毛病，改用 `preview_snapshot`（可靠）或 `preview_inspect` 查计算色值。

## 项目历史阶段速览（Phase 7 之前，详情看 git log）

| 阶段 | 内容 |
|---|---|
| 1 | Next.js 16 + Prisma/Postgres（生产 Supabase）+ Auth.js 角色 + Stripe Checkout/webhook + admin CRUD 建站 |
| 2 | 浅色米白/金/玉设计系统 v1：令牌、Nav/Footer、collections 路由、商品详情/购物车重构、订阅功能、移动端底部导航 |
| 3 | 首页杂志化：hero 轮播、分类圆环、精选画廊、工艺/藏家故事、Instagram 条 |
| 4 | antsclass.com 迁移 46 个商品（图片转存 Vercel Blob、SKU upsert）+ 币种切到 MYR |
| 5 | 皮肤 v2（用户 mockup）：Inter 字体、深色页脚、全页面章节重排、FadeIn/BackToTop |
| 5.x | hero 全出血布局重构、营销图多轮替换（buddha/guanyin/story 无字版）、分类图后台管理（CategoryConfig 表 + /admin/categories 直传）|
| 6 | 精选系列 object-cover 统一卡片；甄选珍品/精选系列 admin 勾选（Product.isFeatured / isCollectionFeatured，生产库已迁移）；"实物原图" badge；生产库全表开启 RLS |

关键运维事实：生产 DB 是 Supabase pooler（改生产 schema 需用户逐次授权，用 scripts/ 下的 pg 脚本模式）；图片存 Vercel Blob（/api/upload）；营销图在 public/marketing/（**换图必须改文件名**，否则 /_next/image 缓存不失效——buddha 图踩过此坑）；部署 Vercel（seller-seven.vercel.app），push 到 main 自动部署。

## 其他背景

- 商品照片是浅灰底手机实拍，质量参差——深色主题的浅色卡片策略就是为它设计的；两张珍珠图"商品显小"是原图构图问题，非 bug（已告知用户）。
- 搜索/收藏 icon 是 inert 占位（title="coming soon"），**明确不在本次范围**。
- 加购反馈是按钮文字临时切换（"已加入 Added!"），可接受，不改 toast。
- git 惯例：小步 commit，message 英文主题 + 说明段，结尾 `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`；用户通常要求完成后 push。
- 生产库改动需用户逐次授权（本次 Phase 7 无 DB 改动）。
