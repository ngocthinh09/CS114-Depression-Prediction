Tôi sẽ tối ưu ngay trong file notebook và đây sẽ là file ghi chép của tôi.

Public score và private score trước khi tối ưu: 0.94047 - 0.94131

Lần 1: 
Nhận thấy impact của profession thấp nhất (0.37%) mà lại chứa nhiều category và được tạo nhiều cột bởi one-hot encoder nên tôi sẽ bỏ nó đi để mô hình nhẹ đi đáng kể?
Sau khi tối ưu: 0.94033 - 0.94099
Nhận xét: có vẻ như mô hình không cần giảm nhẹ đi mà cần thêm feature ?

Lần 2: 
Lần này không phải tối ưu, tôi thử nghiệm chạy chỉ với 10 feature có impact cao nhất xem model còn giữ được độ hiệu quả hay không.
Kết quả thử nghiệm: 0.93776 - 0.93976
Nhận xét: score bị giảm nhẹ, chấp nhận được cho demo.

Lần 3: 
Lần này sẽ xử dụng k-fold để train.
Kết quả: 0.94061 - 0.94179
Nhận xét: Phương pháp này có vẻ hiệu quả khi đạt được kết quả tối ưu hơn