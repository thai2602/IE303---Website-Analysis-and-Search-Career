# Website-Analysis-and-Search-Career

<p align="center">
  <a href="https://www.uit.edu.vn/" title="Trường Đại học Công nghệ Thông tin" style="border: none;">
    <img src="https://i.imgur.com/WmMnSRt.png" alt="Trường Đại học Công nghệ Thông tin | University of Information Technology">
  </a>
</p>

<h1 align="center"><b>Đồ án IE303: Website Analysis and Search Career</b></h1>

## Giới thiệu môn

- **Tên môn học:** Công nghệ Java
- **Mã môn học:** IE303
- **Mã lớp:** IE303.Q21.CNVN
- **Năm học:** Học Kì 2 (2025 - 2026)
- **Giảng viên lý thuyết:** Thầy Huỳnh Văn Tín

## Danh sách thành viên nhóm

| STT | MSSV | Họ và Tên | Vai trò | GitHub | Email |
| :-- | :------- | :---------------- | :---------------- | :------------------------------- | :--------------------- |
| 1   | 23521416 | Lê Hoàng Thái | Nhóm trưởng | | <23521416@gm.uit.edu.vn> |
| 2   | 23521478 | Lê Trần Đức Thiện | Thành viên | | <23521478@gm.uit.edu.vn> |
| 3   | 23521664 | Nguyễn Tấn Trọng | Thành viên | | <23521664@gm.uit.edu.vn> |
| 4   | 23521720 | Nguyễn Minh Tuấn | Thành viên | [MinhTuan-K18](https://github.com/MinhTuan-K18)  | <23521720@gm.uit.edu.vn> |

## Các liên kết

- **Báo cáo đồ án:** []()
- **Bảng phân công:** [IE303_ProjectManagement](https://docs.google.com/spreadsheets/d/1uTk0Fm5hLVeCZlcBdFD41b2_mcxjzoDZoWpbaZZQnUc/edit?usp=sharing)

## Mô tả dự án

<p align="center">
  <img src="https://img.shields.io/badge/Java-21-orange?style=for-the-badge&logo=java" />
  <img src="https://img.shields.io/badge/Spring%20Boot-4.0.0-brightgreen?style=for-the-badge&logo=springboot" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5.2-3178C6?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/PostgreSQL-15-336791?style=for-the-badge&logo=postgresql" />
  <img src="https://img.shields.io/badge/LangChain4j-RAG-blueviolet?style=for-the-badge" />
</p>

---

## Mục lục

- [Giới thiệu dự án](#-giới-thiệu-dự-án)
- [Kiến trúc hệ thống](#-kiến-trúc-hệ-thống)
- [Tính năng chính](#-tính-năng-chính)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cấu trúc thư mục](#-cấu-trúc-thư-mục)
- [Hướng dẫn cài đặt & chạy](#-hướng-dẫn-cài-đặt--chạy)
- [Tài liệu API](#-tài-liệu-api)
- [Thành viên nhóm](#-thành-viên-nhóm)
- [Các liên kết quan trọng](#-các-liên-kết-quan-trọng)

---

## Giới thiệu

**JobPilot** là một nền tảng web thông minh hỗ trợ **tìm kiếm và phân tích nghề nghiệp** tích hợp trí tuệ nhân tạo. Dự án được xây dựng với mục tiêu giúp người dùng:

- **Tìm kiếm việc làm** phù hợp theo kỹ năng, vị trí, và công ty.
- **Xây dựng & đánh giá CV** tự động dựa trên tiêu chí nhà tuyển dụng.
- **Tư vấn nghề nghiệp thông minh** thông qua chatbot AI tích hợp RAG (Retrieval-Augmented Generation).
- **Phân tích thị trường lao động** với dữ liệu trực quan từ hàng nghìn tin tuyển dụng.
- **Khám phá thông tin doanh nghiệp** với hồ sơ công ty chi tiết.

---

## Kiến trúc hệ thống

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT (Browser)                     │
│           React 18 + TypeScript + TailwindCSS           │
│         Vite · React Router · Firebase Auth             │
└────────────────────────┬────────────────────────────────┘
                         │ REST API (HTTP/JSON)
┌────────────────────────▼────────────────────────────────┐
│               BACKEND (Spring Boot 4.0)                  │
│   Spring Web · Spring Security · JWT · Spring Data JPA  │
│         LangChain4j · RAG Engine · PDFBox               │
└──────────┬──────────────────────────┬───────────────────┘
           │                          │
┌──────────▼──────────┐   ┌──────────▼──────────────────┐
│  PostgreSQL DB       │   │  LM Studio (Local LLM)       │
│  (Docker / Local)    │   │  Gemma-4 · Nomic Embeddings  │
└─────────────────────┘   └─────────────────────────────┘
```

---

## Tính năng chính

### Xác thực & Người dùng

- Đăng ký / Đăng nhập bằng email & mật khẩu
- Đăng nhập bằng **Google OAuth** (Firebase)
- Quản lý hồ sơ cá nhân

### Tìm kiếm & Quản lý Việc làm

- Tìm kiếm việc làm theo từ khóa, danh mục, địa điểm
- Xem chi tiết tin tuyển dụng
- Lưu việc làm yêu thích

### CV Builder & Đánh giá CV

- Xây dựng CV trực quan trong trình duyệt
- **Trích xuất thông tin CV** từ file PDF (Apache PDFBox)
- **Đánh giá CV tự động** dựa trên khung tiêu chí nhân sự (HR Evaluation Framework)

### AI Chatbot (RAG)

- Tư vấn nghề nghiệp, phân tích JD, và trả lời câu hỏi về thị trường lao động
- Được hỗ trợ bởi **LangChain4j** và mô hình LLM cục bộ qua **LM Studio**
- Dữ liệu RAG bao gồm: tin tuyển dụng, tiêu chí HR, framework đánh giá CV

### Hồ sơ Công ty

- Danh sách công ty với thông tin chi tiết
- Tìm kiếm theo ngành nghề

### Blog & Bài viết

- Bài viết về xu hướng nghề nghiệp, kỹ năng mềm, kinh nghiệm phỏng vấn

---

## Công nghệ sử dụng

### Frontend

| Công nghệ | Phiên bản | Mô tả |
|-----------|-----------|-------|
| React | 18.2.0 | UI Framework |
| TypeScript | 5.2 | Type-safe JavaScript |
| Vite | 5.0.8 | Build Tool & Dev Server |
| React Router DOM | 6.20.0 | Client-side Routing |
| TailwindCSS | 3.4.0 | Utility-first CSS |
| Lucide React | 0.300.0 | Icon Library |
| Firebase | 12.x | Google OAuth & Auth |
| Recharts | 3.8.1 | Data Visualization |

### Backend

| Công nghệ | Phiên bản | Mô tả |
|-----------|-----------|-------|
| Java | 21 | Programming Language |
| Spring Boot | 4.0.0 | Application Framework |
| Spring Security + JJWT | 0.12.6 | Authentication & Authorization |
| Spring Data JPA + Hibernate | — | ORM & Database Access |
| PostgreSQL | 15 | Relational Database |
| LangChain4j | 0.29.1 | AI/LLM Integration & RAG |
| Apache PDFBox | — | CV PDF Parsing |
| MapStruct | 1.6.0 | DTO Mapping |
| Lombok | 1.18.40 | Code Generation |
| SpringDoc OpenAPI | 2.6.0 | Swagger UI Documentation |

### Infrastructure

| Công nghệ | Mô tả |
|-----------|-------|
| Docker + Docker Compose | Containerization cho PostgreSQL |
| LM Studio | Local LLM Server (OpenAI-compatible API) |
| Firebase | Google Authentication Provider |

---

## Cấu trúc thư mục

```
Website-Analysis-and-Search-Career/
│
├── frontend/                          # React + TypeScript (Vite)
│   ├── src/
│   │   ├── features/                  # Domain-driven UI modules
│   │   │   ├── auth/                  # Đăng nhập / Đăng ký
│   │   │   ├── home/                  # Trang chủ
│   │   │   ├── jobs/                  # Tìm kiếm việc làm
│   │   │   ├── companies/             # Hồ sơ công ty
│   │   │   ├── cv-builder/            # Xây dựng & đánh giá CV
│   │   │   ├── chatbot/               # AI Chatbot UI
│   │   │   ├── blog/                  # Bài viết / Blog
│   │   │   └── utilities/             # Tiện ích khác
│   │   ├── components/                # UI components tái sử dụng
│   │   ├── layouts/                   # Header, Footer, Layout chung
│   │   ├── services/                  # API client calls
│   │   ├── store/                     # State management
│   │   ├── hooks/                     # Custom React Hooks
│   │   ├── routes/                    # Cấu hình routing
│   │   └── config/                    # App configuration
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                           # Spring Boot (Java 21)
│   └── src/main/
│       ├── java/com/jobportal/
│       │   ├── modules/               # Business logic modules
│       │   │   ├── auth/              # Xác thực (Login/Register/JWT)
│       │   │   ├── user/              # Quản lý người dùng
│       │   │   ├── job/               # Tin tuyển dụng
│       │   │   ├── company/           # Công ty
│       │   │   ├── cv/                # CV Builder & Extraction
│       │   │   ├── application/       # Ứng tuyển
│       │   │   ├── savedjob/          # Việc làm đã lưu
│       │   │   ├── chatbot/           # AI Chatbot (RAG)
│       │   │   ├── article/           # Blog / Bài viết
│       │   │   └── utility/           # Tiện ích
│       │   ├── config/                # Cấu hình Spring (Security, CORS, ...)
│       │   ├── security/              # JWT Filter, Auth Provider
│       │   ├── common/                # Shared DTOs, Base classes
│       │   └── exception/             # Global Exception Handler
│       └── resources/
│           ├── application.properties # Cấu hình ứng dụng
│           ├── db/                    # SQL migration scripts
│           └── rag-data/              # Dữ liệu RAG pipeline
│               ├── raw/               # Dữ liệu thô (Markdown, CSV)
│               │   ├── job_postings/  # Tin tuyển dụng
│               │   └── hr_rules/      # Tiêu chí đánh giá CV & HR
│               ├── processed/         # Dữ liệu đã xử lý (chunks)
│               └── embeddings/        # Vector embeddings cache
│
├── data/                              # Dữ liệu nguồn (CSV, JSON)
├── docs/                              # Tài liệu dự án
├── docker-compose.yml                 # Docker config (PostgreSQL)
└── requirements.txt                   # Ghi chú môi trường & thư viện
```

---

## Hướng dẫn cài đặt & chạy

### Yêu cầu môi trường

- **Node.js** ≥ 18.x & **npm** ≥ 9.x
- **Java** 21 (JDK)
- **Maven** ≥ 3.9.x
- **Docker** & **Docker Compose**
- **LM Studio** (nếu muốn dùng AI Chatbot cục bộ)

### 1. Clone repository

```bash
git clone https://github.com/thai2602/IE303---Website-Analysis-and-Search-Career.git
cd Website-Analysis-and-Search-Career
```

### 2. Khởi động Database (PostgreSQL via Docker)

```bash
docker-compose up -d
```

> Database sẽ chạy tại `localhost:5432`, DB name: `jobpilot`, user: `postgres`, password: `123456`

### 3. Chạy Backend (Spring Boot)

```bash
cd backend
mvn spring-boot:run
```

> Backend API sẽ chạy tại: **<http://localhost:8080>**  
> Swagger UI: **<http://localhost:8080/swagger-ui.html>**

### 4. Chạy Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

> Frontend sẽ chạy tại: **<http://localhost:5173>**

### 5. Cấu hình AI Chatbot (Tùy chọn)

1. Tải và khởi động **LM Studio**
2. Load model `google/gemma-4-e4b` và embedding model `nomic-embed-text-v1.5`
3. Khởi động Local Server tại port `1234`
4. Backend sẽ tự kết nối qua `http://localhost:1234/v1`

---

## Tài liệu API

Sau khi chạy backend, truy cập Swagger UI để xem đầy đủ tài liệu REST API:

🔗 **<http://localhost:8080/swagger-ui.html>**

Các nhóm API chính:

| Module | Endpoint prefix | Mô tả |
|--------|-----------------|-------|
| Auth | `/api/auth/**` | Đăng ký, đăng nhập, Google OAuth |
| Users | `/api/users/**` | Quản lý hồ sơ người dùng |
| Jobs | `/api/jobs/**` | CRUD tin tuyển dụng |
| Companies | `/api/companies/**` | Thông tin công ty |
| CVs | `/api/cvs/**` | Upload, trích xuất, đánh giá CV |
| Applications | `/api/applications/**` | Quản lý đơn ứng tuyển |
| Saved Jobs | `/api/saved-jobs/**` | Lưu việc làm yêu thích |
| Chatbot | `/api/chatbot/**` | AI Chatbot (RAG) |
| Articles | `/api/articles/**` | Blog & bài viết |

---

<p align="center">Made with ❤️ by Team JobPilot – UIT IE303 2025-2026</p>
