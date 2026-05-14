# Tài liệu: `modeling.ipynb`

Notebook này thực hiện **Tầng 2 & 3** của pipeline: load dữ liệu trung gian đã được xử lý, huấn luyện và so sánh 4 model phân loại, trực quan hóa kết quả và lưu các model xuống disk.

---

## Yêu cầu

- Đã chạy xong `preprocessing.ipynb`.
- Folder `data/interim/` tồn tại và chứa đầy đủ các file CSV.
- Folder `models/` tồn tại và chứa `feature_pipeline.joblib` và `feature_transformer.joblib`.
- Môi trường Conda `cs114` đã được kích hoạt.

---

## Luồng tổng quan

```
data/interim/  +  models/feature_transformer.joblib
         │
         ▼
  [Cell 1] Import thư viện & thiết lập hằng số
         │
         ▼
  [Cell 2] Load dữ liệu trung gian & feature_transformer
         │
         ▼
  [Cell 3] Định nghĩa 4 model (LR, Decision Tree, RF, XGBoost)
         │
         ▼
  [Cell 4] Định nghĩa hàm evaluate_model()
         │
         ▼
  [Cell 5] Huấn luyện tất cả model & thu thập kết quả
         │
         ▼
  [Cell 6] Bảng so sánh tổng hợp + Classification Report
         │
         ▼
  [Cell 7] Vẽ Confusion Matrix cho từng model
         │
         ▼
  [Cell 8] Vẽ biểu đồ so sánh metric
         │
         ▼
  [Cell 9] Lưu tất cả model → models/
```

---

## Kết quả thực tế (khi chạy)

| Model | Accuracy | Precision | Recall | F1 | ROC-AUC |
|---|---|---|---|---|---|
| **Random Forest** | **0.9217** | **0.7299** | 0.9036 | **0.8075** | 0.9715 |
| XGBoost | 0.9197 | 0.7175 | 0.9208 | 0.8065 | **0.9743** |
| Logistic Regression | 0.9162 | 0.7050 | **0.9261** | 0.8006 | 0.9733 |
| Decision Tree | 0.9060 | 0.6797 | 0.9126 | 0.7791 | 0.9626 |

> **Đọc kết quả:** Vì dữ liệu mất cân bằng (~82% Non-Depression vs ~18% Depression), hãy ưu tiên **F1** và **Recall** hơn Accuracy.

---

## Chi tiết từng Cell

### Cell 1 — Import thư viện & thiết lập hằng số

**Mục đích:** Cài đặt môi trường làm việc cho toàn bộ notebook.

**Các hành động chính:**
- `sys.path.append(str(Path("..").resolve()))`: **Bắt buộc** — cho phép Python tìm thấy module `src.features.transformers` khi `joblib.load()` unpickle các pipeline.
- Import các model: `LogisticRegression`, `DecisionTreeClassifier`, `RandomForestClassifier`, `XGBClassifier`.
- Import các metric: `accuracy_score`, `precision_score`, `recall_score`, `f1_score`, `roc_auc_score`, `confusion_matrix`, `classification_report`, `ConfusionMatrixDisplay`.
- Thiết lập các hằng số đường dẫn:

| Hằng số | Giá trị | Mô tả |
|---|---|---|
| `RANDOM_STATE` | `42` | Seed ngẫu nhiên đảm bảo tính tái lập |
| `PROCESSED_DIR` | `Path("../data/interim")` | Thư mục chứa dữ liệu trung gian |
| `MODEL_DIR` | `Path("../models")` | Thư mục chứa pipeline và model đã lưu |
| `REPORT_DIR` | `Path("../reports")` | Thư mục lưu ảnh biểu đồ |

---

### Cell 2 — Load dữ liệu trung gian & pipeline

**Mục đích:** Load toàn bộ dữ liệu và công cụ cần thiết để huấn luyện — không cần chạy lại `preprocessing.ipynb`.

**Các hành động chính:**
- Load 5 file CSV từ `data/interim/` với `index_col=0` để giữ đúng index gốc.
- Load `feature_transformer.joblib` để dùng `clone()` trong training loop.

> **Tại sao load `feature_transformer` mà không phải `feature_pipeline`?**
> - `feature_pipeline` (Tầng 1) đã được áp dụng để tạo ra các CSV trong `data/interim/` — dữ liệu đã đi qua bước này rồi.
> - `feature_transformer` (Tầng 2 — ColumnTransformer) được load ở đây để **clone** (tạo bản copy sạch, chưa fit) và ghép vào từng model pipeline trong training loop.

**Output thực tế:**
```
Successfully loaded data!
Train: (112560, 35) | Val: (28140, 35) | Test: (93800, 35)
```

**Các biến tạo ra:**

| Biến | Kiểu | Mô tả |
|---|---|---|
| `X_train_pre` | `pd.DataFrame` | Feature tập train (35 cột) từ Tầng 1 |
| `X_val_pre` | `pd.DataFrame` | Feature tập validation từ Tầng 1 |
| `X_test_pre` | `pd.DataFrame` | Feature tập test từ Tầng 1 |
| `y_train` | `pd.Series` | Nhãn tập train |
| `y_val` | `pd.Series` | Nhãn tập validation |
| `feature_transformer` | `ColumnTransformer` | Pipeline Tầng 2 (chưa fit, dùng để clone) |

---

### Cell 3 — Định nghĩa các model

**Mục đích:** Khai báo 4 model với hyperparameter đã được cân nhắc cho bài toán này.

**Các model và lý do chọn hyperparameter:**

#### Logistic Regression
```python
LogisticRegression(
    max_iter=1000,          # Tăng để đảm bảo hội tụ trên dữ liệu lớn
    C=1.0,                  # Regularization (càng nhỏ = càng mạnh)
    class_weight="balanced",# Tự động bù cho class imbalance ~82/18
    random_state=RANDOM_STATE,
    n_jobs=-1,
)
```

#### Decision Tree
```python
DecisionTreeClassifier(
    max_depth=10,           # Giới hạn độ sâu để tránh overfitting
    min_samples_leaf=20,    # Mỗi lá phải có ≥ 20 mẫu, giúp cây mượt hơn
    class_weight="balanced",
    random_state=RANDOM_STATE,
)
```

#### Random Forest
```python
RandomForestClassifier(
    n_estimators=200,       # 200 cây
    max_depth=None,         # Cho phép cây mọc tự do (ensemble tự regularize)
    min_samples_leaf=5,
    class_weight="balanced",
    random_state=RANDOM_STATE,
    n_jobs=-1,
)
```

#### XGBoost
```python
XGBClassifier(
    n_estimators=300,
    learning_rate=0.05,     # Học chậm, ổn định hơn
    max_depth=4,
    subsample=0.9,
    colsample_bytree=0.9,
    eval_metric="logloss",
    tree_method="hist",     # Nhanh hơn trên dữ liệu lớn
    scale_pos_weight=4,     # ≈ 82%/18% ≈ 4.5, bù class imbalance
    random_state=RANDOM_STATE,
    n_jobs=-1,
)
```

> **Lưu ý:** `class_weight="balanced"` (sklearn) và `scale_pos_weight` (XGBoost) có cùng mục đích: buộc model chú ý nhiều hơn vào class thiểu số (Depression = 1), tránh bị lệch về phía class đa số.

---

### Cell 4 — Hàm `evaluate_model()`

**Mục đích:** Tập trung logic đánh giá vào một hàm duy nhất, tránh gọi `predict()` nhiều lần (tiết kiệm thời gian cho Random Forest và XGBoost).

**Signature:**
```python
def evaluate_model(
    name: str,
    model: object,
    X_val: pd.DataFrame,
    y_val: pd.Series,
) -> tuple[dict[str, object], np.ndarray]:
```

**Trả về:** `(metrics_dict, y_pred)`
- `metrics_dict`: dict gồm `model`, `accuracy`, `precision`, `recall`, `f1`, `roc_auc`.
- `y_pred`: mảng nhãn dự đoán — được trả về để tái sử dụng cho `classification_report`, tránh gọi `predict()` lần 2.

---

### Cell 5 — Huấn luyện và đánh giá tất cả model

**Mục đích:** Chạy training loop cho cả 4 model, thu thập kết quả.

**Kiến trúc từng model trong vòng lặp:**
```python
full_model = Pipeline(steps=[
    ("feature_transformer", clone(feature_transformer)),  # Tầng 2: Scale + Encode
    ("classifier",          classifier),                  # Tầng 3: Model
])
full_model.fit(X_train_pre, y_train)
```

> **Tại sao dùng `clone()`?** `clone()` tạo một bản copy của `feature_transformer` với đúng các tham số nhưng ở trạng thái **chưa fit**. Mỗi model có một `feature_transformer` riêng biệt, tránh các model bị ảnh hưởng lẫn nhau (data leakage chéo).

**Output thực tế:**
```
Training: Logistic Regression...
Logistic Regression: F1=0.8006 | ROC-AUC=0.9733
Training: Decision Tree...
Decision Tree: F1=0.7791 | ROC-AUC=0.9626
Training: Random Forest...
Random Forest: F1=0.8075 | ROC-AUC=0.9715
Training: XGBoost...
XGBoost: F1=0.8065 | ROC-AUC=0.9743
Training completely!
```

**Các biến tạo ra:**

| Biến | Kiểu | Mô tả |
|---|---|---|
| `results` | `list[dict]` | Danh sách metrics của từng model |
| `fitted_models` | `dict[str, Pipeline]` | Dict tên model → Pipeline đã fit hoàn chỉnh |
| `reports` | `dict[str, str]` | Dict tên model → Classification Report dạng text |

---

### Cell 6 — Bảng so sánh tổng hợp

**Mục đích:** Hiển thị bảng so sánh tất cả model, highlight ô tốt nhất ở mỗi cột.

**Cách đọc kết quả:**
- Bảng được sắp xếp theo `f1` giảm dần (ưu tiên F1 hơn Accuracy).
- Ô màu **xanh lá** = giá trị cao nhất trong cột đó.
- Ngoài bảng, in thêm **Classification Report chi tiết** của model tốt nhất, bao gồm Precision/Recall/F1 riêng cho từng class.

**Biến tạo ra:**

| Biến | Kiểu | Mô tả |
|---|---|---|
| `results_df` | `pd.DataFrame` | Bảng so sánh đã sắp xếp |
| `best_name` | `str` | Tên model tốt nhất (theo F1) |

---

### Cell 7 — Confusion Matrix

**Mục đích:** Trực quan hóa ma trận nhầm lẫn của từng model trên tập Validation.

**Cách đọc:**
```
                  Predicted:
                Non-Dep  Dep
Actual: Non-Dep   TN      FP
        Dep       FN      TP
```
- **FN (False Negative):** Model đoán "không trầm cảm" nhưng thực ra có — **nguy hiểm nhất** trong bài toán y tế.
- **FP (False Positive):** Model cảnh báo nhầm — ít nguy hiểm hơn.

**File lưu ra:** `reports/confusion_matrices.png`

---

### Cell 8 — Biểu đồ so sánh metric

**Mục đích:** So sánh trực quan 5 metric (`accuracy`, `precision`, `recall`, `f1`, `roc_auc`) của cả 4 model trên cùng một biểu đồ bar chart.

**File lưu ra:** `reports/model_comparison.png`

---

### Cell 9 — Lưu tất cả model

**Mục đích:** Persist toàn bộ các model đã huấn luyện xuống disk để dùng cho Inference.

**Các file được tạo ra:**

| File | Nội dung |
|---|---|
| `models/model_logistic_regression.joblib` | Pipeline hoàn chỉnh (feature_transformer + LR) |
| `models/model_decision_tree.joblib` | Pipeline hoàn chỉnh (feature_transformer + DT) |
| `models/model_random_forest.joblib` | Pipeline hoàn chỉnh (feature_transformer + RF) |
| `models/model_xgboost.joblib` | Pipeline hoàn chỉnh (feature_transformer + XGB) |

> **Lưu ý:** Mỗi file `.joblib` chứa một **Pipeline hoàn chỉnh 2 bước** (Tầng 2 + Tầng 3). Khi Inference, chỉ cần thêm Tầng 1 (`feature_pipeline`) ở phía trước là đủ.

---

## Luồng Inference (Backend)

Khi nhận dữ liệu người dùng mới, chỉ cần 3 bước:

```python
import joblib
import sys
from pathlib import Path

# Bắt buộc: để Python tìm thấy src.features.transformers
sys.path.append(str(Path("<đường dẫn đến thư mục ml>").resolve()))

# Load các pipeline đã fit sẵn
feature_pipeline = joblib.load("models/feature_pipeline.joblib")
model            = joblib.load("models/model_random_forest.joblib")

def predict(user_data: dict) -> int:
    df = pd.DataFrame([user_data])

    # Tầng 1: Custom transformers (cleaning + feature engineering)
    X_pre = feature_pipeline.transform(df)

    # Tầng 2 + 3: ColumnTransformer (scale/encode) + Model → dự đoán
    return int(model.predict(X_pre)[0])
```

> **Tuyệt đối không gọi `.fit()` trong quá trình Inference.**
