# Result Page Implementation (Frontend)

## 1. Mục tiêu
- Xây dựng trang hiển thị kết quả chẩn đoán trầm cảm (`/assessment/results`).
- Lấy kết quả trả về từ Backend API sau khi người dùng submit form Assessment.
- Giao diện thân thiện, có biểu đồ đo lường mức độ, có lời khuyên tương ứng.
- Tạm thời bỏ qua phần "Suggestions for You".

## 2. Kiến trúc & Data Flow
### 2.1. Zustand Store (`useAssessmentStore.ts`)
- Định nghĩa kiểu `AssessmentResult`:
  ```ts
  export interface AssessmentResult {
    risk_level: "Healthy" | "Needs Attention" | "Severe";
    confidence: number; // 0.0 - 1.0
    summary: string;
    recommendation: string;
  }
  ```
- Biến `result` được thêm vào global state.
- Khi hàm `submitAssessment()` gọi API `/predict` thành công, `result` sẽ được cập nhật thay vì chỉ in ra log.

### 2.2. Navigation Logic
- Tại `assessment/page.tsx`, khi gọi `handleSubmit()` thành công và không có lỗi, dùng `next/navigation` router để push sang trang `/assessment/results`.
- Tại `/assessment/results/page.tsx`, sử dụng `useEffect` để kiểm tra. Nếu người dùng F5 tải lại trang làm mất state `result`, ứng dụng sẽ tự động redirect về trang `/assessment` để bắt họ làm lại form, tránh lỗi màn hình trắng.

## 3. UI Component (`results/page.tsx`)
- **Tái sử dụng Component:** Sử dụng lại `TopNavBar` (chế độ active="prediction") và `Footer`.
- **Dynamic Theming:** Màu sắc và icon của kết quả phụ thuộc trực tiếp vào `risk_level` trả về từ Backend.
  - `Healthy`: Màu xanh lá cây (Tertiary) + Icon `mood`.
  - `Needs Attention`: Màu cam/xanh lam (Primary) + Icon `sentiment_dissatisfied`.
  - `Severe`: Màu đỏ (Error) + Icon `sentiment_very_dissatisfied`.
- **Circular Gauge (Biểu đồ tròn):**
  - Sử dụng thẻ `<svg>` vẽ 2 vòng tròn.
  - Vòng dưới làm đường ray (track).
  - Vòng trên dùng `stroke-dasharray="251.2"` (chu vi) và tính toán `stroke-dashoffset` theo % `confidence`.
  - Kết hợp class `transition-all duration-1000 ease-out` của Tailwind để tạo hiệu ứng thanh chạy mượt mà khi load trang.
- **Responsive:** Bố cục dạng Bento Grid, dùng `md:col-span-8` cho phần kết quả và `md:col-span-4` cho phần CTA "Need to talk". Trên mobile sẽ rớt thành 1 cột dọc tự động.
