## Tổng quan
- Dữ liệu bị missing khá nhiều (có 3 nhóm ở mức 80%), đặc biệt là ở các nhóm có phân biệt sinh viên và đi làm như Study Satis, Academic Press, CGPA,... Có tổng cộng 9 cột bị missing.
- Phân phối biến mục tiêu không đều khi có khoảng 80% có giá trị bằng 0 (không trầm cảm).

## Các nhận xét với Numeric Feature
* Note: Các tỷ lệ theo nhóm là tỷ lệ có điều kiện, ví dụ P(Depression=1 | Student), không được cộng trực tiếp với nhau.
#### Thông qua biểu đồ phân phối của từng Numeric Feature
- Người có Age (tuổi) trong khoảng 20-30 có tỉ trọng TC cao nhất.
- Tỷ lệ TC tăng dần theo áp lực công việc và học tập (Academic Pressure và Work Pressure) và giảm dần theo mức độ hài lòng với công việc và học tập (Study Satisfaction và Job Satisfaction). Tuy vậy, vẫn có ngoại lệ ở Job Satisfaction từ 4.0 lên 5.0 thì tỉ trọng TC tăng nhẹ nhưng không đáng kể. 
- CGPA (điểm trung bình tích luỹ) không thể hiện được ảnh hưởng rõ rệt đối với TC
- Người có Work/Study Hours >= 10h có xu hướng TC cao hơn rõ rệt. Tương tự thì người có Finacial Stress 4.0 cũng có xu hướng TC, tăng cao ở 5.0.
#### Thông qua heatmap
- Các feature không có mối tương quan rõ ràng với nhau.
  
## Các nhận xét với Categorical Feature
#### Thông qua unique
- Có khá nhiều noise ở Sleep Duration, Dietary Habits; đó là những giá trị không phù hợp. Những instance nhiễu này có thể được cắt bỏ vì tần suất không nhiều. 
#### Thông qua phân phối của từng Categorical Feature
* Note: Ta chỉ xét những giá trị xuất hiện chính trong dữ liệu chứ không xét đến outlier.
- Người có giới tính nam có tỷ lệ TC cao hơn nhưng không đáng kể (1%).
- Student có tỷ lệ TC rất cao (58%) trong khi Working Professional rất thấp (8%)
- Dựa vào phân phối thì người ngủ ít hơn 5h có tỷ lệ TC cao nhất và người ngủ nhiều hơn 8h có tỷ lệ TC thấp nhất. Tuy vậy thì cũng khá bất ngờ khi người có thời lượng ngủ từ 7-8h lại có tỷ lệ TC cao hơn người ngủ từ 5-6h. Có sự chênh lệch nhẹ giữa các tỉ lệ TC (từ 1-6%).
- Đối với thói quen ăn kiêng (Dietary Habits), như dự đoán thì người Unhealthy có tỷ lệ TC cao nhất, sau đó đến Moderate và Healthy. 
- "Have you ever had suicidal thoughts ?" (Từng có ý định tự tử trước đây chưa?). Đây là feature khá quan trọng vì người trả lời Yes có tỷ lệ TC khá cao (31%) và người trả lời No có tỷ lệ TC khá thấp (4%).
- "Family History of Mental Illness" (Tiền sử gia đình mắc bệnh tâm thần). Tỉ lệ TC của Yes và No có sự chênh lệch không đáng kể lắm (1%).
## So sánh tập test và tập train
- Có khá nhiều giá trị only_in_test nên cần xử lý cẩn thận các categories. Có category mới trong test ở các cột như City, Profession, Sleep Duration, Dietary Habits, Degree, nên khi encode cần dùng cách xử lý unknown category.