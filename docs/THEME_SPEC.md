# MindfulCheck Theme Specification

Tài liệu này đặc tả cấu hình Theme (dựa trên Tailwind v4) đã được thiết lập cho dự án MindfulCheck, tham chiếu từ `docs/VIBE_MAP.md`. Cấu hình được đặt trong file `apps/web/app/globals.css`.

## 1. Cấu hình Màu sắc (Material Design 3 Palette)

Màu sắc được ánh xạ thành các CSS Variables trong lớp `@theme` của Tailwind v4, tự động sinh ra các utility class như `bg-primary`, `text-secondary`, `border-outline-variant`, v.v.

| Token | Giá trị (Hex) | Ý nghĩa / Sử dụng |
|---|---|---|
| **Primary** (`--color-primary`) | `#526069` (Calm Blue) | Nút bấm chính, tiêu đề, trạng thái active |
| **Secondary** (`--color-secondary`) | `#655b68` (Lavender) | Nút bấm phụ, điểm nhấn mềm mại |
| **Tertiary** (`--color-tertiary`) | `#556158` (Fresh Mint) | Trạng thái success, progress bar |
| **Error** (`--color-error`) | `#ba1a1a` | Thông báo lỗi, validation |
| **Surface** (`--color-surface`) | `#fbf9f9` | Màu nền chính của ứng dụng |
| **Outline Variant** (`--color-outline-variant`) | `#c3c7cb` | Viền của thẻ, border phân chia |

*Lưu ý: Đi kèm với mỗi màu cơ bản là các biến thể `container` và `on-container` (VD: `bg-primary-container text-on-primary-container`).*

## 2. Typography (Fonts & Text Scales)

Sử dụng `next/font/google` để tải font zero-layout-shift và ánh xạ qua CSS variables.

**Fonts:**
- **Headings (`--font-heading`)**: Plus Jakarta Sans (Weight: 600, 700)
- **Body & Labels (`--font-sans`)**: Inter (Weight: 400, 500, 600)

**Semantic Classes (Sử dụng trực tiếp):**
- `.text-display-lg`: 48px / 700 / Plus Jakarta Sans
- `.text-headline-lg`: 32px / 600 / Plus Jakarta Sans
- `.text-headline-md`: 24px / 600 / Plus Jakarta Sans
- `.text-body-lg`: 18px / 400 / Inter
- `.text-body-md`: 16px / 400 / Inter
- `.text-label-md`: 14px / 500 / Inter
- `.text-label-sm`: 12px / 600 / Inter

## 3. Spacing & Radius

- **Grid Baseline**: 8px (vẫn giữ nguyên hệ thống spacing của Tailwind)
- **Margin Mobile (`--spacing-margin-mobile`)**: 16px (1rem)
- **Container Max (`--spacing-container-max`)**: 1200px (75rem)
- **Border Radius**: Sử dụng quy mô chuẩn (sm: 4px, base: 8px, md: 12px, lg: 16px, xl: 24px, full: 9999px)

## 4. Custom Utility Components

Được định nghĩa tại phần `@layer components` trong `globals.css`:

| Class Name | Mô tả và Hiệu ứng |
|---|---|
| `.glass-card` | Thẻ trong suốt (white 70%), `backdrop-blur(10px)`, bóng đổ nhẹ |
| `.glass-card-strong` | Tương tự `.glass-card` nhưng độ mờ đục cao hơn (white 80%), blur mạnh hơn (16px) |
| `.glass-panel` | Phiên bản teal tint dành riêng cho màn hình Help/Support |
| `.soft-shadow` | Bóng đổ nhẹ nhàng (`0 10px 40px -10px rgba(82,96,105,0.10)`) để thẻ có cảm giác "lơ lửng" |
| `.wellness-bg` | Nền gradient 4 góc (radial) lan tỏa các màu sắc pastel (xanh dương, tím nhẹ) |
| `.animate-blob` | Keyframes tạo hiệu ứng lơ lửng, chuyển động liên tục cho các vòng sáng dưới nền |
