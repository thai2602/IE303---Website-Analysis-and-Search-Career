-- =======================================================
-- MODULE 1: AUTH & USER IDENTITY
-- Quản lý tài khoản, phân quyền (RBAC) và Profile cơ bản
-- =======================================================

CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL -- VD: ROLE_ADMIN, ROLE_EMPLOYER, ROLE_CANDIDATE
);

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    auth_provider VARCHAR(50) DEFAULT 'LOCAL', -- LOCAL, GOOGLE, FACEBOOK
    provider_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'ACTIVE', -- ACTIVE, BANNED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE user_roles (
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    role_id BIGINT REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE user_profiles (
    user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    gender VARCHAR(20),
    dob DATE, -- Date of Birth
    address TEXT,
    bio TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);