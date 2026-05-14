# UI Component Inventory

Dựa trên VIBE_MAP.md (Mục 2). Trạng thái các component được tái sử dụng trong hệ thống.

## 2.1 Layout Components

| Component | Trạng thái | Đường dẫn | Ghi chú |
|---|---|---|---|
| `<TopNavBar>` | **Done** | `apps/web/components/layout/TopNavBar.tsx` | Sticky top, backdrop-blur-md, nhận `activePage` |
| `<MobileBottomNav>` | Todo | - | Dành riêng cho Mobile |
| `<Footer>` | **Done** | `apps/web/components/layout/Footer.tsx` | Link tĩnh, bg mờ, thiết kế đồng nhất |
| `<MedicalDisclaimerBanner>` | **Done** | `apps/web/components/layout/MedicalDisclaimerBanner.tsx` | Hiển thị cảnh báo không phải chẩn đoán y tế |

## 2.2 UI Primitive Components

| Component | Trạng thái | Đường dẫn | Ghi chú |
|---|---|---|---|
| `<Button>` | **Done** | `packages/ui/src/button.tsx` | 4 variants (primary, secondary-outlined, ghost, pill), 3 sizes |
| `<GlassCard>` | **Done** | `packages/ui/src/glass-card.tsx` | Nhận prop `intensity="normal" \| "strong"` |
| `<SectionCard>` / `<BentoCell>` | Todo | - | Card nền trắng, có shadow nhẹ |
| `<ProgressBar>` | Todo | - | Cho màn hình Assessment |
| `<CircularGauge>` | Todo | - | SVG Gauge hiển thị điểm số ML |
| `<RiskBadge>` | **Done** | `packages/ui/src/risk-badge.tsx` | Nhãn mức độ nguy cơ: Low, Mild, Moderate, Severe |
| `<InfoTip>` | Todo | - | Hiển thị thông báo, lời khuyên nhỏ |
| `<UrgentNotice>` | **Done** | `apps/web/components/ui/UrgentNotice.tsx` | Cảnh báo khẩn cấp màu đỏ |
| `<FAQCard>` | **Done** | `apps/web/components/help/FAQCard.tsx` | FAQ card cho Help Page, nhận `icon`, `iconColor`, `question`, `answer` |
| `<TeamMemberCard>` | **Done** | `apps/web/components/about/TeamMemberCard.tsx` | Cho About Page |
| `<SupportOptionCard>` | **Done** | `apps/web/components/support/SupportOptionCard.tsx` | Card lựa chọn hỗ trợ trong trang Support |
| `<LogoGroup>` | **Done** | `apps/web/components/ui/LogoGroup.tsx` | Chứa logo UIT + CS, pill style |
| `<ContactInfoRow>` | **Done** | `apps/web/components/support/ContactInfoRow.tsx` | Hiển thị thông tin liên hệ |

## 2.3 Form Components (Assessment)

| Component | Trạng thái | Đường dẫn | Ghi chú |
|---|---|---|---|
| `<QuestionSection>` | Todo | - | Wrap cho 1 nhóm câu hỏi |
| `<RadioChipGroup>` | Todo | - | List chọn kiểu Pill ngang |
| `<RadioListGroup>` | Todo | - | List chọn dọc |
| `<RatingScale>` | Todo | - | Scale 1-5 |
| `<TextInput>` | Todo | - | Field nhập liệu văn bản |
| `<SelectInput>` | Todo | - | Field dropdown chọn giá trị |
