# Mười Vạn Câu Hỏi Vì Sao: Pipeline Dự Đoán Depression

File này ghi lại các kiến thức và kỹ thuật chính đã dùng trong pipeline, kèm lý do vì sao dùng. Mục tiêu là giúp giải thích được notebook khi review, báo cáo hoặc thuyết trình.

## 1. Bài toán đang giải quyết là gì?

Đây là bài toán phân loại nhị phân:

- Input: thông tin cá nhân, học tập, công việc, thói quen sinh hoạt.
- Output: `Depression`, gồm 2 lớp `0` và `1`.

Vì target chỉ có hai lớp nên các model dùng là classifier, ví dụ `CatBoostClassifier` và `XGBClassifier`.

## 2. Vì sao phải bỏ `id` và `Name`?

`id` chỉ là mã định danh, không mang ý nghĩa dự đoán.

`Name` thường không nên dùng vì:

- dễ tạo nhiễu;
- có quá nhiều giá trị riêng lẻ;
- có nguy cơ học thuộc dữ liệu thay vì học quy luật tổng quát.

Vì vậy pipeline bỏ:

```python
drop_cols = [ID_COL, 'Name']
```

## 3. Vì sao dùng `train_test_split(..., stratify=y)`?

`stratify=y` giúp tỷ lệ class `0` và `1` trong train/validation gần giống với toàn bộ dataset.

Điều này quan trọng vì bài toán có dấu hiệu lệch lớp. Nếu split ngẫu nhiên không stratify, validation có thể không đại diện, làm metric local thiếu ổn định.

## 4. Xử lý missing value theo vai trò là gì?

Dataset có cột:

```python
Working Professional or Student
```

Một số cột chỉ hợp lý với student:

- `Academic Pressure`
- `CGPA`
- `Study Satisfaction`

Một số cột chỉ hợp lý với working professional:

- `Work Pressure`
- `Job Satisfaction`
- `Profession`

Vì vậy missing ở các cột này không hẳn là thiếu dữ liệu thật, mà là missing có cấu trúc. Ví dụ người đi làm không có `CGPA`, sinh viên không có `Job Satisfaction`.

Pipeline xử lý bằng cách điền `0` hoặc `Not Applicable` theo vai trò để model hiểu đây là trường hợp không áp dụng.

## 5. Vì sao thêm missing indicator?

Pipeline tạo thêm cột:

```python
{column}_is_missing
```

Lý do: bản thân việc một giá trị bị thiếu có thể là tín hiệu. Ví dụ nếu một nhóm người thường thiếu một trường nào đó, pattern này có thể liên quan tới target.

Thay vì chỉ impute và mất thông tin, missing indicator giữ lại thông tin “giá trị này từng bị thiếu”.

## 6. Vì sao map Yes/No thành 0/1?

Các cột như:

- `Have you ever had suicidal thoughts ?`
- `Family History of Mental Illness`

có bản chất nhị phân. Map:

```python
No -> 0
Yes -> 1
```

giúp model đọc được ý nghĩa số học rõ ràng hơn, đồng thời tránh one-hot không cần thiết.

## 7. Vì sao vẫn dùng one-hot cho categorical?

Các model tree-based như CatBoost, XGBoost trong pipeline đang nhận dữ liệu sau preprocessing của scikit-learn. Vì vậy categorical string cần được chuyển thành dạng số.

Pipeline dùng:

```python
OneHotEncoder(handle_unknown='ignore')
```

Ý nghĩa:

- biến mỗi category thành một cột 0/1;
- nếu test có category mới chưa từng thấy ở train thì không crash;
- phù hợp với pipeline scikit-learn.

## 8. Vì sao group rare categories?

Một số cột categorical như `City`, `Degree`, `Profession`, `Sleep Duration`, `Dietary Habits` có thể có nhiều giá trị hiếm hoặc giá trị rác.

Pipeline gom các category có tần suất thấp thành:

```python
Other
```

với `min_count=30`.

Lợi ích:

- giảm số lượng cột one-hot;
- giảm nhiễu từ category xuất hiện quá ít;
- giúp model generalize tốt hơn.

## 9. Vì sao tạo thêm engineered features?

Pipeline thêm một số feature mới từ các cột gốc:

- `Total Pressure`
- `Max Pressure`
- `Total Satisfaction`
- `Min Satisfaction`
- `Pressure Satisfaction Gap`
- `Pressure Per Work Study Hour`
- `Pressure Financial Stress`
- `Suicidal Thoughts Pressure`

Ý tưởng: depression có thể không chỉ phụ thuộc vào từng cột riêng lẻ, mà còn phụ thuộc vào tương tác giữa áp lực, mức hài lòng, thời gian học/làm, financial stress và suicidal thoughts.

Ví dụ:

```python
Pressure Satisfaction Gap = Total Pressure - Total Satisfaction
```

Feature này biểu diễn độ chênh giữa áp lực và sự hài lòng.

## 10. Vì sao dùng tree-based models?

Dataset dạng tabular, gồm numeric + categorical. Các model tree-based thường mạnh với dạng dữ liệu này vì:

- bắt được quan hệ phi tuyến;
- xử lý interaction giữa feature tốt;
- ít cần scale dữ liệu;
- thường hiệu quả trên Kaggle tabular competition.

Pipeline cuối tập trung vào:

- `CatBoostClassifier`
- `XGBClassifier`

Hai model này thường mạnh hơn các model tree cổ điển như Decision Tree đơn lẻ.

## 11. CatBoost là gì và vì sao dùng?

CatBoost là gradient boosting library mạnh cho dữ liệu bảng. Trong pipeline, CatBoost chạy sau one-hot preprocessing.

Ưu điểm:

- thường rất tốt với tabular data;
- ít cần tuning nhiều;
- kết quả validation và Kaggle ổn định trong các lần thử.

Config hiện tại:

```python
CatBoostClassifier(
    iterations=300,
    learning_rate=0.05,
    depth=6,
    random_seed=RANDOM_STATE,
    verbose=False,
    allow_writing_files=False,
)
```

`allow_writing_files=False` dùng để tránh CatBoost sinh folder log như `catboost_info/`.

## 12. XGBoost là gì và vì sao ensemble với CatBoost?

XGBoost cũng là gradient boosting library mạnh cho tabular data.

Pipeline ensemble CatBoost + XGBoost vì:

- hai model có cách học khác nhau;
- lỗi dự đoán của hai model không hoàn toàn giống nhau;
- trung bình xác suất có thể giảm variance;
- private score từng tăng nhẹ khi thử ensemble.

## 13. Vì sao dùng K-Fold?

Ban đầu pipeline dùng một split train/validation duy nhất. Cách này nhanh nhưng phụ thuộc vào một split cụ thể.

K-Fold chia train thành nhiều fold:

```python
StratifiedKFold(n_splits=5)
```

Mỗi fold:

- train trên 4 phần;
- validate trên 1 phần;
- lặp 5 lần.

Lợi ích:

- tận dụng toàn bộ dữ liệu để train/validate;
- metric ổn định hơn;
- prediction test được ensemble từ nhiều model;
- Kaggle score đã tăng trong lần thử nghiệm K-Fold.

## 14. OOF prediction là gì?

OOF là viết tắt của out-of-fold.

Mỗi dòng train sẽ được dự đoán bởi model không train trên dòng đó. Vì vậy OOF prediction là cách đánh giá gần với dữ liệu unseen hơn so với dự đoán trên chính training data.

Pipeline dùng OOF để:

- tính metric tổng thể;
- chọn weight ensemble CatBoost/XGBoost.

## 15. Vì sao ensemble bằng predict_proba thay vì predict label?

`predict_proba` trả về xác suất class `1`.

Ensemble xác suất:

```python
proba = w1 * catboost_proba + w2 * xgboost_proba
```

tốt hơn vote label vì giữ được độ tự tin của model. Ví dụ:

- Model A: 0.51
- Model B: 0.99

Cả hai đều predict class `1`, nhưng mức chắc chắn rất khác nhau.

## 16. Vì sao tune weight CatBoost/XGBoost?

Pipeline thử nhiều weight:

```python
catboost_weight = 0.0, 0.05, ..., 1.0
xgboost_weight = 1.0 - catboost_weight
```

Sau đó chọn weight có OOF accuracy tốt nhất.

Điều này giúp ensemble không bắt buộc chia đều 50/50. Nếu CatBoost mạnh hơn, nó có thể nhận weight cao hơn.

## 17. Vì sao threshold vẫn giữ 0.5?

Pipeline từng thử tune threshold, ví dụ chọn threshold khoảng `0.482` theo validation.

Local metric có thể tăng, nhưng Kaggle score giảm. Vì vậy pipeline quay lại:

```python
PREDICTION_THRESHOLD = 0.5
```

Bài học: tối ưu local metric không phải lúc nào cũng tăng leaderboard.

## 18. SHAP dùng để làm gì?

SHAP dùng để giải thích model.

Pipeline tính:

```python
mean_abs_shap
impact_percent
```

Ý nghĩa:

- `mean_abs_shap`: mức ảnh hưởng trung bình tuyệt đối của feature;
- `impact_percent`: tỷ trọng ảnh hưởng tương đối của feature, tổng khoảng 100%.

SHAP giúp trả lời câu hỏi: feature nào đang ảnh hưởng nhiều nhất tới prediction?

## 19. Vì sao thử bỏ `Profession` nhưng lại không giữ?

SHAP cho thấy `Profession` có impact thấp và tạo nhiều cột one-hot. Ý tưởng ban đầu là bỏ để model nhẹ hơn.

Nhưng Kaggle score giảm:

- trước tối ưu: `0.94047 - 0.94131`
- bỏ `Profession`: `0.94033 - 0.94099`

Kết luận: feature có impact thấp vẫn có thể chứa một phần signal hữu ích, đặc biệt khi public/private test khác validation.

## 20. Vì sao thử top 10 SHAP feature?

Thử nghiệm top 10 feature nhằm kiểm tra xem model có thể giữ hiệu quả với ít feature hơn không.

Kết quả giảm nhẹ:

```text
0.93776 - 0.93976
```

Kết luận: top feature giữ được phần lớn thông tin, nhưng các feature còn lại vẫn bổ sung signal.

## 21. Vì sao tune CatBoost không hiệu quả?

Tune trên một validation split cố định dễ bị overfit vào split đó.

Một config có local validation tốt hơn chưa chắc tốt hơn trên Kaggle. Sau khi tune, kết quả không cải thiện rõ, thậm chí có lúc tệ hơn.

Kết luận: với dataset này, baseline CatBoost khá mạnh; tuning nhỏ không đủ tạo khác biệt ổn định.

## 22. Vì sao thử mapping `Sleep Duration` và `Dietary Habits` rồi bỏ?

Ý tưởng mapping:

- biến `Sleep Duration` thành số giờ ngủ;
- biến `Dietary Habits` thành score `0/1/2`.

Nhưng pipeline cũ dùng one-hot đã giữ được category gốc. Mapping thủ công có thể làm mất một số signal hoặc thêm nhiễu từ quy ước chủ quan.

Kết luận: giữ one-hot cũ tốt hơn cho pipeline hiện tại.

## 23. Vì sao không xử lý imbalance mạnh?

Mặc dù class có thể lệch, model vẫn hoạt động tốt vì:

- feature signal khá mạnh;
- CatBoost/XGBoost học pattern tốt;
- Kaggle có thể chấm accuracy;
- xử lý imbalance mạnh có thể tăng recall class 1 nhưng giảm accuracy.

Pipeline từng thử một số hướng liên quan class balance, nhưng không giữ vì leaderboard không tăng.

## 24. Metric nào được dùng?

Pipeline theo dõi:

- `accuracy`
- `precision`
- `recall`
- `f1`
- `roc_auc`

Trong đó:

- `accuracy`: quan trọng vì Kaggle score có vẻ rất gần accuracy;
- `roc_auc`: đo khả năng xếp hạng xác suất;
- `f1`: cân bằng precision và recall;
- `precision/recall`: giúp xem model có bỏ sót class 1 không.

## 25. Pipeline cuối đang làm gì?

Tóm tắt pipeline hiện tại:

1. Đọc train/test.
2. Bỏ `id`, `Name`.
3. Làm sạch string.
4. Thêm missing indicators.
5. Fill missing theo vai trò student/professional.
6. Map Yes/No thành 0/1.
7. Tạo feature tương tác về pressure/satisfaction/stress.
8. Group rare categories thành `Other`.
9. One-hot categorical, impute numeric.
10. Train/compare CatBoost và XGBoost.
11. Dùng SHAP để giải thích feature impact.
12. Train Stratified K-Fold cho CatBoost và XGBoost.
13. Tune weight ensemble bằng OOF accuracy.
14. Tạo `submission.csv`.

## 26. Tại sao không dùng Logistic Regression?

Logistic Regression là một baseline tốt cho bài toán phân loại nhị phân, nhưng trong pipeline này không được chọn làm model chính vì dữ liệu là tabular và có nhiều quan hệ phi tuyến.

Logistic Regression có giả định khá đơn giản: mỗi feature đóng góp tuyến tính vào log-odds của target. Trong khi đó, bài toán này có nhiều tương tác kiểu:

- áp lực cao nhưng mức hài lòng thấp;
- financial stress cao đi kèm work/study hours cao;
- suicidal thoughts kết hợp với pressure;
- student và working professional có cấu trúc feature khác nhau.

Các quan hệ này tree-based models học tự nhiên hơn. CatBoost/XGBoost có thể tự chia nhánh theo điều kiện, ví dụ:

```text
nếu Academic Pressure cao
và Study Satisfaction thấp
và từng có suicidal thoughts
thì risk tăng
```

Logistic Regression vẫn có thể dùng để so sánh baseline, nhưng muốn nó cạnh tranh hơn thì phải scale dữ liệu, xử lý one-hot cẩn thận và tự tạo nhiều interaction feature. Với mục tiêu đạt score Kaggle tốt nhanh, CatBoost/XGBoost thực dụng hơn.

## 27. Có thật sự là bỏ đi `Profession` thì mô hình nhẹ đi không?

Có, về mặt kỹ thuật thì bỏ `Profession` sẽ làm mô hình nhẹ hơn.

Lý do là `Profession` là categorical feature. Khi đi qua one-hot encoder, mỗi nghề phổ biến có thể tạo thành một cột riêng. Nếu có nhiều nghề khác nhau, số chiều dữ liệu tăng lên khá nhiều.

Khi bỏ `Profession`, pipeline sẽ:

- giảm số lượng cột sau one-hot;
- train nhanh hơn một chút;
- dùng ít memory hơn;
- model đơn giản hơn.

Nhưng “nhẹ hơn” không đồng nghĩa với “tốt hơn”. Kết quả thử nghiệm cho thấy score Kaggle giảm:

```text
Trước khi bỏ Profession: 0.94047 - 0.94131
Sau khi bỏ Profession:   0.94033 - 0.94099
```

Điều này cho thấy `Profession` tuy SHAP impact thấp, vẫn chứa một phần signal. Có thể signal đó nhỏ nhưng hữu ích ở một số nhóm dữ liệu test.

Kết luận: bỏ `Profession` đúng là làm mô hình nhẹ hơn, nhưng trade-off là mất một phần độ chính xác.

## 28. Tại sao khi tune threshold thì score giảm?

Tune threshold nghĩa là thay vì dùng:

```python
proba >= 0.5
```

ta thử một threshold khác, ví dụ `0.482`.

Lý do local metric có thể tăng nhưng Kaggle score giảm:

1. Threshold được chọn dựa trên validation/OOF của train, không phải test thật của Kaggle.
2. Public leaderboard chỉ là một phần test set, phân phối có thể hơi khác validation.
3. Threshold tối ưu cho F1 hoặc OOF accuracy chưa chắc tối ưu cho Kaggle public/private split.
4. Khi threshold dịch xuống, model predict class `1` nhiều hơn. Điều này có thể tăng recall nhưng làm giảm precision/accuracy nếu class `1` bị predict quá tay.

Trong thử nghiệm, threshold tuning làm một số metric local tốt hơn nhưng Kaggle accuracy giảm:

```text
Threshold khoảng 0.482
Kaggle score: 0.94039 - 0.94093
```

Vì vậy pipeline quay lại threshold mặc định:

```python
PREDICTION_THRESHOLD = 0.5
```

Bài học: threshold tuning chỉ nên giữ nếu leaderboard hoặc cross-validation ổn định hơn thật sự.

## 29. Khi thêm mapping thì có bỏ feature gốc không?

Ban đầu có thử mapping:

- `Sleep Duration` thành số giờ ngủ;
- `Dietary Habits` thành score `0/1/2`.

Có hai cách làm:

1. Thay thế feature gốc bằng feature mapped.
2. Giữ feature gốc và thêm feature mapped như feature bổ sung.

Trong pipeline cuối, mapping này đã bị bỏ vì không cải thiện rõ. Lý do là one-hot feature gốc có thể đang giữ signal tốt hơn mapping thủ công.

Ví dụ `Sleep Duration` dạng category:

```text
Less than 5 hours
5-6 hours
7-8 hours
More than 8 hours
```

Nếu map thành số, ta áp đặt quan hệ thứ tự và khoảng cách giữa các nhóm. Nhưng model có thể học tốt hơn khi mỗi nhóm là một category riêng.

Tương tự `Dietary Habits`, việc map:

```text
Unhealthy -> 0
Moderate  -> 1
Healthy   -> 2
```

có vẻ hợp lý, nhưng có thể làm mất thông tin từ cách category xuất hiện trong dữ liệu.

Kết luận: nếu mapping không tăng score, nên giữ one-hot gốc. Feature engineering không phải cứ “có vẻ hợp lý” là sẽ tốt hơn trên leaderboard.

## 30. Tại sao không xử lý imbalance data?

Không xử lý imbalance mạnh vì kết quả thực nghiệm cho thấy pipeline hiện tại đã hoạt động tốt.

Trong bài toán lệch lớp, các kỹ thuật thường dùng là:

- `class_weight`;
- oversampling;
- undersampling;
- SMOTE;
- threshold tuning.

Nhưng các kỹ thuật này không luôn làm accuracy tăng. Chúng thường giúp model quan tâm hơn tới class thiểu số, làm recall class `1` tăng, nhưng có thể làm precision hoặc accuracy giảm.

Với bài này:

- feature signal khá mạnh;
- CatBoost/XGBoost học pattern tốt;
- Kaggle score có vẻ gần với accuracy;
- threshold tuning và class-balance style tuning không cho kết quả tốt hơn.

Vì vậy không xử lý imbalance mạnh là lựa chọn thực dụng. Thay vào đó pipeline theo dõi thêm precision, recall, F1, ROC-AUC để đảm bảo model không chỉ tối ưu accuracy một cách mù quáng.

## 31. Feature engineering dựa trên hiểu biết dữ liệu hay do đâu?

Feature engineering trong pipeline chủ yếu dựa trên hiểu biết dữ liệu và logic domain đơn giản.

Các feature được tạo gồm:

- `Total Pressure`
- `Max Pressure`
- `Total Satisfaction`
- `Min Satisfaction`
- `Pressure Satisfaction Gap`
- `Pressure Per Work Study Hour`
- `Pressure Financial Stress`
- `Suicidal Thoughts Pressure`

Ý tưởng không phải ngẫu nhiên. Nó đến từ giả định rằng depression có thể liên quan đến:

- tổng mức áp lực;
- mức áp lực cao nhất giữa học tập/công việc;
- sự chênh lệch giữa áp lực và hài lòng;
- áp lực khi kết hợp với stress tài chính;
- áp lực khi người đó từng có suicidal thoughts.

Ví dụ:

```python
Pressure Satisfaction Gap = Total Pressure - Total Satisfaction
```

Nếu áp lực cao nhưng sự hài lòng thấp, gap lớn có thể là một tín hiệu rủi ro.

Tuy nhiên, feature engineering vẫn phải được kiểm chứng bằng validation/Kaggle. Một feature nghe hợp lý nhưng nếu không tăng score thì không nên giữ chỉ vì cảm giác.

## 32. Tại sao trong K-Fold lại chọn `k=5`?

Chọn `k=5` vì đây là điểm cân bằng tốt giữa độ ổn định và thời gian chạy.

Nếu `k` nhỏ, ví dụ `k=3`:

- chạy nhanh hơn;
- nhưng validation ít ổn định hơn;
- mỗi fold validation lớn hơn, train ít dữ liệu hơn.

Nếu `k` lớn, ví dụ `k=10`:

- đánh giá ổn định hơn một chút;
- mỗi model train trên nhiều dữ liệu hơn;
- nhưng thời gian chạy gần gấp đôi so với 5-fold.

Với pipeline hiện tại, mỗi fold phải train cả CatBoost và XGBoost. Nếu dùng `k=5`, tổng cộng train:

```text
5 folds x 2 models = 10 models
```

Đây là mức còn hợp lý về thời gian chạy. Nếu dùng `k=10`, sẽ thành:

```text
10 folds x 2 models = 20 models
```

Trong thực nghiệm, 5-fold đã giúp Kaggle score tăng:

```text
Trước K-Fold: 0.94047 - 0.94131
Sau K-Fold:   0.94061 - 0.94179
```

Vì vậy `k=5` là lựa chọn thực dụng: đủ ổn định, không quá tốn thời gian.
