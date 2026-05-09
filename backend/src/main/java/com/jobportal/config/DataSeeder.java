package com.jobportal.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.FileSystemResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.init.ScriptUtils;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    public DataSeeder(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) throws Exception {

        System.out.println("Clearing old data...");

        // Xóa toàn bộ data (Dùng CASCADE của PostgreSQL để tự động xóa các bảng phụ thuộc và bỏ qua ràng buộc khóa ngoại)
        jdbcTemplate.execute("TRUNCATE TABLE jobs, companies CASCADE;");

        String[] files = {
            "C:/WorkSpace/Web/Website-Analysis-and-Search-Career/data/example_data/03_base_data.sql",
            "C:/WorkSpace/Web/Website-Analysis-and-Search-Career/data/example_data/03_company_data.sql",
            "C:/WorkSpace/Web/Website-Analysis-and-Search-Career/data/example_data/03_jobs_data.sql"
        };

        for (String file : files) {

            System.out.println("Executing: " + file);

            try (java.sql.Connection conn =
                         jdbcTemplate.getDataSource().getConnection()) {

                ScriptUtils.executeSqlScript(
                        conn,
                        new FileSystemResource(file)
                );

                System.out.println("Done: " + file);

            } catch (Exception e) {

                System.out.println("Error in file: " + file);
                e.printStackTrace();
            }
        }

        System.out.println("Database reseeded successfully.");
    }
}