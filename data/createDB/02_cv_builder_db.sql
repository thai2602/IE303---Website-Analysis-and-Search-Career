-- =======================================================
-- MODULE 2: CV BUILDER (Hệ thống tạo CV)
-- Tâm điểm là user_id (Lấy từ Identity DB)
-- =======================================================

CREATE TABLE cv_templates (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    thumbnail_url TEXT,
    html_structure TEXT -- Lưu cấu trúc HTML/CSS của mẫu CV
);

CREATE TABLE cv_profiles (
    user_id BIGINT PRIMARY KEY, -- 1 User có 1 Live CV
    template_id BIGINT REFERENCES cv_templates(id) ON DELETE SET NULL,
    cv_title VARCHAR(255), -- VD: "Senior Java Developer"
    file_url TEXT, -- Link file PDF nếu ứng viên chỉ muốn upload file có sẵn
    cv_data JSONB, -- Cột siêu mạnh: Lưu cục JSON chứa layout/data kéo thả từ UI
    summary TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Các bảng chi tiết dưới đây hỗ trợ thêm nếu cần bóc tách dữ liệu
-- (Nếu lưu tất cả vào cột cv_data JSONB ở trên thì có thể không cần dùng tới các bảng này)
CREATE TABLE cv_experiences (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    start_date DATE,
    end_date DATE,
    description TEXT,
    technologies TEXT
);
CREATE INDEX idx_cv_exp_user ON cv_experiences(user_id);

CREATE TABLE cv_educations (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    school_name VARCHAR(255) NOT NULL,
    major VARCHAR(255),
    start_date DATE,
    end_date DATE
);
CREATE INDEX idx_cv_edu_user ON cv_educations(user_id);

CREATE TABLE cv_projects (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    technologies TEXT,
    link TEXT
);
CREATE INDEX idx_cv_proj_user ON cv_projects(user_id);

CREATE TABLE cv_socials (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    platform VARCHAR(50), -- GitHub, LinkedIn, Behance...
    url TEXT NOT NULL
);
CREATE INDEX idx_cv_social_user ON cv_socials(user_id);