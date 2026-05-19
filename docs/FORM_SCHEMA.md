# Thống nhất Data Schema cho form Assessment

Đây là tài liệu đặc tả cấu trúc dữ liệu form (Data Contract) để đảm bảo đồng bộ giữa Frontend và Backend (ML Model).

---

## 1. Thông tin cá nhân (Personal Info)

| Trường dữ liệu (Column) | Kiểu Input (Frontend) | Giá trị bắt buộc (ML Model Options) | Ghi chú / Giải thích |
|---|---|---|---|
| `id` | Không hiển thị | Tự động sinh (Auto-generated) | Không hiển thị trên UI. |
| `Name` | `Text Input` | Tự do nhập (String) | Tên người dùng |
| `Gender` | `Select` | `Male`, `Female` | Giới tính |
| `Age` | `Number Input` | Số nguyên `>= 18` | Độ tuổi |
| `City` | `Text Input` | Tự do nhập (String) | Thành phố sinh sống |
| `Working Professional or Student` | `Select` | `Student`, `Working Professional` | Xác định Role để hiển thị/ẩn các câu hỏi phù hợp. |
| `Profession` | `Text Input` | Tự do nhập (String) | Chỉ nhập nếu là `Working Professional`. Vô hiệu hóa (disable) nếu là `Student`. |
| `Degree` | `Text Input` | Tự do nhập (String) | Bằng cấp/Ngành học hiện tại. |

---

## 2. Áp lực & Sự hài lòng (Pressure & Satisfaction)

| Trường dữ liệu (Column) | Kiểu Input (Frontend) | Giá trị bắt buộc (ML Model Options) | Ghi chú / Giải thích |
|---|---|---|---|
| `Academic Pressure` | `Rating Scale` (1-5) | `1`, `2`, `3`, `4`, `5` | Chỉ áp dụng nếu role là `Student` |
| `Work Pressure` | `Rating Scale` (1-5) | `1`, `2`, `3`, `4`, `5` | Chỉ áp dụng nếu role là `Working Professional` |
| `CGPA` | `Number Input` | Số thực `0` đến `10` | Chỉ áp dụng nếu role là `Student` (Điểm hệ 10) |
| `Study Satisfaction` | `Rating Scale` (1-5) | `1`, `2`, `3`, `4`, `5` | Chỉ áp dụng nếu role là `Student` |
| `Job Satisfaction` | `Rating Scale` (1-5) | `1`, `2`, `3`, `4`, `5` | Chỉ áp dụng nếu role là `Working Professional` |
| `Work/Study Hours` | `Number Input` | Số thực `0` đến `24` | Số giờ học tập/làm việc mỗi ngày |
| `Financial Stress` | `Rating Scale` (1-5) | `1`, `2`, `3`, `4`, `5` | Mức độ áp lực tài chính chung |

---

## 3. Sức khỏe & Thói quen sinh hoạt (Health & Lifestyle)

| Trường dữ liệu (Column) | Kiểu Input (Frontend) | Giá trị bắt buộc (ML Model Options) | Ghi chú / Giải thích |
|---|---|---|---|
| `Sleep Duration` | `Select` | `Less than 5 hours`, `5 - 6 hours`, `7 - 8 hours`, `More than 8 hours` | Thời gian ngủ trung bình mỗi đêm |
| `Dietary Habits` | `Select` | `Unhealthy`, `Healthy`, `Moderate` | Thói quen ăn uống |

---

## 4. Tiền sử sức khỏe tâm thần (Mental Health History)

| Trường dữ liệu (Column) | Kiểu Input (Frontend) | Giá trị bắt buộc (ML Model Options) | Ghi chú / Giải thích |
|---|---|---|---|
| `Have you ever had suicidal thoughts ?` | `Radio` / `Select` | `Yes`, `No` | Bạn đã bao giờ có ý định tự tử chưa? |
| `Family History of Mental Illness` | `Radio` / `Select` | `Yes`, `No` | Tiền sử bệnh lý tâm thần trong gia đình |
