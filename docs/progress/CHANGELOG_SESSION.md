# Session Changelog

Nhật ký thay đổi kỹ thuật của các phiên làm việc với Antigravity.

## Phiên hiện tại

**Setup Tailwind v4 và UI Primitives cơ bản**
- Đã cài đặt và cấu hình `tailwindcss` v4 qua plugin PostCSS cho thư mục `apps/web`.
- Đã thiết lập Global Styles (`apps/web/app/globals.css`) chứa `@theme` dựa trên file thiết kế `DESIGN.md` (bao gồm Material Design 3 palette, typography, custom utility classes như `.glass-card`, `.wellness-bg`).
- Đã cấu hình và load fonts (Plus Jakarta Sans, Inter) thông qua `next/font` trong `layout.tsx`.
- Đã thiết lập thư viện tiện ích (cài đặt `clsx`, `tailwind-merge` và tạo file `utils.ts` trong package `@repo/ui`).
- Đã tạo các Component Layout cho Web: `<TopNavBar>`, `<Footer>`, `<LogoGroup>`.
- Đã tạo các UI Primitive Components chia sẻ trong `@repo/ui`: `<Button>` (với 4 variant), `<GlassCard>`, `<RiskBadge>`.
- Đã dựng bản Skeleton ban đầu cho trang chủ (`apps/web/app/page.tsx`) kết nối tất cả các thành phần nói trên lại với nhau.
- Đã tạo tài liệu `docs/THEME_SPEC.md` mô tả chi tiết thiết lập Tailwind v4 theme.
- Đã tạo component `<MedicalDisclaimerBanner>`.
- Đã hoàn thiện nội dung và bố cục của màn hình Home (`page.tsx`) theo sát thiết kế tĩnh.
- Đã tạo component `<TeamMemberCard>` cho trang giới thiệu.
- Đã dựng hoàn chỉnh màn hình **About Us** (`/about`) với thông tin sứ mệnh và đội ngũ dự án.
- Đã sửa lỗi `Cannot find module '@repo/ui/utils'` bằng cách bổ sung cấu hình `exports` cho file `.ts` trong `packages/ui/package.json`.
- Đã tạo component `<FAQCard>` (props: `icon`, `iconColor`, `question`, `answer`).
- Đã dựng hoàn chỉnh màn hình **Help / How It Works** (`/help`): Hero, Steps Bento Grid (3+2), FAQ Grid, Disclaimer Card.
- Đã gỡ bỏ màn hình Welcome theo yêu cầu người dùng, cập nhật lại route của Home thành trang gốc (`/`) trên toàn bộ tài liệu dự án (`VIBE_MAP.md`, `SCREEN_STATUS.md`, `UI_INVENTORY.md`).
- Đã sửa link "Home" trên `TopNavBar` và thiết lập redirect trên cấu hình Next.js (`next.config.js`) để điều hướng tự động từ `/home` về `/`.
- Đã sửa cảnh báo `scroll-behavior: smooth` của Next.js bằng cách thêm `data-scroll-behavior="smooth"` vào `RootLayout`.
- Đã tạo các component hỗ trợ: `<UrgentNotice>`, `<SupportOptionCard>`, `<ContactInfoRow>`.
- Đã dựng hoàn chỉnh màn hình **Get Support** (`/support`) với đầy đủ thông tin liên hệ và các lựa chọn hỗ trợ khẩn cấp.
- Đã sửa lỗi UI các nút bấm bị mất định dạng bằng cách thêm `@source "../../../packages/ui";` vào `globals.css` để Tailwind v4 quét CSS từ monorepo.
- Đã cấu hình lại `tailwind-merge` trong `packages/ui/src/utils.ts` để sửa lỗi xung đột giữa class màu chữ (`text-on-primary`) và typography (`text-label-md`), giúp nút bấm hiển thị đúng màu chữ tương phản.
