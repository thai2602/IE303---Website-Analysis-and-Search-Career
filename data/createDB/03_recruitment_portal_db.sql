-- =======================================================
-- MODULE 3: RECRUITMENT & PORTAL (Việc làm, Ứng tuyển & Blog)
-- Kết nối gián tiếp qua user_id và employer_id
-- =======================================================

CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL -- 'JOB_INDUSTRY' (Ngành nghề) hoặc 'BLOG_CATEGORY' (Chuyên mục Blog)
);

CREATE TABLE skills (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL -- Bảng Master Data kỹ năng (Java, Python...)
);

CREATE TABLE companies (
    id BIGSERIAL PRIMARY KEY,
    employer_id BIGINT NOT NULL, -- Định danh HR (Không có FK vật lý)
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    logo_url TEXT,
    website VARCHAR(255),
    tax_code VARCHAR(100),
    size VARCHAR(50),
    description TEXT,
    culture TEXT,
    benefits TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);
CREATE INDEX idx_company_employer ON companies(employer_id);

CREATE TABLE jobs (
    id BIGSERIAL PRIMARY KEY,
    company_id BIGINT REFERENCES companies(id) ON DELETE CASCADE,
    industry_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    job_type VARCHAR(50), -- FULL_TIME, REMOTE...
    job_level VARCHAR(50), -- FRESHER, JUNIOR...
    experience_years VARCHAR(50), 
    salary_min NUMERIC(15, 2),
    salary_max NUMERIC(15, 2),
    currency VARCHAR(10) DEFAULT 'VND',
    location_city VARCHAR(100),
    location_address TEXT,
    description TEXT,
    requirements TEXT,
    benefits TEXT,
    status VARCHAR(50) DEFAULT 'PUBLISHED', 
    expired_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE job_skills (
    job_id BIGINT REFERENCES jobs(id) ON DELETE CASCADE,
    skill_id BIGINT REFERENCES skills(id) ON DELETE CASCADE,
    PRIMARY KEY (job_id, skill_id)
);

CREATE TABLE saved_jobs (
    user_id BIGINT NOT NULL,
    job_id BIGINT REFERENCES jobs(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, job_id)
);

CREATE TABLE applications (
    id BIGSERIAL PRIMARY KEY,
    job_id BIGINT REFERENCES jobs(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL, -- Ứng viên nộp đơn
    cv_snapshot JSONB, -- LƯU Ý: Lưu nguyên cục JSON/Thông tin CV tại thời điểm nộp (Tránh Live CV bị đổi)
    cover_letter TEXT,
    status VARCHAR(50) DEFAULT 'PENDING',
    employer_feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);
CREATE INDEX idx_application_user ON applications(user_id);
CREATE INDEX idx_application_job ON applications(job_id);

-- Phần Blog (Cẩm nang)
CREATE TABLE articles (
    id BIGSERIAL PRIMARY KEY,
    author_id BIGINT NOT NULL, -- Có thể là Admin hoặc HR viết bài
    category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    thumbnail_url TEXT,
    content TEXT NOT NULL,
    views_count INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);