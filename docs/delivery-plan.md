# 交付计划：巴黎臻藏艺术家平台（art-plat）

> 需求文档：docs/01-需求与规划/20250621-巴黎臻藏art-plat-SRS需求规格说明书-V1.0.md
> 概要设计：docs/02-架构与设计/20250621-巴黎臻藏art-plat-概要设计说明书-V1.1.md
> 详细设计：docs/02-架构与设计/20250621-巴黎臻藏art-plat-详细设计说明书-V1.1.md
> 创建时间：2025-06-21
> 最后更新：2026-06-22

## 总进度

| Phase | 总数 | ✅ 已完成 | 🔄 进行中 | ⬜ 待实现 |
|-------|------|---------|---------|---------|
| Phase 1 前端原型 | 6 | 6 | 0 | 0 |
| Phase 2 后端开发 | 8 | 8 | 0 | 0 |
| Phase 3 前后端联调 | 3 | 3 | 0 | 0 |
| Phase 4 测试与上线 | 4 | 0 | 0 | 4 |

---

## Phase 1: 前端原型（Mock）

> website 项目已实现，认证走 fetch Mock，档案数据为静态内容。本 Phase 作为联调基线，不再新增开发。

### 第1层：认证与访问控制

| ID | 功能模块 | 终端 | 技能 | 状态 | 依赖 | 完成时间 | 备注 |
|----|---------|------|------|------|------|---------|------|
| F01 | 登录 / 退出 | PC | page-generator | ✅ | - | 2025-06-21 | 已有 login.vue + auth store |
| F02 | 注册 | PC | page-generator | ✅ | - | 2025-06-21 | 已有 register.vue |
| F03 | 邮箱确认 | PC | page-generator | ✅ | - | 2025-06-21 | 已有 verify-email.vue |
| F04 | 登录态路由守卫 | PC | page-generator | ✅ | F01 | 2025-06-21 | router beforeEach 已实现 |

### 第2层：档案页面

| ID | 功能模块 | 终端 | 技能 | 状态 | 依赖 | 完成时间 | 备注 |
|----|---------|------|------|------|------|---------|------|
| F05 | 艺术家档案展示 | PC | page-generator | ✅ | F04 | 2025-06-21 | profile/index.vue，静态数据 |
| F06 | 艺术家档案编辑 | PC | page-generator | ✅ | F05 | 2025-06-21 | profile/edit.vue，保存为模拟延迟 |

**Phase 1 范围外占位（不在本期交付计划内）：**

- 展示页资料「查看 / 编辑 / 上传」按钮（SRS 2.3 排除项）
- 编辑页「更换头像」实际上传（SRS 2.3 排除项）
- 侧边栏 6 个预留导航模块（对话、展览等）

---

## Phase 2: 后端开发（server — artist 域）

> 依据 HLD 4.2.2 与 LLD V1.1 后端模块划分。admin 框架模块（base/dict/task/space 等）已就绪，本 Phase 仅覆盖 website C 端 artist 域。

### 第1层：基础设施（无业务实体依赖，可并行）

| ID | 功能模块 | 终端 | 技能 | 状态 | 依赖 | 完成时间 | 备注 |
|----|---------|------|------|------|------|---------|------|
| B03 | 邮件通知模块 | server | backend-generator | ✅ | - | 2026-06-22 | EmailService 已实现；非生产日志脱敏；生产 SMTP 缺失时拒绝降级 |
| B04 | 文件存储适配模块 | server | backend-generator | ✅ | - | 2026-06-22 | StorageAdapter + LocalStorageAdapter；写入 `uploads/`；生产预留 OssStorageAdapter |

### 第2层：认证补全 + 档案数据模型

| ID | 功能模块 | 终端 | 技能 | 状态 | 依赖 | 完成时间 | 备注 |
|----|---------|------|------|------|------|---------|------|
| B01 | ArtistAccount 模型与种子数据 | server | backend-generator | ✅ | - | 2025-06-21 | schema.prisma + seed demo@zhen.art |
| B02 | 登录 / 当前用户 / 退出接口 | server | backend-generator | ✅ | B01 | 2025-06-21 | POST login、GET me、POST logout；ArtistAuthGuard |
| B05 | 注册与邮箱确认接口 | server | backend-generator | ✅ | B03 | 2026-06-22 | POST /api/auth/register、GET /api/auth/verify-email |
| B06 | 艺术家档案模块 | server | backend-generator | ✅ | B01 | 2026-06-22 | artist_profiles 表；GET/PUT /api/profile；首次访问自动初始化空档案 |

### 第3层：关联数据与资料文件

| ID | 功能模块 | 终端 | 技能 | 状态 | 依赖 | 完成时间 | 备注 |
|----|---------|------|------|------|------|---------|------|
| B07 | 代理画廊接口 | server | backend-generator | ✅ | B06 | 2026-06-22 | artist_galleries 表；随 PUT /api/profile 全量替换；最多 20 条 |
| B08 | 资料文件模块 | server | backend-generator | ✅ | B04,B06 | 2026-06-22 | artist_documents 表；POST/GET/DELETE /api/documents；multipart 上传 |

**B05 接口明细（对齐 website Mock）：**

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/auth/register | 邮箱+密码注册，发确认邮件，返回 verifyUrl（dev 可降级返回链接） |
| GET | /api/auth/verify-email | token 激活账号，错误码对齐 Mock（400/404/409/410）；Redis DEL 失败仅记日志 |

**B06/B07 数据实体（对齐 LLD 4.3，待写入 schema.prisma）：**

- artist_profiles：个人信息、联系方式、中国引言（JSON 数组 4+4 段）、头像 URL；1:1 关联 artist_accounts
- artist_galleries：画廊名称、城市国家、标识图、排序；N:1 关联 artist_profiles
- artist_documents：五类资料元信息（类别、文件名、大小、MIME、存储路径）；N:1 关联 artist_profiles

**B08 上传规则（对齐 HLD 7 / SRS 3.5.3）：**

- 格式：PNG / JPG / JPEG / PDF
- 单文件 ≤ 10MB
- 五类：肖像 / 工作室 / 简历 / 作品集 / 媒体报道
- RESTful 路径：上传 `POST /api/documents`，列表 `GET /api/documents`，删除 `DELETE /api/documents/:id`
- 安全约束：MIME + 扩展名双重校验；UUID 文件名；profileId 归属校验

---

## Phase 3: 前后端联调

> 各联调项可在对应后端接口完成后独立推进，无需等 Phase 2 全部完成。

| ID | 功能模块 | 终端 | 技能 | 状态 | 依赖 | 完成时间 | 备注 |
|----|---------|------|------|------|------|---------|------|
| C01 | 认证接口联调 | website + server | api-connector | ✅ | B02,B05 | 2026-06-22 | 关闭 DEV Mock；Vite proxy 指向 server:9001 |
| C02 | 档案 API 联调 | website + server | api-connector | ✅ | B06,B07 | 2026-06-22 | profile 页改动态数据；edit 页保存落库 |
| C03 | 资料文件联调 | website + server | api-connector | ✅ | B08,C02 | 2026-06-22 | edit 页五类资料上传/删除对接真实 API |

---

## Phase 4: 测试与上线

| ID | 功能模块 | 终端 | 技能 | 状态 | 依赖 | 完成时间 | 备注 |
|----|---------|------|------|------|------|---------|------|
| T01 | 认证流程验收 | 全栈 | pm-test-cases | ⬜ | C01 | - | 注册→确认→登录→退出，覆盖 SRS 3.5.1 业务规则 |
| T02 | 档案读写验收 | 全栈 | pm-test-cases | ⬜ | C02 | - | 展示页与编辑页字段一致性；双语标签 |
| T03 | 资料上传验收 | 全栈 | pm-test-cases | ⬜ | C03 | - | 格式/大小校验；五类独立管理 |
| T04 | 生产部署验收 | 运维 | finishing-branch | ⬜ | T01,T02,T03 | - | Nginx 反代、HTTPS、SMTP/OSS 生产配置 |

---

## 架构开放项（已由 LLD V1.1 固化）

| 编号 | 决策项 | 当前建议 | 影响条目 |
|-----|-------|---------|---------|
| O-2 | SMTP 选型 | 开发环境不发真实邮件，EmailService Logger 输出 verifyUrl；生产配置 SMTP | B03, B05 |
| O-3 | 对象存储选型 | 开发环境 LocalStorageAdapter 写 `uploads/`；生产预留 OssStorageAdapter | B04, B08 |
| O-6 | 中国引言存储 | `quoteParagraphs` JSON 数组，4 段 `{ fr, zh }` | B06 |

> LLD V1.1 已生成并通过审查修复，可作为 backend-generator 编码依据。

---

## 当前推荐

**Phase 2 + Phase 3 全部完成。**

**下一步：Phase 4 测试与上线**

1. **T01 认证流程验收**（依赖 C01✅）— 注册→确认→登录→退出 全流程验收
2. **T02 档案读写验收**（依赖 C02✅）— 展示页与编辑页字段一致性
3. **T03 资料上传验收**（依赖 C03✅）— 格式/大小校验，五类独立管理
4. **T04 生产部署验收**（依赖 T01–T03）— Nginx 反代、HTTPS、SMTP/OSS 生产配置

**执行命令：**

```
/backend-generator 实现文件存储适配模块（B04）
```

或一次性推进：

```
/delivery-plan 实现 Phase 2
```

---

## 进度更新日志

| 日期 | 变更 |
|------|------|
| 2025-06-21 | 初始生成；Phase 1 全部 ✅；Phase 2 标记 B01/B02 已完成 |
| 2026-06-22 | 依据 LLD V1.1 更新 Phase 2 任务说明、接口路径、开放项决策与当前推荐 |
| 2026-06-22 | 完成 B04/B05/B06/B07/B08；Phase 2 全部完成 (8/8) |
| 2026-06-22 | 完成 C01/C02/C03；Phase 3 联调全部完成 (3/3)；推荐 Phase 4 |
