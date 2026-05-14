# Tài liệu: `preprocessing.ipynb`

Notebook này thực hiện toàn bộ **Tầng 1** của pipeline: làm sạch dữ liệu thô, kỹ thuật đặc trưng (Feature Engineering), và lưu kết quả trung gian ra disk để `modeling.ipynb` sử dụng độc lập.

---

## Yêu cầu

- Dữ liệu thô đặt tại `data/raw/train.csv` và `data/raw/test.csv`.
- Môi trường Conda `cs114` đã được kích hoạt (có đủ các thư viện cần thiết).
- Các Custom Transformers đã được định nghĩa tại `src/features/transformers.py`.

---

## Luồng tổng quan

```
data/raw/train.csv & test.csv
         │
         ▼
  [Cell 1] Import & Load dữ liệu thô
         │
         ▼
  [Cell 2] Tách X, y và Train/Val/Test split
         │
         ▼
  [Cell 3] Xây dựng & fit feature_pipeline (Tầng 1)
         │
         ▼
  [Cell 4] Lưu dữ liệu trung gian → data/interim/
         │
         ▼
  [Cell 5] Định nghĩa feature_transformer (ColumnTransformer — Tầng 2)
         │
         ▼
  [Cell 6] Lưu pipeline → models/
```

---

## Chi tiết từng Cell

### Cell 1 — Import thư viện & Load dữ liệu thô

**Mục đích:** Cài đặt môi trường, thêm `src/` vào Python path, và đọc dữ liệu thô từ disk.

**Các hành động chính:**
- `sys.path.append(str(Path("..").resolve()))`: Cho phép Python tìm thấy module `src.features.transformers`. **Bắt buộc phải chạy trước khi import các Transformer.**
- Import toàn bộ thư viện cần dùng: `numpy`, `pandas`, `sklearn`, `joblib`.
- Import 6 Custom Transformers từ `src/features/transformers.py`:
  - `StringCleaner`
  - `MissingIndicatorAdder`
  - `StructuralMissingImputer`
  - `BinaryYesNoEncoder`
  - `FeatureEngineer`
  - `RareCategoryGrouper`
- Đọc `data/raw/train.csv` và `data/raw/test.csv` vào `train` và `test`.

**Các biến tạo ra:**

| Biến | Kiểu | Mô tả |
|---|---|---|
| `RANDOM_STATE` | `int` | Giá trị `42`, đảm bảo tính tái lập (reproducibility) |
| `TARGET_COL` | `str` | Tên cột nhãn: `"Depression"` |
| `ID_COL` | `str` | Tên cột ID: `"id"` |
| `train` | `pd.DataFrame` | Toàn bộ dữ liệu train thô |
| `test` | `pd.DataFrame` | Toàn bộ dữ liệu test thô |

---

### Cell 2 — Tách feature và target, chia Train/Val/Test

**Mục đích:** Chuẩn bị các tập dữ liệu cho quá trình huấn luyện và đánh giá.

**Các hành động chính:**
- Loại bỏ cột `id` và `Name` (không có giá trị dự đoán).
- Tách cột `Depression` ra làm nhãn `y`.
- Dùng `train_test_split` với `test_size=0.2`, `stratify=y` để chia tập train thành Train (80%) và Validation (20%).

> **Lưu ý quan trọng:** Tham số `stratify=y` đảm bảo tỉ lệ nhãn (Depression vs Non-Depression) được giữ nguyên ở cả 2 tập, tránh tình trạng mất cân bằng dữ liệu nghiêm trọng sau khi chia.

**Output thực tế (kết quả khi chạy):**
```
Train: (112560, 17), Val: (28140, 17), Test: (93800, 17)
```

**Các biến tạo ra:**

| Biến | Kiểu | Mô tả |
|---|---|---|
| `X` | `pd.DataFrame` | Feature của toàn bộ tập train (trước khi split) |
| `y` | `pd.Series` | Nhãn của toàn bộ tập train |
| `X_test` | `pd.DataFrame` | Feature của tập test cuối cùng |
| `X_train` | `pd.DataFrame` | Feature tập train (80%), dùng để huấn luyện |
| `X_val` | `pd.DataFrame` | Feature tập validation (20%), dùng để đánh giá |
| `y_train` | `pd.Series` | Nhãn tập train |
| `y_val` | `pd.Series` | Nhãn tập validation |

---

### Cell 3 — Xây dựng và fit `feature_pipeline` (Tầng 1)

**Mục đích:** Xây dựng và fit pipeline Tầng 1 — bao gồm toàn bộ logic nghiệp vụ: làm sạch dữ liệu và kỹ thuật đặc trưng (Feature Engineering).

**Cấu trúc pipeline:**

```python
feature_pipeline = Pipeline(steps=[
    ("string_cleaner",     StringCleaner()),
    ("missing_indicators", MissingIndicatorAdder(min_missing_frac=0.0)),
    ("structural_imputer", StructuralMissingImputer()),
    ("binary_encoder",     BinaryYesNoEncoder()),
    ("feature_engineer",   FeatureEngineer()),
    ("rare_grouper",       RareCategoryGrouper(min_count=30)),
])
```

**Mô tả từng bước:**

| Bước | Transformer | Mô tả |
|---|---|---|
| 1 | `StringCleaner` | Strip khoảng trắng, chuẩn hóa `'nan'`, `''`, `'None'` thành `np.nan` |
| 2 | `MissingIndicatorAdder` | Tạo cột nhị phân `<col>_is_missing` cho mọi cột có missing value |
| 3 | `StructuralMissingImputer` | Điền `0` (số) / `'Not Applicable'` (chuỗi) cho các cột missing có lý do cấu trúc (sinh viên không có `Work Pressure`, người đi làm không có `CGPA`...) |
| 4 | `BinaryYesNoEncoder` | Chuyển `'Yes'`/`'No'` thành `1`/`0` cho các cột: `Have you ever had suicidal thoughts ?`, `Family History of Mental Illness` |
| 5 | `FeatureEngineer` | Tạo đặc trưng mới dựa trên EDA: `Total Pressure`, `Max Pressure`, `Total Satisfaction`, `Min Satisfaction`, `Pressure_Satisfaction_Gap`, `High_Working_Hours_Flag`, `High_Financial_Stress_Flag`, `Is_Young_Adult`, `Suicide_Pressure_Interaction` |
| 6 | `RareCategoryGrouper` | Gom các category xuất hiện < 30 lần trong train thành nhãn `'Other'`, giúp tránh nhiễu ở các biến phân loại có nhiều giá trị hiếm |

**Quy tắc quan trọng:**
- `fit_transform()` chỉ dùng trên `X_train` để tránh data leakage.
- `transform()` dùng trên `X_val` và `X_test`.

**Output thực tế:**
```
Columns after feature_pipeline: 35
```
*(17 cột gốc → 35 cột sau khi thêm các đặc trưng mới và cột `_is_missing`)*

**Các biến tạo ra:**

| Biến | Kiểu | Mô tả |
|---|---|---|
| `feature_pipeline` | `sklearn.pipeline.Pipeline` | Pipeline Tầng 1, đã được fit trên `X_train` |
| `X_train_pre` | `pd.DataFrame` | Tập train đã qua Tầng 1 (35 cột, vẫn còn cột string) |
| `X_val_pre` | `pd.DataFrame` | Tập validation đã qua Tầng 1 |
| `X_test_pre` | `pd.DataFrame` | Tập test đã qua Tầng 1 |

> **Lưu ý:** `X_train_pre` vẫn còn các cột dạng chuỗi (City, Profession,...) chưa được One-Hot Encode và các cột số chưa được chuẩn hóa. Đây **không phải** dữ liệu cuối cùng để đưa vào model.

---

### Cell 4 — Lưu dữ liệu trung gian vào `data/interim/`

**Mục đích:** Lưu kết quả của Tầng 1 ra disk để `modeling.ipynb` có thể load trực tiếp mà không cần chạy lại Tầng 1.

**Các file được tạo ra:**

| File | Nội dung |
|---|---|
| `data/interim/X_train_pre.csv` | Feature tập train đã qua Tầng 1 |
| `data/interim/X_val_pre.csv` | Feature tập validation đã qua Tầng 1 |
| `data/interim/X_test_pre.csv` | Feature tập test đã qua Tầng 1 |
| `data/interim/y_train.csv` | Nhãn tập train |
| `data/interim/y_val.csv` | Nhãn tập validation |

> **Tại sao gọi là `interim` (trung gian)?** Vì dữ liệu ở đây chưa hoàn chỉnh — vẫn còn cần qua Tầng 2 (`feature_transformer`) để Impute, Scale và OneHotEncode trước khi đưa vào model.

---

### Cell 5 — Định nghĩa `feature_transformer` (Tầng 2 — `ColumnTransformer`)

**Mục đích:** Định nghĩa pipeline kỹ thuật (Tầng 2) xử lý các cột theo kiểu dữ liệu của chúng, chuyển toàn bộ về dạng số để model có thể học.

**Logic xác định cột:**
Tự động phân loại cột từ `X_train_pre` theo kiểu dữ liệu:

| Loại | Số lượng | Ví dụ |
|---|---|---|
| `numeric_cols` (28 cột) | `Age`, `CGPA`, `Total Pressure`, `Suicide_Pressure_Interaction`,... |
| `categorical_cols` (7 cột) | `Gender`, `City`, `Profession`, `Sleep Duration`,... |

**Cấu trúc:**

```python
# Cho cột số: điền bằng median, rồi chuẩn hóa
numeric_transformer = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler",  StandardScaler()),
])

# Cho cột chuỗi: điền bằng 'Unknown', rồi One-Hot Encode
categorical_transformer = Pipeline([
    ("imputer", SimpleImputer(strategy="constant", fill_value="Unknown")),
    ("onehot",  OneHotEncoder(handle_unknown="ignore", sparse_output=False)),
])

feature_transformer = ColumnTransformer(transformers=[
    ("num", numeric_transformer, numeric_cols),
    ("cat", categorical_transformer, categorical_cols),
], remainder="drop")
```

> **Tại sao không fit ở đây?** `feature_transformer` được lưu ở trạng thái **chưa fit** (chỉ có cấu trúc tham số). Khi `modeling.ipynb` chạy, mỗi model sẽ dùng `clone(feature_transformer)` để tạo một bản copy sạch và fit độc lập — điều này tránh data leakage khi dùng Cross-Validation.

**Các biến tạo ra:**

| Biến | Kiểu | Mô tả |
|---|---|---|
| `numeric_cols` | `list[str]` | Danh sách 28 cột số |
| `categorical_cols` | `list[str]` | Danh sách 7 cột chuỗi |
| `feature_transformer` | `sklearn.compose.ColumnTransformer` | Pipeline Tầng 2 (chưa fit) |

---

### Cell 6 — Lưu pipeline vào `models/`

**Mục đích:** Persist các pipeline xuống disk.

**Các file được tạo ra:**

| File | Nội dung | Dùng khi nào |
|---|---|---|
| `models/feature_pipeline.joblib` | Pipeline Tầng 1 **đã fit** | Inference ở Backend |
| `models/feature_transformer.joblib` | ColumnTransformer Tầng 2 **chưa fit** | `modeling.ipynb` dùng để `clone()` |

---

## Tóm tắt kiến trúc 2 tầng

| | Tầng 1 (`feature_pipeline`) | Tầng 2 (`feature_transformer`) |
|---|---|---|
| **Loại xử lý** | Logic nghiệp vụ (Domain Logic) | Kỹ thuật ML (Technical Transformation) |
| **Transformers** | StringCleaner, MissingIndicator, StructuralImputer, BinaryEncoder, FeatureEngineer, RareGrouper | SimpleImputer, StandardScaler, OneHotEncoder |
| **Trạng thái lưu** | Đã fit (`feature_pipeline.joblib`) | Chưa fit (`feature_transformer.joblib`) |
| **Kết quả** | DataFrame (35 cột, vẫn còn string) | numpy array (tất cả là số) |
| **Sử dụng sau** | Inference: `feature_pipeline.transform(raw_data)` | Training: mỗi model tự fit bản clone |
