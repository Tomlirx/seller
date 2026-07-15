# 商品导入进度（Product Import Log）

> 记录本地照片批量导入岚玉平台的进度，供后续继续上传时接手。
> **重要约定：原始图片文件（HEIC/MOV/zip）只留在本地，不提交 GitHub、不部署到 Vercel。**
> `products/` 已在 `.gitignore` 里排除。图片经脚本转 JPEG 后上传到 Vercel Blob，商品数据写生产 Supabase 库——线上只存转换后的图，源文件始终在本机。

## 导入工具

脚本：[`scripts/import-jade-bangles.ts`](scripts/import-jade-bangles.ts)（幂等，按 `sku`=文件夹名 upsert，重跑安全，已存在且有图的商品会复用已上传图片、不重复上传）。

**命令**（写生产库；Supabase pooler 连接串在 `.claude/settings.local.json`）：
```bash
# 干跑预览（不转图/不上传/不写库）
npx tsx scripts/import-jade-bangles.ts --dry-run
# 先跑前 N 个
DATABASE_URL="<Supabase pooler URL>" npx tsx scripts/import-jade-bangles.ts --limit=2
# 全量
DATABASE_URL="<Supabase pooler URL>" npx tsx scripts/import-jade-bangles.ts
```

**文件夹命名规则**：`Bangle{编号}_{型制}_CK{圈口}_{价格}`
型制：`YT`=圆条(Round Bar)、`ZQ`=正圈(Classic Round)、`GF`=贵妃(Oval)；`CK`=圈口内径 mm；结尾整数=MYR 价格。
脚本自动：HEIC→2000px JPEG（`sips`）、跳过 `.MOV` 视频、跳过无图文件夹、`isActive: true` 直接上架、`category: BANGLE`、`stockQty: 1`。iPhone EXIF 旋转由 Next/Image 上线时自动纠正，无需处理。

## 手镯（Bangle）批次 — 已完成 2026-07-15

来源：`products/Jade Pictures/`（本地，21 个文件夹）。**已导入 14 个上架**，跳过 7 个无图。

### ✅ 已上架（14）
| No. | 型制 | 圈口 | 价格RM | 图片数 | slug |
|---|---|---|---|---|---|
| 01 | 圆条 | 51 | 380 | 4 | bangle01-yt-ck51-380 |
| 02 | 正圈 | 51 | 480 | 4 | bangle02-zq-ck51-480 |
| 03 | 圆条 | 52 | 380 | 5 | bangle03-yt-ck52-380 |
| 08 | 正圈 | 54 | 480 | 4 | bangle08-zq-ck54-480 |
| 09 | 正圈 | 55 | 3000 | 6 | bangle09-zq-ck55-3000 |
| 12 | 圆条 | 56 | 168 | 4 | bangle12-yt-ck56-168 |
| 13 | 正圈 | 56 | 880 | 5 | bangle13-zq-ck56-880 |
| 14 | 圆条 | 56 | 368 | 5 | bangle14-yt-ck56-368 |
| 15 | 正圈 | 55 | 880 | 7 | bangle15-zq-ck55-880 |
| 16 | 贵妃 | 54 | 2000 | 4 | bangle16-gf-ck54-2000 |
| 17 | 圆条 | 58 | 2200 | 8 | bangle17-yt-ck58-2200 |
| 18 | 圆条 | 56 | 680 | 4 | bangle18-yt-ck56-680 |
| 20 | 圆条 | 57 | 168 | 4 | bangle20-yt-ck57-168 |
| 21 | 正圈 | 58 | 480 | 4 | bangle21-zq-ck58-480 |

### ⏳ 待补拍照片后导入（7）
这些文件夹当时无可用图片（空或只有视频），已**跳过**。补拍照片放进对应文件夹后，重跑全量命令即可自动补充上架（幂等，不影响已导入的 14 个）：

| No. | 型制 | 圈口 | 价格RM | 当时状态 |
|---|---|---|---|---|
| 04 | 正圈 | 52 | 480 | 只有 .MOV 视频 |
| 05 | 圆条 | 53 | 680 | 空文件夹 |
| 06 | 圆条 | 53 | 380 | 空文件夹 |
| 07 | 贵妃 | 52 | 580 | 空文件夹 |
| 10 | 贵妃 | 54 | 1200 | 空文件夹 |
| 11 | 圆条 | 55 | 480 | 空文件夹 |
| 19 | 正圈 | 58 | 1680 | 空文件夹 |

## 后续其它品类

如果之后要导入佛公/观音/福豆/叶子/如意等品类，可复制 `import-jade-bangles.ts` 改造：调整文件夹命名解析和 `category`。同样约定——源图只留本地、只上传转换后的 JPEG。

## 验证方式
- 生产库计数：连 Supabase 库 `prisma.product.count({ where: { category: "BANGLE", isActive: true } })`。
- 线上：https://seller-seven.vercel.app/collections/BANGLE （分页 12/页）。
