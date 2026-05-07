-- Chèn Roles
INSERT INTO roles (id, name) VALUES 
(1, 'ROLE_ADMIN'),
(2, 'ROLE_EMPLOYER'),
(3, 'ROLE_CANDIDATE');

-- Chèn Users (Mật khẩu giả lập đã hash - tương đương 'password123')
INSERT INTO users (id, email, password_hash, role, status) VALUES 
(1, 'admin@jobpilot.com', '$2a$10$X.fM/p..', 'ROLE_ADMIN', 'ACTIVE'),
(2, 'hr.test@company.com', '$2a$10$X.fM/p..', 'ROLE_EMPLOYER', 'ACTIVE'),
(3, 'test_candidate@gmail.com', '$2a$10$X.fM/p..', 'ROLE_CANDIDATE', 'ACTIVE');

-- Phân quyền cụ thể
INSERT INTO user_roles (user_id, role_id) VALUES 
(1, 1), (2, 2), (3, 3);

-- Chèn Profiles
INSERT INTO user_profiles (user_id, full_name, phone, dob, address) VALUES 
(1, 'Admin', '0000000001', '1990-01-01', 'Hà Nội'),
(2, 'HR Test', '0000000002', '1985-05-15', 'Đà Nẵng'),
(3, 'Nguyễn Văn A', '0000000003', '1992-12-10', 'TP.HCM'),