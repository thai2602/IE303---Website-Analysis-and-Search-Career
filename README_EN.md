# Website-Analysis-and-Search-Career

<p align="center">
  <a href="https://www.uit.edu.vn/" title="University of Information Technology" style="border: none;">
    <img src="https://i.imgur.com/WmMnSRt.png" alt="University of Information Technology | Trường Đại học Công nghệ Thông tin">
  </a>
</p>

<h1 align="center"><b>IE303 Project: Website Analysis and Search Career</b></h1>

## Course Introduction

- **Course Name:** Java Technology
- **Course Code:** IE303
- **Class Code:** IE303.Q21.CNVN
- **Academic Year:** Semester 2 (2025 - 2026)
- **Lecturer:** Mr. Huynh Van Tin

## Team Members

| No. | Student ID | Full Name | Role | GitHub | Email |
| :-- | :--------- | :---------------- | :---------------- | :------------------------------- | :--------------------- |
| 1   | 23521416   | Le Hoang Thai     | Team Leader       | | <23521416@gm.uit.edu.vn> |
| 2   | 23521478   | Le Tran Duc Thien | Member            | | <23521478@gm.uit.edu.vn> |
| 3   | 23521664   | Nguyen Tan Trong  | Member            | | <23521664@gm.uit.edu.vn> |
| 4   | 23521720   | Nguyen Minh Tuan  | Member            | [MinhTuan-K18](https://github.com/MinhTuan-K18)  | <23521720@gm.uit.edu.vn> |

## Links

- **Project Report:** []()
- **Task Assignment:** [IE303_ProjectManagement](https://docs.google.com/spreadsheets/d/1uTk0Fm5hLVeCZlcBdFD41b2_mcxjzoDZoWpbaZZQnUc/edit?usp=sharing)

## Project Description

<p align="center">
  <img src="https://img.shields.io/badge/Java-21-orange?style=for-the-badge&logo=java" />
  <img src="https://img.shields.io/badge/Spring%20Boot-4.0.0-brightgreen?style=for-the-badge&logo=springboot" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5.2-3178C6?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/PostgreSQL-15-336791?style=for-the-badge&logo=postgresql" />
  <img src="https://img.shields.io/badge/LangChain4j-RAG-blueviolet?style=for-the-badge" />
</p>

---

## Table of Contents

- [Introduction](#introduction)
- [System Architecture](#system-architecture)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Directory Structure](#directory-structure)
- [Installation & Setup Guide](#installation--setup-guide)
- [API Documentation](#api-documentation)
- [Team Members](#team-members)
- [Important Links](#links)

---

## Introduction

**JobPilot** is an intelligent, AI-integrated web platform for **job search and career analysis**. The project is built with the goal of helping users:

- **Search for jobs** matching their skills, location, and preferred companies.
- **Build & assess CVs** automatically based on recruiter/HR criteria.
- **Get smart career advice** via an AI chatbot powered by RAG (Retrieval-Augmented Generation).
- **Analyze the labor market** using visual data from thousands of job postings.
- **Explore company information** with detailed company profiles.

---

## System Architecture

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

## Key Features

### Authentication & User Management

- Register / Login with email & password
- Login with **Google OAuth** (Firebase)
- Personal profile management

### Job Search & Management

- Search for jobs by keywords, categories, and location
- View job posting details
- Save favorite jobs

### CV Builder & Assessment

- Build visual CVs directly in the browser
- **Extract CV information** from PDF files (Apache PDFBox)
- **Automatic CV evaluation** based on HR evaluation frameworks

### AI Chatbot (RAG)

- Career consulting, JD analysis, and labor market Q&A
- Powered by **LangChain4j** and local LLM models via **LM Studio**
- RAG datasets include: job postings, HR guidelines, and CV evaluation frameworks

### Company Profiles

- Company directory with comprehensive details
- Search by industry/sector

### Blog & Articles

- Articles on career trends, soft skills, and interview tips

---

## Tech Stack

### Frontend

| Technology | Version | Description |
|------------|---------|-------------|
| React | 18.2.0 | UI Framework |
| TypeScript | 5.2 | Type-safe JavaScript |
| Vite | 5.0.8 | Build Tool & Dev Server |
| React Router DOM | 6.20.0 | Client-side Routing |
| TailwindCSS | 3.4.0 | Utility-first CSS |
| Lucide React | 0.300.0 | Icon Library |
| Firebase | 12.x | Google OAuth & Auth |
| Recharts | 3.8.1 | Data Visualization |

### Backend

| Technology | Version | Description |
|------------|---------|-------------|
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

| Technology | Description |
|------------|-------------|
| Docker + Docker Compose | Containerization for PostgreSQL |
| LM Studio | Local LLM Server (OpenAI-compatible API) |
| Firebase | Google Authentication Provider |

---

## Directory Structure

```
Website-Analysis-and-Search-Career/
│
├── frontend/                          # React + TypeScript (Vite)
│   ├── src/
│   │   ├── features/                  # Domain-driven UI modules
│   │   │   ├── auth/                  # Login / Register
│   │   │   ├── home/                  # Home page
│   │   │   ├── jobs/                  # Job search
│   │   │   ├── companies/             # Company profiles
│   │   │   ├── cv-builder/            # CV Builder & Evaluation
│   │   │   ├── chatbot/               # AI Chatbot UI
│   │   │   ├── blog/                  # Articles / Blog
│   │   │   └── utilities/             # Miscellaneous utilities
│   │   ├── components/                # Reusable UI components
│   │   ├── layouts/                   # Header, Footer, Shared Layouts
│   │   ├── services/                  # API client calls
│   │   ├── store/                     # State management
│   │   ├── hooks/                     # Custom React Hooks
│   │   ├── routes/                    # Routing configuration
│   │   └── config/                    # App configuration
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                           # Spring Boot (Java 21)
│   └── src/main/
│       ├── java/com/jobportal/
│       │   ├── modules/               # Business logic modules
│       │   │   ├── auth/              # Auth (Login/Register/JWT)
│       │   │   ├── user/              # User management
│       │   │   ├── job/               # Job postings
│       │   │   ├── company/           # Company profiles
│       │   │   ├── cv/                # CV Builder & Extraction
│       │   │   ├── application/       # Job applications
│       │   │   ├── savedjob/          # Saved jobs
│       │   │   ├── chatbot/           # AI Chatbot (RAG)
│       │   │   ├── article/           # Blog / Articles
│       │   │   └── utility/           # Utilities
│       │   ├── config/                # Spring config (Security, CORS, etc.)
│       │   ├── security/              # JWT Filter, Auth Provider
│       │   ├── common/                # Shared DTOs, Base classes
│       │   └── exception/             # Global Exception Handler
│       └── resources/
│           ├── application.properties # Application properties
│           ├── db/                    # SQL migration scripts
│           └── rag-data/              # RAG pipeline data
│               ├── raw/               # Raw data (Markdown, CSV)
│               │   ├── job_postings/  # Job postings
│               │   └── hr_rules/      # CV evaluation criteria & HR guidelines
│               ├── processed/         # Processed data (chunks)
│               └── embeddings/        # Vector embeddings cache
│
├── data/                              # Source data (CSV, JSON)
├── docs/                              # Project documentation
├── docker-compose.yml                 # Docker config (PostgreSQL)
└── requirements.txt                   # Environment notes & dependencies
```

---

## Installation & Setup Guide

### Environment Requirements

- **Node.js** ≥ 18.x & **npm** ≥ 9.x
- **Java** 21 (JDK)
- **Maven** ≥ 3.9.x
- **Docker** & **Docker Compose**
- **LM Studio** (Optional, if you wish to run the local AI Chatbot)

### 1. Clone the repository

```bash
git clone https://github.com/thai2602/IE303---Website-Analysis-and-Search-Career.git
cd Website-Analysis-and-Search-Career
```

### 2. Start the Database (PostgreSQL via Docker)

```bash
docker-compose up -d
```

> The database will run at `localhost:5432` with DB name: `jobpilot`, user: `postgres`, password: `123456`

### 3. Run the Backend (Spring Boot)

```bash
cd backend
mvn spring-boot:run
```

> The Backend API will be available at: **<http://localhost:8080>**  
> Swagger UI: **<http://localhost:8080/swagger-ui.html>**

### 4. Run the Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

> The Frontend will run at: **<http://localhost:5173>**

### 5. Configure the AI Chatbot (Optional)

1. Download and start **LM Studio**.
2. Load the LLM model `google/gemma-4-e4b` and the embedding model `nomic-embed-text-v1.5`.
3. Start the Local Server on port `1234`.
4. The Backend will automatically connect to it via `http://localhost:1234/v1`.

---

## API Documentation

Once the backend is running, access Swagger UI to view the comprehensive REST API documentation:

🔗 **<http://localhost:8080/swagger-ui.html>**

Main API Modules:

| Module | Endpoint prefix | Description |
|--------|-----------------|-------------|
| Auth | `/api/auth/**` | Registration, login, Google OAuth |
| Users | `/api/users/**` | User profile management |
| Jobs | `/api/jobs/**` | CRUD job postings |
| Companies | `/api/companies/**` | Company profile information |
| CVs | `/api/cvs/**` | Upload, extract, and evaluate CVs |
| Applications | `/api/applications/**` | Job application management |
| Saved Jobs | `/api/saved-jobs/**` | Save favorite jobs |
| Chatbot | `/api/chatbot/**` | AI Chatbot (RAG) |
| Articles | `/api/articles/**` | Blog & articles |

---

<p align="center">Made with ❤️ by Team JobPilot – UIT IE303 2025-2026</p>
