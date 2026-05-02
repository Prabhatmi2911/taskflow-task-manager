-- -- ============================================================
-- -- Task Manager DB — MySQL Setup Script
-- -- ============================================================
-- -- Run this script manually OR let Spring Boot/JPA auto-create
-- -- the schema via spring.jpa.hibernate.ddl-auto=update
-- -- ============================================================

-- -- Create database (JPA will also do this via createDatabaseIfNotExist=true)
-- CREATE DATABASE IF NOT EXISTS task_manager_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- USE task_manager_db;

-- -- Users table
-- CREATE TABLE IF NOT EXISTS users (
--     id BIGINT AUTO_INCREMENT PRIMARY KEY,
--     username VARCHAR(100) NOT NULL UNIQUE,
--     email VARCHAR(150) NOT NULL UNIQUE,
--     password VARCHAR(255) NOT NULL,
--     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
--     INDEX idx_username (username),
--     INDEX idx_email (email)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -- Tasks table
-- CREATE TABLE IF NOT EXISTS tasks (
--     id BIGINT AUTO_INCREMENT PRIMARY KEY,
--     title VARCHAR(255) NOT NULL,
--     description TEXT,
--     status ENUM('PENDING', 'COMPLETED') NOT NULL DEFAULT 'PENDING',
--     user_id BIGINT NOT NULL,
--     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
--     updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
--     INDEX idx_user_id (user_id),
--     INDEX idx_status (status)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -- ============================================================
-- -- NOTE: The default admin user is seeded automatically by
-- -- DataInitializer.java on application startup.
-- -- Username: admin | Password: admin123
-- -- ============================================================

