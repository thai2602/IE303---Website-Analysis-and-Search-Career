import os
import csv
import re
from pathlib import Path

# Cấu hình đường dẫn
BASE_DIR = Path(__file__).parent.parent / "backend" / "src" / "main" / "resources" / "rag-data"
CSV_PATH = Path(__file__).parent / "job_dataset.csv"
OUTPUT_JOBS_DIR = BASE_DIR / "processed" / "jobs"

# Đảm bảo thư mục tồn tại
OUTPUT_JOBS_DIR.mkdir(parents=True, exist_ok=True)

def clean_text(text):
    """Làm sạch văn bản: xóa khoảng trắng thừa, ký tự rác"""
    if not text:
        return ""
    text = str(text).strip()
    text = re.sub(r'\s+', ' ', text)  # Xóa multiple spaces
    return text

def split_to_markdown_list(items_str):
    """Chuyển đổi chuỗi cách nhau bởi dấu chấm phẩy thành danh sách markdown"""
    if not items_str:
        return ""
    # Cắt theo dấu chấm phẩy và loại bỏ các phần tử rỗng
    items = [clean_text(item) for item in str(items_str).split(';') if item.strip()]
    
    # Format thành markdown list
    return '\n'.join([f"* {item}" for item in items])

def process_csv_to_markdown(csv_path, output_dir):
    print(f"Đang đọc dữ liệu từ: {csv_path}")
    
    success_count = 0
    with open(csv_path, mode='r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        
        for row in reader:
            job_id = clean_text(row.get('JobID', ''))
            if not job_id:
                continue
                
            role = clean_text(row.get('Title', ''))
            level = clean_text(row.get('ExperienceLevel', ''))
            yoe = clean_text(row.get('YearsOfExperience', ''))
            
            skills_list = split_to_markdown_list(row.get('Skills', ''))
            resp_list = split_to_markdown_list(row.get('Responsibilities', ''))
            keywords_list = split_to_markdown_list(row.get('Keywords', ''))
            
            # Khởi tạo nội dung Markdown với metadata (Frontmatter)
            md_content = f"""---
job_id: {job_id}
role: {role}
level: {level}
years_of_experience: {yoe}
skills:
{skills_list}
keywords:
{keywords_list}
---

# {role}

## Experience Level
{level} ({yoe} years)

## Skills
{skills_list}

## Responsibilities
{resp_list}

## ATS Keywords
{keywords_list}
"""
            # Lưu ra file .md
            output_file = output_dir / f"{job_id}.md"
            with open(output_file, 'w', encoding='utf-8') as md_file:
                md_file.write(md_content)
                
            success_count += 1
            
    print(f"Hoàn thành! Đã tạo {success_count} file markdown tại {output_dir}")

if __name__ == "__main__":
    if not CSV_PATH.exists():
        print(f"Lỗi: Không tìm thấy file {CSV_PATH}")
    else:
        process_csv_to_markdown(CSV_PATH, OUTPUT_JOBS_DIR)
