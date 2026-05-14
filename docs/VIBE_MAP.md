# VIBE_MAP.md — MindfulCheck UI Design Analysis

> Phân tích tự động từ các file Stitch (`docs/stitch/`) bởi Antigravity.  
> Mục đích: làm tài liệu tham chiếu khi xây dựng frontend React/Next.js cho dự án CS114.

---

## 1. Danh sách các màn hình chính (Screens)

| # | Tên màn hình | Tên thư mục Stitch | Route đề xuất | Mô tả ngắn |
|---|---|---|---|---|
| 1 | **Home (Landing Page)** | `home_no_auth_history` | `/` | Hero section với headline + ảnh, section "3 Simple Steps" (Bento Grid), Privacy Commitment banner, Medical Disclaimer |
| 2 | **Assessment (Questionnaire)** | `assessment_no_auth_history` | `/assessment` | Form đa section: Personal Info → Health Status → Academic Pressure → ..., Progress Bar, điều hướng Back/Next |
| 3 | **Assessment Results** | `assessment_results_no_auth_history` | `/results` | Circular gauge kết quả ML, Risk Label (Mild/Moderate/Severe), 3 Recommendation Cards (Bento Grid), CTA Find Support |
| 4 | **About Us** | `about_us_no_auth_history` | `/about` | Mission quote, Team Members grid (avatar + tên + MSSV) |
| 5 | **Help / How It Works** | `help_mindfulcheck_2026` | `/help` | 5 bước hoạt động (3-column + 2-column grid), FAQ Accordion-style cards, Disclaimer card |
| 6 | **Get Support** | `get_support_mindfulcheck_2026` | `/support` | Hero "You're not alone", Urgent Notice (error banner), 4 Support Options grid, UIT Sharing Space info, Action Buttons |

### Luồng điều hướng người dùng

```
Home ──→ Assessment ──→ [Loading ML...] ──→ Results
                 ↕                                          ↓
              About              Get Support ←─────────────┘
                 ↕
               Help
```

---

## 2. Các Component tái sử dụng (Reusable Components)

### 2.1 Layout Components

#### `<TopNavBar>`
- **Xuất hiện ở:** Tất cả màn hình (Home, Assessment, Results, About, Help, Get Support)
- **Props:** `activePage: 'home' | 'about' | 'prediction' | 'help'`
- **Nội dung:**
  - Logo Group: 2 logo ảnh trong pill container + tên "MindfulCheck"
  - Nav links (desktop, centered, active có border-bottom + bold)
  - CTA Button "Get Support" (desktop only)
  - Hamburger icon (mobile only)
- **Ghi chú:** Sticky top, `bg-surface/80 backdrop-blur-md`, `z-50`

#### `<MobileBottomNav>`
- **Xuất hiện ở:** Home (mobile only)
- **Props:** `activePage: string`
- **Items:** Home, Assess, Profile — icon + label, active item có pill highlight

#### `<Footer>`
- **Xuất hiện ở:** Tất cả màn hình
- **Props:** không (static)
- **Nội dung:** Brand name, copyright, nav links (Privacy Policy, Terms, Medical Disclaimer, Crisis Resources)

#### `<MedicalDisclaimerBanner>`
- **Xuất hiện ở:** Home (bottom of page, trước footer)
- **Màu:** `bg-error-container`, icon `warning`
- **Nội dung:** "This is not a medical diagnosis tool."

---

### 2.2 UI Primitive Components

#### `<Button>`

| Variant | Dùng ở | Mô tả |
|---|---|---|
| `primary` | Toàn bộ | `bg-primary text-on-primary`, min-height 48px, `rounded-lg`, hover opacity-90 |
| `secondary-outlined` | Assessment, Get Support | `border border-outline-variant text-primary`, transparent bg |
| `ghost` | Get Support | `bg-transparent text-primary`, hover `bg-surface-container` |
| `pill` (chip) | Assessment form | `rounded-full border`, checked: `bg-primary text-on-primary` |

#### `<GlassCard>`
- **CSS class:** `.glass-card`
- **Style:** `background: rgba(255,255,255,0.7)`, `backdrop-filter: blur(10px)`, `border: 1px solid rgba(255,255,255,0.5)`
- **Xuất hiện ở:** Home (Step cards), Assessment (section wrappers), Results

#### `<SectionCard>` / `<BentoCell>`
- Card thông thường (không có glass): `bg-surface-container-lowest rounded-xl shadow-sm`
- Hover: `-translate-y-1 transition-transform duration-300`
- Xuất hiện ở: Home steps, Help steps, Results recommendations, Get Support options

#### `<ProgressBar>`
- **Xuất hiện ở:** Assessment
- **Props:** `progress: number` (0–100)
- **Style:** `h-3 rounded-full bg-surface-container`, fill: `bg-tertiary transition-all duration-500`
- Label: "Survey Progress" + percentage text

#### `<CircularGauge>` (SVG)
- **Xuất hiện ở:** Results
- **Props:** `score: number`, `label: string`, `icon: string`
- **Cấu trúc:** 2 SVG `<circle>` (track + fill), centered icon + label
- `stroke-dashoffset` điều chỉnh theo score

#### `<RiskBadge>`
- **Xuất hiện ở:** Results
- **Props:** `level: 'low' | 'mild' | 'moderate' | 'high'`
- **Style:** `px-3 py-1 rounded-full font-label-sm`, màu theo level (primary-container / tertiary-container / error-container)

#### `<InfoTip>`
- **Xuất hiện ở:** Results
- **Style:** `bg-tertiary-container text-on-tertiary-container p-sm rounded-lg flex items-start gap-sm`
- Icon `info` + text nhỏ

#### `<UrgentNotice>`
- **Xuất hiện ở:** Get Support
- **Style:** `bg-error-container text-on-error-container p-md rounded-xl`
- Icon `warning` + bold text

#### `<FAQCard>`
- **Xuất hiện ở:** Help
- **Props:** `icon: string`, `iconColor: string`, `question: string`, `answer: string`
- **Style:** `bg-surface-container-lowest rounded-xl p-md shadow-sm hover:shadow-md`

#### `<TeamMemberCard>`
- **Xuất hiện ở:** About
- **Props:** `name: string`, `studentId: string`, `avatarIcon: string`
- **Style:** flex row, avatar = circle bg + Material Icon, hover scale-105

#### `<LogoGroup>`
- **Xuất hiện ở:** Toàn bộ NavBar
- **Style:** pill/rounded-lg container với 2 logo + divider dọc

#### `<ContactInfoRow>`
- **Xuất hiện ở:** Get Support (UIT Sharing Space section)
- **Props:** `icon: string`, `label: string`, `value: string`

---

### 2.3 Form Components (Assessment-specific)

#### `<QuestionSection>`
- **Props:** `title: string`, `icon: string`, `bgColor: string`, `children`
- **Style:** `glass-card rounded-xl p-md md:p-lg` với tinted bg (primary-container/20 hoặc tertiary-container/30)

#### `<RadioChipGroup>` (pill-style choices)
- **Props:** `name: string`, `options: {value, label}[]`
- **Style:** `flex flex-wrap gap-sm`, mỗi option = hidden radio + pill div, checked = `bg-primary text-on-primary`

#### `<RadioListGroup>` (vertical radio)
- **Props:** `name: string`, `options: {value, label}[]`
- **Style:** vertical list, hover `bg-surface-container-low`

#### `<RatingScale>` (1-5 scale)
- **Props:** `name: string`, `min: number`, `max: number`, `minLabel: string`, `maxLabel: string`
- **Style:** circle buttons, checked = `bg-secondary text-on-secondary`

#### `<TextInput>`
- **Props:** `id: string`, `label: string`, `placeholder: string`, `optional?: boolean`
- **Style:** `h-[56px] rounded-lg border-outline-variant focus:border-primary focus:ring-1`

#### `<SelectInput>`
- **Props:** `id: string`, `label: string`, `options: {value, label}[]`
- **Style:** same height/style với TextInput

---

## 3. Cấu trúc State dự kiến

### 3.1 Global App State

```typescript
interface AppState {
  // Navigation
  currentPage: 'home' | 'assessment' | 'results' | 'about' | 'help' | 'support';
  
  // User (no-auth flow)
  isAuthenticated: false; // v1 không có auth
}
```

### 3.2 Assessment Screen State

Màn hình phức tạp nhất — cần state machine đầy đủ:

```typescript
type AssessmentStatus = 'idle' | 'in_progress' | 'submitting' | 'success' | 'error';

interface AssessmentState {
  // Luồng
  status: AssessmentStatus;
  currentSection: number;        // 0 = Personal Info, 1 = Health Status, 2 = Academic Pressure, ...
  totalSections: number;         // số section trong form
  progress: number;              // 0–100 (%)

  // Dữ liệu form
  formData: {
    // Section 1: Personal Info
    name?: string;               // optional
    age?: 'under18' | '18-22' | '23-25' | 'over25';
    major?: string;

    // Section 2: Health Status
    sleepHours?: 'less4' | '4-6' | '6-8' | 'over8';
    energyLevel?: 'exhausted' | 'sluggish' | 'normal' | 'energetic';

    // Section 3: Academic Pressure
    workloadRating?: 1 | 2 | 3 | 4 | 5;
    // ... thêm các câu hỏi khác từ dataset thực tế
  };

  // Validation
  validationErrors: Record<string, string>;

  // API Call
  isLoading: boolean;            // khi gửi lên ML backend
  errorMessage: string | null;
}
```

**State transitions:**
```
idle
  ↓ user clicks "Start Assessment"
in_progress (section 0)
  ↓ user clicks "Next" (validates section)
in_progress (section 1) → ... → in_progress (last section)
  ↓ user clicks "Submit"
submitting (isLoading = true, spinner hiển thị)
  ↓ API response OK
success → navigate to /results
  ↓ API response error
error (errorMessage hiển thị toast/alert)
  ↓ user clicks "Try Again"
submitting
```

### 3.3 Results Screen State

```typescript
type ResultStatus = 'loading' | 'success' | 'error' | 'empty';

// Risk levels từ ML model
type RiskLevel = 'low' | 'mild_stress' | 'moderate' | 'high';

interface ResultsState {
  status: ResultStatus;

  // Data từ ML backend
  prediction: {
    riskLevel: RiskLevel;
    confidence: number;          // 0.0–1.0 (dùng cho gauge SVG)
    label: string;               // "You're doing quite well!" v.v.
    summary: string;             // đoạn mô tả kết quả
    tipMessage: string;          // InfoTip content
  } | null;

  // Recommendations (dynamic theo risk level)
  recommendations: Array<{
    icon: string;
    title: string;
    description: string;
    color: 'primary' | 'secondary' | 'tertiary';
  }>;

  // Error
  errorMessage: string | null;

  // Actions
  showProfessionalSupportCTA: boolean; // true nếu risk >= moderate
}
```

**Loading state hiển thị:**  
Khi `status === 'loading'`: skeleton loader thay cho CircularGauge + Cards.

### 3.4 Global UI State

```typescript
interface UIState {
  isMobileMenuOpen: boolean;     // hamburger menu trên mobile
  activeToast: {
    message: string;
    type: 'success' | 'error' | 'info';
  } | null;
}
```

---

## 4. Design System Summary

> Chi tiết đầy đủ: [`docs/stitch/student_wellness_design_system/DESIGN.md`](./stitch/student_wellness_design_system/DESIGN.md)

### Màu sắc (Material Design 3 palette)

| Token | Hex | Dùng cho |
|---|---|---|
| `primary` | `#526069` | Buttons chính, active nav, headings |
| `primary-container` | `#e3f2fd` | Card tints, badge bg |
| `secondary` | `#655b68` | Secondary buttons, social proof |
| `tertiary` | `#556158` | Progress bar, success states, mint accents |
| `error` | `#ba1a1a` | Urgent notices, validation errors |
| `error-container` | `#ffdad6` | Warning banners |
| `surface` | `#fbf9f9` | Page background |
| `on-surface-variant` | `#43474a` | Body text, placeholder text |

> **Lưu ý:** Màn hình `get_support` và `help` dùng một palette teal khác (`primary: #1a696e`) — cần thống nhất về sau.

### Typography

| Scale | Font | Size | Dùng cho |
|---|---|---|---|
| `display-lg` | Plus Jakarta Sans | 48px / 700 | Hero headlines |
| `headline-lg` | Plus Jakarta Sans | 32px / 600 | Section titles |
| `headline-md` | Plus Jakarta Sans | 24px / 600 | Card titles |
| `body-lg` | Inter | 18px / 400 | Lead paragraphs |
| `body-md` | Inter | 16px / 400 | Body copy |
| `label-md` | Inter | 14px / 500 | Button text, nav links |
| `label-sm` | Inter | 12px / 600 | Badges, captions |

### Spacing (8px grid)

`xs=4` · `sm=12` · `base=8` · `md=24` · `lg=48` · `xl=80` · `gutter=24` · `margin-mobile=16`

### Animation & Effects

| Class | Định nghĩa |
|---|---|
| `.glass-card` | `rgba(255,255,255,0.7)` + `backdrop-filter: blur(10px)` + subtle border |
| `.soft-shadow` | `box-shadow: 0 10px 40px -10px rgba(82,96,105,0.1)` |
| `.animate-blob` | keyframe: translate + scale lặp 7s, dùng cho background orbs |
| `.wellness-bg` | `radial-gradient` 4 góc tạo halo màu pastel |
| hover lift | `hover:-translate-y-1 transition-transform duration-300` (cards) |
| hover shadow | `hover:shadow-md transition-shadow` |

---

## 5. Gợi ý kiến trúc Component (React/Next.js)

```
src/
├── components/
│   ├── layout/
│   │   ├── TopNavBar.tsx
│   │   ├── MobileBottomNav.tsx
│   │   └── Footer.tsx
│   ├── ui/
│   │   ├── Button.tsx            # variant: primary | secondary | ghost | pill
│   │   ├── GlassCard.tsx
│   │   ├── SectionCard.tsx
│   │   ├── RiskBadge.tsx
│   │   ├── CircularGauge.tsx     # SVG-based
│   │   ├── ProgressBar.tsx
│   │   ├── InfoTip.tsx
│   │   ├── UrgentNotice.tsx
│   │   ├── MedicalDisclaimerBanner.tsx
│   │   ├── LogoGroup.tsx
│   │   └── Toast.tsx
│   ├── assessment/
│   │   ├── QuestionSection.tsx
│   │   ├── RadioChipGroup.tsx
│   │   ├── RadioListGroup.tsx
│   │   ├── RatingScale.tsx
│   │   ├── TextInput.tsx
│   │   └── SelectInput.tsx
│   ├── results/
│   │   ├── ResultSummaryCard.tsx
│   │   ├── RecommendationCard.tsx
│   │   └── ProfessionalSupportCTA.tsx
│   ├── about/
│   │   └── TeamMemberCard.tsx
│   ├── help/
│   │   └── FAQCard.tsx
│   └── support/
│       ├── SupportOptionCard.tsx
│       └── ContactInfoRow.tsx
├── pages/ (hoặc app/ nếu Next.js 13+)
│   ├── page.tsx            → Home (Landing Page)
│   ├── assessment.tsx      → Assessment Form
│   ├── results.tsx         → ML Results
│   ├── about.tsx           → About Us
│   ├── help.tsx            → How It Works
│   └── support.tsx         → Get Support
├── store/ (hoặc hooks/)
│   ├── useAssessmentStore.ts
│   ├── useResultsStore.ts
│   └── useUIStore.ts
└── services/
    └── predictionApi.ts    # POST /predict → ML backend
```

---

*Tạo bởi Antigravity · 2026-05-14 · Branch: `dev`*
