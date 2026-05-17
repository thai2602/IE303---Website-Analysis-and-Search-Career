import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock3, MapPin, Wallet, Search, Flame, Bookmark, ChevronDown, ChevronRight, Heart, X, Building2, CalendarClock, Trash2 } from "lucide-react";
import image1 from "../../assets/company_logo/image_1.png";
import image2 from "../../assets/company_logo/image_2.png";
import image3 from "../../assets/company_logo/image_3.png";
import { companies as companiesCatalog } from "../companies/CompaniesPage";
import { readAuthUser } from "../../utils/auth";
import { getApplicationStatusMeta } from "../../utils/application";
import { hasCreatedCv } from "../../utils/cv";
import { toVietnameseJobTitle } from "../../utils/jobTitle";



type Job = {
   title: string;
   company: string;
   companyColor: string;
   companyDescription: string;
   description: string;
   place: string;
   field: string;
   type: string;
   salary: string;
   tags: string[];
   hot: boolean;
   posted: string;
   image: string;
   companyUrl: string;
};

type CareerCompany = {
   company: string;
   companyColor: string;
   companyDescription: string;
   description: string;
   salary: string;
   location: string;
   benefits: string[];
   field: string;
   image: string;
   companyUrl: string;
};

type CareerPosition = {
   title: string;
   salary: string;
   skills: string[];
   description: string;
   companies?: CareerCompany[];
};

type CareerGroup = {
   name: string;
   positions: CareerPosition[];
};

const jobs: Job[] = [
   {
      title: "Frontend React Developer",
      company: "NovaTech",
      companyColor: "#6366f1",
      companyDescription: "NovaTech là công ty công nghệ hàng đầu, chuyên phát triển phần mềm và giải pháp số cho doanh nghiệp.",
      description: "Phát triển giao diện người dùng với React, TypeScript và Figma. Tham gia vào các dự án web hiện đại.",
      place: "TP. HCM",
      field: "Công nghệ thông tin",
      type: "Full-time",
      salary: "25–35 triệu",
      tags: ["React", "TypeScript", "Figma"],
      hot: true,
      posted: "2 ngày trước",
      image: image1,
      companyUrl: "/cong-ty",
   },
   {
      title: "UI/UX Designer",
      company: "BluePixel",
      companyColor: "#ec4899",
      companyDescription: "BluePixel chuyên thiết kế trải nghiệm người dùng sáng tạo và giải pháp thiết kế đồ họa.",
      description: "Thiết kế giao diện và trải nghiệm người dùng cho ứng dụng di động và web. Sử dụng Figma và prototyping.",
      place: "Hà Nội",
      field: "Công nghệ thông tin",
      type: "Hybrid",
      salary: "18–28 triệu",
      tags: ["Figma", "Prototyping", "User Research"],
      hot: false,
      posted: "1 ngày trước",
      image: image2,
      companyUrl: "/cong-ty",
   },
   {
      title: "Backend Node.js Engineer",
      company: "ScaleHub",
      companyColor: "#f59e0b",
      companyDescription: "ScaleHub cung cấp dịch vụ đám mây và hạ tầng kỹ thuật cho các doanh nghiệp quy mô lớn.",
      description: "Xây dựng hệ thống backend với Node.js, MongoDB và Docker. Đảm bảo hiệu suất và bảo mật.",
      place: "Đà Nẵng",
      field: "Công nghệ thông tin",
      type: "Remote",
      salary: "30–45 triệu",
      tags: ["Node.js", "MongoDB", "Docker"],
      hot: true,
      posted: "Hôm nay",
      image: image3,
      companyUrl: "/cong-ty",
   },
   {
      title: "Chuyên viên Digital Marketing",
      company: "GrowthBee",
      companyColor: "#14b8a6",
      companyDescription: "GrowthBee tập trung vào tăng trưởng thương hiệu thông qua dữ liệu và performance marketing.",
      description: "Xây dựng chiến dịch quảng cáo đa kênh, tối ưu chuyển đổi và báo cáo hiệu quả theo tuần.",
      place: "TP. HCM",
      field: "Marketing/Quảng cáo",
      type: "Full-time",
      salary: "18–30 triệu",
      tags: ["Google Ads", "Meta Ads", "GA4"],
      hot: false,
      posted: "3 ngày trước",
      image: image2,
      companyUrl: "/cong-ty",
   },
   {
      title: "Nhân viên kinh doanh B2B",
      company: "SaleSphere",
      companyColor: "#0ea5e9",
      companyDescription: "SaleSphere là nền tảng hỗ trợ bán hàng B2B cho doanh nghiệp vừa và nhỏ.",
      description: "Tìm kiếm khách hàng doanh nghiệp, tư vấn giải pháp và chốt hợp đồng theo chỉ tiêu tháng.",
      place: "Hà Nội",
      field: "Kinh doanh/Bán hàng",
      type: "Full-time",
      salary: "15–25 triệu",
      tags: ["Tư vấn", "Đàm phán", "CRM"],
      hot: true,
      posted: "Hôm qua",
      image: image1,
      companyUrl: "/cong-ty",
   },
   {
      title: "Kế toán tổng hợp",
      company: "Finverse",
      companyColor: "#f59e0b",
      companyDescription: "Finverse cung cấp dịch vụ tài chính số và quản lý tài sản cá nhân.",
      description: "Theo dõi dòng tiền, lập báo cáo tài chính và phối hợp với kiểm toán nội bộ.",
      place: "Đà Nẵng",
      field: "Kế toán",
      type: "Hybrid",
      salary: "15–25 triệu",
      tags: ["Excel", "MISA", "Thuế"],
      hot: false,
      posted: "4 ngày trước",
      image: image3,
      companyUrl: "/cong-ty",
   },
];

const typeColors: Record<string, { bg: string; text: string }> = {
   "Full-time": { bg: "#ecfdf5", text: "#059669" },
   "Hybrid": { bg: "#eef2ff", text: "#4f46e5" },
   "Remote": { bg: "#fffbeb", text: "#b45309" },
};

const fieldColors: Record<string, { bg: string; text: string }> = {
   "Công nghệ thông tin": { bg: "#eef2ff", text: "#4f46e5" },
   "Kinh doanh/Bán hàng": { bg: "#ecfdf5", text: "#059669" },
   "Marketing/Quảng cáo": { bg: "#fce7f3", text: "#be185d" },
   "Tài chính/Ngân hàng": { bg: "#fffbeb", text: "#b45309" },
   "Bất động sản": { bg: "#fff7ed", text: "#c2410c" },
   "Xây dựng": { bg: "#f1f5f9", text: "#334155" },
   "Lao động phổ thông": { bg: "#fef2f2", text: "#dc2626" },
   "Tài xế": { bg: "#f0fdfa", text: "#0d9488" },
   "Logistics/Kho vận": { bg: "#ecfdf5", text: "#047857" },
   "Nhóm ngành khác": { bg: "#f8fafc", text: "#475569" },
   default: { bg: "#f8fafc", text: "#475569" },
};

const careerGroups: CareerGroup[] = [
   {
      name: "Kinh doanh/Bán hàng",
      positions: [
         { title: "Nhân viên kinh doanh", salary: "15–25 triệu", skills: ["Giao tiếp tốt", "Kỹ năng thuyết phục", "Quản lý thời gian"], description: "Trách nhiệm tìm kiếm khách hàng tiềm năng, giới thiệu sản phẩm và dịch vụ, đàm phán hợp đồng để đạt mục tiêu doanh số." },
         { title: "Trưởng phòng kinh doanh", salary: "30–50 triệu", skills: ["Lãnh đạo đội ngũ", "Phân tích thị trường", "Đàm phán hợp đồng"], description: "Quản lý đội ngũ kinh doanh, xây dựng chiến lược bán hàng, phân tích thị trường và đảm bảo đạt mục tiêu kinh doanh." },
      ],
   },
   {
      name: "Marketing/Quảng cáo",
      positions: [
         { title: "Chuyên viên marketing", salary: "18–30 triệu", skills: ["SEO/SEM", "Content creation", "Phân tích dữ liệu"], description: "Phát triển chiến lược marketing số, tạo nội dung quảng cáo, tối ưu hóa website và phân tích hiệu quả chiến dịch." },
         { title: "Quản lý quảng cáo", salary: "25–40 triệu", skills: ["Chiến lược marketing", "Quản lý dự án", "Google Ads"], description: "Quản lý các chiến dịch quảng cáo, phối hợp với đội ngũ sáng tạo, theo dõi ngân sách và đo lường hiệu quả quảng cáo." },
      ],
   },
   {
      name: "Công nghệ thông tin",
      positions: [
         { title: "Lập trình viên Frontend", salary: "20–35 triệu", skills: ["React", "JavaScript", "CSS"], description: "Phát triển giao diện người dùng với React, đảm bảo trải nghiệm người dùng mượt mà và tương thích trên nhiều thiết bị." },
         { title: "Lập trình viên Backend", salary: "25–45 triệu", skills: ["Node.js", "Python", "Database"], description: "Xây dựng và duy trì hệ thống backend, quản lý cơ sở dữ liệu và đảm bảo hiệu suất của ứng dụng." },
         { title: "DevOps Engineer", salary: "30–50 triệu", skills: ["Docker", "Kubernetes", "AWS"], description: "Triển khai và quản lý hạ tầng đám mây, tự động hóa quy trình CI/CD và đảm bảo tính sẵn sàng của hệ thống." },
      ],
   },
   {
      name: "Lao động phổ thông",
      positions: [
         { title: "Công nhân sản xuất", salary: "8–15 triệu", skills: ["Làm việc nhóm", "Chịu áp lực", "An toàn lao động"], description: "Tham gia quá trình sản xuất, vận hành máy móc và đảm bảo chất lượng sản phẩm theo tiêu chuẩn." },
         { title: "Nhân viên vệ sinh", salary: "6–10 triệu", skills: ["Cẩn thận", "Chăm chỉ", "Sức khỏe tốt"], description: "Thực hiện công việc dọn dẹp, vệ sinh khu vực làm việc và đảm bảo môi trường sạch sẽ." },
      ],
   },
   {
      name: "Tài chính/Ngân hàng",
      positions: [
         { title: "Nhân viên ngân hàng", salary: "12–20 triệu", skills: ["Phân tích tài chính", "Dịch vụ khách hàng", "Kiến thức pháp lý"], description: "Cung cấp dịch vụ ngân hàng cho khách hàng, tư vấn sản phẩm tài chính và xử lý giao dịch." },
         { title: "Chuyên viên tín dụng", salary: "18–30 triệu", skills: ["Đánh giá rủi ro", "Phân tích tín dụng", "Quản lý danh mục"], description: "Đánh giá hồ sơ tín dụng, phân tích rủi ro và quản lý danh mục cho vay của ngân hàng." },
      ],
   },
   {
      name: "Bất động sản",
      positions: [
         { title: "Nhân viên kinh doanh BĐS", salary: "20–35 triệu", skills: ["Giao tiếp", "Kiến thức thị trường", "Đàm phán"], description: "Tư vấn và bán các sản phẩm bất động sản, giới thiệu dự án và hỗ trợ khách hàng trong giao dịch." },
         { title: "Quản lý dự án BĐS", salary: "35–60 triệu", skills: ["Quản lý dự án", "Kiến trúc", "Pháp lý BĐS"], description: "Quản lý toàn bộ quy trình phát triển dự án bất động sản từ lập kế hoạch đến bàn giao." },
      ],
   },
   {
      name: "Xây dựng",
      positions: [
         { title: "Kỹ sư xây dựng", salary: "25–40 triệu", skills: ["AutoCAD", "Quản lý dự án", "Kiến thức kỹ thuật"], description: "Thiết kế và giám sát các công trình xây dựng, đảm bảo tuân thủ tiêu chuẩn kỹ thuật và an toàn." },
         { title: "Công nhân xây dựng", salary: "10–18 triệu", skills: ["An toàn lao động", "Kỹ năng thủ công", "Làm việc nhóm"], description: "Thực hiện các công việc xây dựng như đổ bê tông, lắp đặt và hoàn thiện công trình." },
      ],
   },
   {
      name: "Kế toán",
      positions: [
         {
            title: "Kế toán viên",
            salary: "15–25 triệu",
            skills: ["Excel", "Phần mềm kế toán", "Kiến thức thuế"],
            description: "Ghi nhận và tổng hợp các giao dịch tài chính, lập báo cáo và đảm bảo tuân thủ quy định thuế.",
            companies: [
               {
                  company: "Finverse",
                  companyColor: "#f59e0b",
                  companyDescription: "Finverse cung cấp dịch vụ tài chính số và quản lý tài sản cá nhân.",
                  description: "Tham gia đội ngũ kế toán để quản lý sổ sách và báo cáo tài chính.",
                  salary: "15–25 triệu",
                  location: "Đà Nẵng",
                  benefits: ["Lương cao", "Thưởng", "Phụ cấp công nghệ"],
                  field: "Finance",
                  image: image1,
                  companyUrl: "/cong-ty",
               },
               {
                  company: "ConsultPro",
                  companyColor: "#0891b2",
                  companyDescription: "ConsultPro tư vấn chiến lược và tài chính cho doanh nghiệp.",
                  description: "Hỗ trợ khách hàng doanh nghiệp trong quản lý tài chính và chuẩn bị báo cáo.",
                  salary: "16–26 triệu",
                  location: "TP. HCM",
                  benefits: ["Làm việc linh hoạt", "Thưởng dự án", "Đào tạo chuyên sâu"],
                  field: "Consulting",
                  image: image2,
                  companyUrl: "/cong-ty",
               },
            ],
         },
         {
            title: "Kiểm toán viên",
            salary: "25–40 triệu",
            skills: ["Phân tích tài chính", "Tuân thủ pháp lý", "Báo cáo"],
            description: "Kiểm tra và xác minh tính chính xác của báo cáo tài chính, phát hiện rủi ro và đưa ra khuyến nghị.",
            companies: [
               {
                  company: "Finverse",
                  companyColor: "#f59e0b",
                  companyDescription: "Finverse cung cấp dịch vụ tài chính số và quản lý tài sản cá nhân.",
                  description: "Thực hiện kiểm toán nội bộ và hỗ trợ hoàn thiện báo cáo tài chính.",
                  salary: "25–40 triệu",
                  location: "Đà Nẵng",
                  benefits: ["Lương tốt", "Thăng tiến", "Bảo hiểm"],
                  field: "Finance",
                  image: image1,
                  companyUrl: "/cong-ty",
               },
               {
                  company: "ConsultPro",
                  companyColor: "#0891b2",
                  companyDescription: "ConsultPro tư vấn chiến lược và tài chính cho doanh nghiệp.",
                  description: "Thực hiện kiểm toán khách hàng và báo cáo tuân thủ quy định.",
                  salary: "28–42 triệu",
                  location: "TP. HCM",
                  benefits: ["Thưởng dự án", "Lương bonus", "Đào tạo chuyên môn"],
                  field: "Consulting",
                  image: image2,
                  companyUrl: "/cong-ty",
               },
            ],
         },
      ],
   },
   {
      name: "Tài xế",
      positions: [
         {
            title: "Tài xế xe tải",
            salary: "12–20 triệu",
            skills: ["Lái xe an toàn", "Kiến thức giao thông", "Bảo dưỡng xe"],
            description: "Vận chuyển hàng hóa bằng xe tải, đảm bảo an toàn giao thông và đúng thời hạn.",
            companies: [
               {
                  company: "AutoTech",
                  companyColor: "#dc2626",
                  companyDescription: "AutoTech sản xuất và lắp ráp xe hơi với nhà máy ở Vĩnh Phúc.",
                  description: "Lái xe tải kho bãi nội bộ đưa linh kiện giữa các phân xưởng.",
                  salary: "12–20 triệu",
                  location: "Vĩnh Phúc",
                  benefits: ["Bảo hiểm", "Phụ cấp ca đêm", "Đào tạo lái xe"],
                  field: "Automotive",
                  image: image3,
                  companyUrl: "/cong-ty",
               },
               {
                  company: "LogiChain",
                  companyColor: "#059669",
                  companyDescription: "LogiChain cung cấp dịch vụ logistics và kho vận cho khách hàng lớn.",
                  description: "Vận chuyển hàng hóa liên tỉnh và đảm bảo thời hạn giao nhận.",
                  salary: "12–20 triệu",
                  location: "Đà Nẵng",
                  benefits: ["Ổn định", "Phụ cấp xăng", "Thưởng hiệu suất"],
                  field: "Logistics",
                  image: image1,
                  companyUrl: "/cong-ty",
               },
            ],
         },
         {
            title: "Tài xế xe khách",
            salary: "15–25 triệu",
            skills: ["Phục vụ khách hàng", "Quản lý thời gian", "An toàn"],
            description: "Vận chuyển hành khách, đảm bảo an toàn và cung cấp dịch vụ chất lượng cao.",
            companies: [
               {
                  company: "TravelGo",
                  companyColor: "#0d9488",
                  companyDescription: "TravelGo kết nối du lịch và vận tải hành khách nội địa.",
                  description: "Vận chuyển khách theo tuyến cố định và hỗ trợ hành khách khi cần.",
                  salary: "15–25 triệu",
                  location: "Đà Nẵng",
                  benefits: ["Du lịch", "Bảo hiểm", "Linh hoạt giờ"],
                  field: "Travel",
                  image: image2,
                  companyUrl: "/cong-ty",
               },
               {
                  company: "CityRides",
                  companyColor: "#6366f1",
                  companyDescription: "CityRides cung cấp dịch vụ xe khách và du lịch đường dài.",
                  description: "Lái xe khách đưa đón theo tuyến và phục vụ khách hàng thân thiết.",
                  salary: "16–26 triệu",
                  location: "Hà Nội",
                  benefits: ["Thưởng tuyến", "Bảo hiểm", "Ổn định"],
                  field: "Travel",
                  image: image3,
                  companyUrl: "/cong-ty",
               },
            ],
         },
      ],
   },
   {
      name: "Logistics/Kho vận",
      positions: [
         { title: "Nhân viên kho", salary: "10–18 triệu", skills: ["Quản lý hàng hóa", "Sử dụng forklift", "Đóng gói"], description: "Quản lý tồn kho, sắp xếp hàng hóa và thực hiện các hoạt động kho bãi." },
         { title: "Chuyên viên logistics", salary: "20–35 triệu", skills: ["Quản lý chuỗi cung ứng", "Phân tích dữ liệu", "Đàm phán"], description: "Tối ưu hóa quy trình logistics, quản lý chuỗi cung ứng và đàm phán với nhà cung cấp." },
      ],
   },
   {
      name: "Phiên dịch viên",
      positions: [
         { title: "Phiên dịch viên Anh", salary: "20–40 triệu", skills: ["Ngôn ngữ Anh", "Giao tiếp", "Kiến thức văn hóa"], description: "Dịch thuật tài liệu và phiên họp, hỗ trợ giao tiếp đa ngôn ngữ trong kinh doanh." },
         { title: "Phiên dịch viên Trung", salary: "25–45 triệu", skills: ["Ngôn ngữ Trung", "Dịch thuật", "Kiến thức kinh doanh"], description: "Dịch thuật tiếng Trung, hỗ trợ giao thương với thị trường Trung Quốc." },
      ],
   },
   {
      name: "Nhóm ngành khác",
      positions: [
         { title: "Nhân viên hành chính", salary: "12–20 triệu", skills: ["Quản lý văn phòng", "Excel", "Giao tiếp"], description: "Hỗ trợ các hoạt động hành chính, quản lý văn phòng và phối hợp công việc nội bộ." },
         { title: "Bác sĩ", salary: "30–100 triệu", skills: ["Kiến thức y khoa", "Chăm sóc bệnh nhân", "Đạo đức nghề nghiệp"], description: "Khám và điều trị bệnh nhân, cung cấp dịch vụ y tế chuyên nghiệp." },
      ],
   },
];

const fallbackImages = [image1, image2, image3];

const fieldNameMap: Record<string, string> = {
   "Technology": "Công nghệ thông tin",
   "Ecommerce": "Kinh doanh/Bán hàng",
   "Healthcare": "Nhóm ngành khác",
   "Finance": "Tài chính/Ngân hàng",
   "Design": "Marketing/Quảng cáo",
   "Education": "Nhóm ngành khác",
   "Gaming": "Công nghệ thông tin",
   "Logistics": "Logistics/Kho vận",
   "Manufacturing": "Lao động phổ thông",
   "Consulting": "Kinh doanh/Bán hàng",
   "Real Estate": "Bất động sản",
   "Automotive": "Tài xế",
   "Food & Beverage": "Lao động phổ thông",
   "Travel": "Tài xế",
   "Energy": "Xây dựng",
   "Fashion": "Marketing/Quảng cáo",
   "Agriculture": "Lao động phổ thông",
};

const toVietnameseField = (field: string) => fieldNameMap[field] ?? "Nhóm ngành khác";

const seedJobsFromKnownCompanies: Job[] = jobs
   .filter((job) => companiesCatalog.some((company) => company.name === job.company))
   .map((job) => ({ ...job, title: toVietnameseJobTitle(job.title), field: toVietnameseField(job.field) }));

const companyJobsFromCatalog: Job[] = companiesCatalog.flatMap((company, companyIndex) => {
   const displayField = toVietnameseField(company.field);

   return company.positions.map((position, positionIndex) => ({
      title: toVietnameseJobTitle(position.title),
      company: company.name,
      companyColor: company.color,
      companyDescription: company.description,
      description: position.description,
      place: company.location,
      field: displayField,
      type: positionIndex % 3 === 0 ? "Full-time" : positionIndex % 3 === 1 ? "Hybrid" : "Remote",
      salary: position.salary,
      tags: position.skills,
      hot: positionIndex === 0,
      posted: "Mới cập nhật",
      image: fallbackImages[companyIndex % fallbackImages.length],
      companyUrl: "/cong-ty",
   }));
});

const companyJobs: Job[] = [
   ...seedJobsFromKnownCompanies,
   ...companyJobsFromCatalog,
].filter((job, index, list) => list.findIndex((item) => item.company === job.company && item.title === job.title) === index);


// jobsByGroup was removed in favor of computed grouping later in the file

// previously computed visibleCareerGroups (unused) removed to avoid TS6133


const hiringPromotions = [
   {
      title: "Tuần lễ tuyển dụng IT 2026",
      subtitle: "200+ vị trí Frontend, Backend, Product",
      description: "Kết nối trực tiếp với nhà tuyển dụng công nghệ lớn, phỏng vấn nhanh trong 24h và nhận phản hồi hồ sơ ngay trong sự kiện. Ứng viên còn được tư vấn định hướng nghề nghiệp, chuẩn hóa CV theo từng vị trí và tham gia phiên hỏi đáp cùng các trưởng nhóm kỹ thuật.",
      cta: "Khám phá sự kiện",
      accent: "#2563eb",
   },
   {
      title: "Top công ty hybrid linh hoạt",
      subtitle: "Mô hình làm việc 2-3 ngày tại văn phòng",
      description: "Danh sách doanh nghiệp có chính sách hybrid rõ ràng, phù hợp ứng viên trẻ muốn cân bằng hiệu suất và trải nghiệm cá nhân. Mỗi tin tuyển dụng đi kèm thông tin về thời gian làm việc, phúc lợi và lộ trình tăng trưởng trong 6-12 tháng.Đây có lẽ sẽ là xu hướng làm việc chính trong năm 2026.",
      cta: "Xem danh sách",
      accent: "#059669",
   },
   {
      title: "Mega Career Fair tháng 5",
      subtitle: "Workshop CV + phỏng vấn thử miễn phí",
      description: "Được review CV 1-1 bởi recruiter, tham gia chuỗi mini talk kỹ năng nghề nghiệp và thực hành phỏng vấn thử với bộ câu hỏi bám sát nhu cầu doanh nghiệp. Sự kiện ưu tiên các vị trí IT, Marketing, Sales và nhóm công việc đang tăng trưởng mạnh.",
      cta: "Đăng ký ngay",
      accent: "#db2777",
   },
];

const jobArticles = [
   {
      title: "5 cách tối ưu CV cho vị trí Frontend React Developer",
      category: "CV & Portfolio",
      readTime: "8 phút đọc",
      summary: "Các mục cần nhấn mạnh trong CV công nghệ để tăng tỉ lệ qua vòng lọc hồ sơ, từ cấu trúc dự án đến cách mô tả impact bằng số liệu. Bài viết kèm ví dụ thực tế cho Fresher và Mid-level.",
      image: image1,
   },
   {
      title: "Checklist chuẩn bị phỏng vấn cho ứng viên trái ngành",
      category: "Phỏng vấn",
      readTime: "6 phút đọc",
      summary: "Danh sách các câu hỏi thường gặp và cách trả lời thuyết phục với recruiter, đặc biệt cho ứng viên chuyển ngành. Có mẫu câu trả lời STAR, checklist luyện tập và lỗi cần tránh trước vòng phỏng vấn cuối.",
      image: image2,
   },
   {
      title: "Xu hướng lương ngành IT, Marketing, Sales năm 2026",
      category: "Báo cáo thị trường",
      readTime: "10 phút đọc",
      summary: "Tổng hợp mức lương theo vị trí và kinh nghiệm tại các thành phố lớn, bao gồm biên độ lương theo cấp bậc và kỹ năng. Dữ liệu cập nhật theo nhóm ngành để bạn đặt kỳ vọng đàm phán phù hợp hơn.",
      image: image3,
   },
];

const buildJobLongDescription = (job: Job) => {
   const tagText = job.tags.join(", ");
   return `${job.description} ${job.companyDescription} Vị trí làm việc tại ${job.place} theo hình thức ${job.type}, mức lương tham khảo ${job.salary}. Kỹ năng hoặc phúc lợi liên quan gồm: ${tagText}. Đây là cơ hội phù hợp cho ứng viên muốn phát triển chuyên môn bền vững và có lộ trình thăng tiến rõ ràng.`;
};

const buildCompanyDeepLink = (job: Job) => {
   const params = new URLSearchParams({
      company: job.company,
      jobTitle: job.title,
      field: job.field,
      place: job.place,
      salary: job.salary,
      companyDescription: job.companyDescription,
      jobDescription: job.description,
      companyColor: job.companyColor,
   });

   return `/cong-ty?${params.toString()}`;
};

export default function JobsPage() {
   const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
   const [applications, setApplications] = useState<any[]>([]);
   const [savedJobs, setSavedJobs] = useState<any[]>([]);
   const [showTray, setShowTray] = useState(false);
   const [selectedJob, setSelectedJob] = useState<any>(null);
   const [toast, setToast] = useState<{ kind: "success" | "error"; message: string } | null>(null);

   // --- API jobs state ---
   const [apiJobs, setApiJobs] = useState<Job[]>([]);
   const [isLoadingJobs, setIsLoadingJobs] = useState(true);

   // Fetch công việc từ API, fallback về data tĩnh nếu thất bại
   useEffect(() => {
      fetch("http://localhost:8080/api/jobs")
         .then((res) => {
            if (!res.ok) throw new Error("API error");
            return res.json() as Promise<Array<{
               id: number; title: string; slug: string;
               company: { name: string; color: string; description: string; logoUrl?: string };
               jobType: string; locationCity: string; description: string;
               salaryMin: number; salaryMax: number;
            }>>;
         })
         .then((apiData) => {
            if (!apiData || apiData.length === 0) {
               setApiJobs(companyJobs);
               return;
            }
            // Map API data -> Job
            const mapped: Job[] = apiData.map((apiItem) => ({
               title: apiItem.title,
               company: apiItem.company.name,
               companyColor: apiItem.company.color || "#0ea5e9",
               companyDescription: apiItem.company.description || "",
               description: apiItem.description,
               place: apiItem.locationCity,
               field: "Nhóm ngành khác", // Default field
               type: apiItem.jobType === "FULL_TIME" ? "Full-time" : apiItem.jobType === "REMOTE" ? "Remote" : "Hybrid",
               salary: `${(apiItem.salaryMin / 1000000).toFixed(0)}–${(apiItem.salaryMax / 1000000).toFixed(0)} triệu`,
               tags: [],
               hot: false,
               posted: "Vừa cập nhật",
               image: apiItem.company.logoUrl || image1,
               companyUrl: "/cong-ty",
            }));
            setApiJobs(mapped);
         })
         .catch(() => {
            setApiJobs(companyJobs);
         })
         .finally(() => setIsLoadingJobs(false));
   }, []);

   const displayedJobsList = isLoadingJobs ? companyJobs : (apiJobs.length > 0 ? apiJobs : companyJobs);

   // Tái cấu trúc jobsByGroup dựa trên displayedJobsList
   const jobsByGroupComputed: Record<string, Job[]> = careerGroups.reduce((acc, group) => {
      acc[group.name] = displayedJobsList.filter((job) => job.field === group.name || (group.name === "Nhóm ngành khác" && job.field === "Nhóm ngành khác"));
      return acc;
   }, {} as Record<string, Job[]>);

   const visibleCareerGroupsComputed = careerGroups.filter((group) => (jobsByGroupComputed[group.name]?.length ?? 0) > 0);

   const activeGroupJobs = selectedGroup ? jobsByGroupComputed[selectedGroup] ?? [] : [];

   useEffect(() => {
      const savedApplications = localStorage.getItem("jobpilot_applications");
      const savedSavedJobs = localStorage.getItem("jobpilot_saved_jobs");
      if (savedApplications) setApplications(JSON.parse(savedApplications));
      if (savedSavedJobs) setSavedJobs(JSON.parse(savedSavedJobs));
   }, []);

   useEffect(() => {
      localStorage.setItem("jobpilot_applications", JSON.stringify(applications));
   }, [applications]);

   useEffect(() => {
      localStorage.setItem("jobpilot_saved_jobs", JSON.stringify(savedJobs));
   }, [savedJobs]);

   useEffect(() => {
      if (!toast) {
         return;
      }

      const timeoutId = window.setTimeout(() => setToast(null), 2600);
      return () => window.clearTimeout(timeoutId);
   }, [toast]);

   const showToast = (message: string, kind: "success" | "error" = "success") => {
      setToast({ message, kind });
   };

   const toggleGroup = (groupName: string) => {
      setSelectedGroup((current) => (current === groupName ? null : groupName));
   };

   const addApplication = (job: any) => {
      if (!readAuthUser()) {
         showToast("Bạn cần đăng nhập trước khi ứng tuyển.", "error");
         return;
      }

      if (!hasCreatedCv()) {
         showToast("Bạn chưa có CV. Vui lòng tạo CV trước khi ứng tuyển.", "error");
         return;
      }

      if (applications.some((item) => item.company === job.company && item.title === job.title)) {
         showToast("Bạn đã ứng tuyển vị trí này rồi.", "error");
         return;
      }

      const id = `${job.company}-${job.title}-${Date.now()}`;
      setApplications([
         {
            ...job,
            id,
            appliedAt: new Date().toLocaleString("vi-VN"),
            status: "Đang chờ xác nhận",
            trackingNote: "Hồ sơ đã được ghi nhận và đang đợi nhà tuyển dụng phản hồi.",
         },
         ...applications,
      ]);
      showToast(`Đã ứng tuyển thành công: ${job.title} tại ${job.company}.`);
   };

   const addSavedJob = (job: any) => {
      if (savedJobs.some((item) => item.company === job.company && item.title === job.title)) {
         showToast("Công việc này đã có trong mục đã lưu.", "error");
         return;
      }
      const id = `${job.company}-${job.title}-${Date.now()}`;
      setSavedJobs([{ ...job, id, savedAt: new Date().toLocaleString("vi-VN") }, ...savedJobs]);
      showToast(`Đã lưu công việc: ${job.title} tại ${job.company}.`);
   };

   const removeApplication = (id: string) => {
      setApplications((current) => current.filter((item) => item.id !== id));
      showToast("Đã xóa hồ sơ ứng tuyển.");
   };

   const removeSavedJob = (id: string) => {
      setSavedJobs((current) => current.filter((item) => item.id !== id));
      showToast("Đã xóa mục đã lưu.");
   };

   const applicationToneStyles: Record<string, { badge: string; border: string; accent: string; panel: string }> = {
      amber: {
         badge: "border-amber-200 bg-amber-50 text-amber-700",
         border: "#fcd34d",
         accent: "#f59e0b",
         panel: "linear-gradient(135deg, #fff7ed 0%, #ffffff 55%, #ffffff 100%)",
      },
      sky: {
         badge: "border-sky-200 bg-sky-50 text-sky-700",
         border: "#7dd3fc",
         accent: "#0ea5e9",
         panel: "linear-gradient(135deg, #f0f9ff 0%, #ffffff 55%, #ffffff 100%)",
      },
      emerald: {
         badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
         border: "#6ee7b7",
         accent: "#10b981",
         panel: "linear-gradient(135deg, #ecfdf5 0%, #ffffff 55%, #ffffff 100%)",
      },
      rose: {
         badge: "border-rose-200 bg-rose-50 text-rose-700",
         border: "#fda4af",
         accent: "#f43f5e",
         panel: "linear-gradient(135deg, #fff1f2 0%, #ffffff 55%, #ffffff 100%)",
      },
      slate: {
         badge: "border-gray-200 bg-gray-50 text-gray-700",
         border: "#cbd5e1",
         accent: "#64748b",
         panel: "linear-gradient(135deg, #f8fafc 0%, #ffffff 55%, #ffffff 100%)",
      },
   };

   const renderApplicationCard = (item: any) => {
      const statusMeta = getApplicationStatusMeta(item.status);
      const tone = applicationToneStyles[statusMeta.tone] ?? applicationToneStyles.slate;

      return (
         <article
            key={item.id}
            style={{
               background: tone.panel,
               border: `1px solid ${tone.border}`,
               borderRadius: 16,
               padding: 14,
               boxShadow: "0 12px 30px rgba(15,23,42,0.06)",
            }}
         >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
               <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                     <span style={{ display: "inline-flex", alignItems: "center", borderRadius: 999, background: "#0f172a", color: "#fff", padding: "3px 10px", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em" }}>
                        Hồ sơ ứng tuyển
                     </span>
                     <span style={{ display: "inline-flex", alignItems: "center", borderWidth: 1, borderStyle: "solid", borderRadius: 999, padding: "3px 10px", fontSize: 11, fontWeight: 700 }} className={tone.badge}>
                        {statusMeta.label}
                     </span>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", lineHeight: 1.35 }}>{toVietnameseJobTitle(item.title || "Vị trí chưa xác định")}</div>
                  <div style={{ marginTop: 6, fontSize: 13, color: "#475569", display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                     <Building2 style={{ width: 13, height: 13 }} />
                     <span>{item.company || "Chưa có công ty"}</span>
                  </div>
               </div>

               <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "#64748b", fontWeight: 700 }}>Trạng thái</div>
                  <div style={{ marginTop: 4, fontSize: 13, fontWeight: 800, color: "#0f172a" }}>{statusMeta.label}</div>
               </div>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
               {item.place && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, borderRadius: 999, background: "#f8fafc", border: "1px solid #e2e8f0", padding: "4px 10px", fontSize: 11, fontWeight: 700, color: "#475569" }}>
                     <MapPin style={{ width: 12, height: 12 }} />
                     {item.place}
                  </span>
               )}
               {item.salary && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, borderRadius: 999, background: "#f8fafc", border: "1px solid #e2e8f0", padding: "4px 10px", fontSize: 11, fontWeight: 700, color: "#475569" }}>
                     <Wallet style={{ width: 12, height: 12 }} />
                     {item.salary}
                  </span>
               )}
               {item.type && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, borderRadius: 999, background: "#f8fafc", border: "1px solid #e2e8f0", padding: "4px 10px", fontSize: 11, fontWeight: 700, color: "#475569" }}>
                     <Clock3 style={{ width: 12, height: 12 }} />
                     {item.type}
                  </span>
               )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, fontSize: 12, color: "#64748b" }}>
               <CalendarClock style={{ width: 13, height: 13 }} />
               <span>Nộp lúc {item.appliedAt || "chưa xác định"}</span>
            </div>

            <p style={{ marginTop: 10, fontSize: 12, color: "#334155", lineHeight: 1.6 }}>{statusMeta.note}</p>
         </article>
      );
   };

   const renderSavedJobCard = (item: any) => (
      <article
         key={item.id}
         style={{
            background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 65%, #f8fafc 100%)",
            border: "1px solid #e2e8f0",
            borderRadius: 16,
            padding: 14,
            boxShadow: "0 12px 30px rgba(15,23,42,0.05)",
         }}
      >
         <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
            <div style={{ minWidth: 0, flex: 1 }}>
               <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", borderRadius: 999, background: "#ecfdf5", color: "#047857", padding: "3px 10px", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em" }}>
                     Đã lưu
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", borderRadius: 999, background: "#f8fafc", color: "#475569", padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>
                     {item.savedAt || "Chưa xác định thời gian"}
                  </span>
               </div>
               <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", lineHeight: 1.35 }}>{toVietnameseJobTitle(item.title || "Công việc đã lưu")}</div>
               <div style={{ marginTop: 6, fontSize: 13, color: "#475569", display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  <Building2 style={{ width: 13, height: 13 }} />
                  <span>{item.company || "Chưa có công ty"}</span>
               </div>
            </div>

            <div style={{ textAlign: "right", flexShrink: 0 }}>
               <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "#64748b", fontWeight: 700 }}>Mục lưu</div>
               <div style={{ marginTop: 4, fontSize: 13, fontWeight: 800, color: "#0f172a" }}>Đang theo dõi</div>
            </div>
         </div>

         <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
            {item.place && (
               <span style={{ display: "inline-flex", alignItems: "center", gap: 5, borderRadius: 999, background: "#f8fafc", border: "1px solid #e2e8f0", padding: "4px 10px", fontSize: 11, fontWeight: 700, color: "#475569" }}>
                  <MapPin style={{ width: 12, height: 12 }} />
                  {item.place}
               </span>
            )}
            {item.salary && (
               <span style={{ display: "inline-flex", alignItems: "center", gap: 5, borderRadius: 999, background: "#f8fafc", border: "1px solid #e2e8f0", padding: "4px 10px", fontSize: 11, fontWeight: 700, color: "#475569" }}>
                  <Wallet style={{ width: 12, height: 12 }} />
                  {item.salary}
               </span>
            )}
            {item.field && (
               <span style={{ display: "inline-flex", alignItems: "center", gap: 5, borderRadius: 999, background: "#f8fafc", border: "1px solid #e2e8f0", padding: "4px 10px", fontSize: 11, fontWeight: 700, color: "#475569" }}>
                  <Clock3 style={{ width: 12, height: 12 }} />
                  {item.field}
               </span>
            )}
         </div>
      </article>
   );

   return (
      <div className="space-y-8">
         {/* Hero */}
         <div style={{
            borderRadius: "24px",
            background: "linear-gradient(135deg, #0f172a 0%, #0e9f6e 45%, #10b981 100%)",
            padding: "52px 48px 40px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 28px 90px rgba(15,23,42,0.18)",
         }}>
            <div style={{
               position: "absolute", top: "-60px", right: "-40px", width: "260px", height: "260px",
               borderRadius: "50%", background: "rgba(255,255,255,0.16)", filter: "blur(40px)",
            }} />
            <div style={{
               position: "absolute", bottom: "-50px", left: "15%", width: "220px", height: "220px",
               borderRadius: "50%", background: "rgba(255,255,255,0.1)", filter: "blur(38px)",
            }} />

            <h1 style={{ fontSize: "42px", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.04em", marginBottom: "16px", maxWidth: "780px" }}>
               Tìm việc nhanh chóng và chuyên nghiệp
            </h1>
            <p style={{ color: "#e2e8f0", fontSize: "16px", lineHeight: 1.8, maxWidth: "720px", marginBottom: "32px" }}>
               Khám phá cơ hội nghề nghiệp phù hợp cùng nhà tuyển dụng uy tín, bộ lọc thông minh theo ngành và mức lương, và ứng tuyển ngay trong một giao diện chuyên nghiệp.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 0.8fr", gap: "16px" }}>
               <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(255,255,255,0.12)", borderRadius: "16px", padding: "16px 18px", border: "1px solid rgba(255,255,255,0.18)" }}>
                  <Search style={{ width: 20, height: 20, color: "#d1fae5" }} />
                  <input
                     placeholder="Tìm vị trí, công ty, kỹ năng..."
                     style={{
                        background: "transparent", border: "none", outline: "none",
                        color: "#fff", fontSize: "15px", width: "100%",
                     }}
                  />
               </div>
               <button style={{
                  background: "#ffffff", color: "#0f172a", borderRadius: "16px",
                  padding: "16px 24px", fontSize: "15px", fontWeight: 800,
                  border: "none", cursor: "pointer", whiteSpace: "nowrap",
                  boxShadow: "0 18px 40px rgba(15,23,42,0.16)",
               }}>
                  Tìm kiếm ngay
               </button>
            </div>
         </div>

         {/* Dynamic Banner */}
         {selectedJob && (
            <div style={{
               background: "#fff",
               borderRadius: "24px",
               padding: "24px",
               marginTop: "24px",
               position: "relative",
               overflow: "hidden",
               boxShadow: "0 24px 90px rgba(15,23,42,0.14)",
               border: "1px solid #e2e8f0",
            }}>
               <button onClick={() => setSelectedJob(null)} style={{
                  position: "absolute", top: "18px", right: "18px", width: "42px", height: "42px", borderRadius: 14,
                  border: "1px solid #e2e8f0", background: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#475569",
                  zIndex: 10, transition: "all 0.2s ease", boxShadow: "0 10px 24px rgba(15,23,42,0.12)"
               }}>
                  <X style={{ width: 18, height: 18 }} />
               </button>
               <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "24px", alignItems: "center" }}>
                  <div style={{ width: "104px", height: "104px", borderRadius: "24px", overflow: "hidden", background: "#f8fafc", boxShadow: "0 16px 36px rgba(15,23,42,0.08)" }}>
                     <img src={selectedJob.image} alt={selectedJob.company} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div>
                     <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "10px", marginBottom: "12px" }}>
                        <span style={{ fontSize: "12px", fontWeight: 700, color: "#0f172a", letterSpacing: "0.08em", background: "#ecfdf5", borderRadius: "999px", padding: "7px 14px" }}>
                           {selectedJob.company}
                        </span>
                        <span style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", background: "#f8fafc", borderRadius: "999px", padding: "7px 14px" }}>
                           {selectedJob.type}
                        </span>
                     </div>
                     <h2 style={{ fontSize: "28px", fontWeight: 900, color: "#0f172a", lineHeight: 1.1, marginBottom: "12px" }}>
                        {toVietnameseJobTitle(selectedJob.title)}
                     </h2>
                     <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#475569", fontSize: "13px" }}><MapPin style={{ width: 14, height: 14 }} /> {selectedJob.place}</span>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#475569", fontSize: "13px" }}><Wallet style={{ width: 14, height: 14 }} /> {selectedJob.salary}</span>
                     </div>
                     <p style={{ fontSize: "15px", color: "#475569", lineHeight: 1.75, marginBottom: "18px" }}>
                        {selectedJob.companyDescription}
                     </p>
                     <p style={{ fontSize: "15px", color: "#334155", lineHeight: 1.8 }}>
                        {selectedJob.description}
                     </p>
                  </div>
               </div>
            </div>
         )}

         {/* Career groups */}
         <section>
            <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a", marginBottom: "16px" }}>
               Danh sách nghề nghiệp
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
               {visibleCareerGroupsComputed.map((group) => (
                  <div
                     key={group.name}
                     style={{
                        background: "#fff",
                        borderRadius: "16px",
                        border: selectedGroup === group.name ? "1px solid #10b981" : "1px solid #e2e8f0",
                        boxShadow: selectedGroup === group.name ? "0 10px 30px rgba(16,185,129,0.15)" : "0 4px 18px rgba(0,0,0,0.04)",
                     }}
                  >
                     <button
                        type="button"
                        onClick={() => toggleGroup(group.name)}
                        style={{
                           width: "100%",
                           border: "none",
                           background: "#fff",
                           cursor: "pointer",
                           padding: "18px 20px",
                           display: "flex",
                           alignItems: "center",
                           justifyContent: "space-between",
                           gap: "12px",
                           fontSize: "16px",
                           fontWeight: 700,
                           color: "#0f172a",
                        }}
                     >
                        <span>{group.name}</span>
                        {selectedGroup === group.name ? (
                           <ChevronDown style={{ width: 18, height: 18, color: "#64748b" }} />
                        ) : (
                           <ChevronRight style={{ width: 18, height: 18, color: "#64748b" }} />
                        )}
                     </button>
                  </div>
               ))}
            </div>
         </section>

         <section style={{
            background: "linear-gradient(135deg, #f8fafc 0%, #ecfeff 100%)",
            borderRadius: "20px",
            padding: "24px",
            border: "1px solid #e2e8f0",
         }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", marginBottom: "14px" }}>
               <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#0f172a" }}>
                  Quảng cáo tuyển dụng nổi bật
               </h2>
               <span style={{ fontSize: "13px", color: "#64748b", fontWeight: 600 }}>Đối tác tuyển dụng của JobPilot</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
               {hiringPromotions.map((promo) => (
                  <article key={promo.title} style={{
                     borderRadius: "16px",
                     padding: "18px",
                     background: "#fff",
                     border: "1px solid #e2e8f0",
                     boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
                     position: "relative",
                     overflow: "hidden",
                  }}>
                     <div style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "4px",
                        background: promo.accent,
                     }} />
                     <p style={{ fontSize: "11px", fontWeight: 700, color: promo.accent, letterSpacing: "0.05em", marginBottom: "8px" }}>SPONSORED</p>
                     <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a", marginBottom: "6px", lineHeight: 1.3 }}>{promo.title}</h3>
                     <p style={{ fontSize: "13px", color: "#334155", fontWeight: 700, marginBottom: "8px" }}>{promo.subtitle}</p>
                     <p style={{ fontSize: "13px", color: "#475569", lineHeight: 1.5, marginBottom: "14px" }}>{promo.description}</p>
                     <button style={{
                        border: "none",
                        background: promo.accent,
                        color: "#fff",
                        borderRadius: "10px",
                        padding: "8px 14px",
                        fontSize: "13px",
                        fontWeight: 700,
                        cursor: "pointer",
                     }}>
                        {promo.cta}
                     </button>
                  </article>
               ))}
            </div>
         </section>

         <section>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", marginBottom: "14px" }}>
               <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#0f172a" }}>
                  Bài viết liên quan đến việc làm
               </h2>
               <a href="#" style={{ fontSize: "13px", color: "#0284c7", fontWeight: 700, textDecoration: "none" }}>Xem tất cả bài viết</a>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px" }}>
               {jobArticles.map((article) => (
                  <article key={article.title} style={{
                     background: "#fff",
                     borderRadius: "16px",
                     border: "1px solid #e2e8f0",
                     overflow: "hidden",
                     boxShadow: "0 10px 25px rgba(15,23,42,0.05)",
                  }}>
                     <img
                        src={article.image}
                        alt={article.title}
                        style={{ width: "100%", height: "150px", objectFit: "cover", background: "#e2e8f0" }}
                     />
                     <div style={{ padding: "14px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", marginBottom: "8px" }}>
                           <span style={{ fontSize: "11px", fontWeight: 700, color: "#0369a1", background: "#e0f2fe", padding: "3px 8px", borderRadius: "999px" }}>
                              {article.category}
                           </span>
                           <span style={{ fontSize: "11px", color: "#64748b", fontWeight: 600 }}>{article.readTime}</span>
                        </div>
                        <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a", lineHeight: 1.4, marginBottom: "8px" }}>{article.title}</h3>
                        <p style={{ fontSize: "13px", color: "#475569", lineHeight: 1.6 }}>{article.summary}</p>
                     </div>
                  </article>
               ))}
            </div>
         </section>

         {selectedGroup && (
            <>
               <div
                  onClick={() => setSelectedGroup(null)}
                  style={{
                     position: "fixed",
                     inset: 0,
                     background: "rgba(15,23,42,0.55)",
                     backdropFilter: "blur(4px)",
                     zIndex: 1050,
                  }}
               />
               <section
                  style={{
                     position: "fixed",
                     left: "50%",
                     top: "50%",
                     transform: "translate(-50%, -50%)",
                     width: "min(980px, calc(100vw - 28px))",
                     maxHeight: "82vh",
                     overflowY: "auto",
                     background: "#fff",
                     borderRadius: "20px",
                     border: "1px solid #e2e8f0",
                     boxShadow: "0 28px 90px rgba(15,23,42,0.35)",
                     zIndex: 1051,
                     padding: "22px",
                  }}
               >
                  <div style={{ position: "sticky", top: 0, zIndex: 20, background: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", marginBottom: "14px", paddingBottom: "14px", borderBottom: "1px solid #e2e8f0" }}>
                     <h3 style={{ fontSize: "22px", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                        Việc làm thuộc nhóm: <span style={{ color: "#059669" }}>{selectedGroup}</span>
                     </h3>
                     <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontSize: "13px", color: "#64748b", fontWeight: 600 }}>
                           {activeGroupJobs.length} công việc phù hợp
                        </span>
                        <button
                           type="button"
                           onClick={() => setSelectedGroup(null)}
                           style={{
                              width: 34,
                              height: 34,
                              borderRadius: 10,
                              border: "1px solid #e2e8f0",
                              background: "#fff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              color: "#64748b",
                           }}
                        >
                           <X style={{ width: 16, height: 16 }} />
                        </button>
                     </div>
                  </div>

                  {activeGroupJobs.length === 0 ? (
                     <div style={{ background: "#f8fafc", border: "1px dashed #cbd5e1", borderRadius: "14px", padding: "20px", color: "#475569", fontSize: "14px" }}>
                        Nhóm ngành này chưa có dữ liệu công việc chi tiết. Vui lòng chọn nhóm khác.
                     </div>
                  ) : (
                     <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                        {activeGroupJobs.map((job) => {
                           const tc = typeColors[job.type] ?? { bg: "#f1f5f9", text: "#475569" };
                           const fc = fieldColors[job.field] ?? fieldColors.default;
                           return (
                              <article key={`${job.title}-${job.company}`} style={{
                                 background: "#fff", borderRadius: "24px", padding: "24px 28px",
                                 border: "1px solid #e2e8f0",
                                 boxShadow: "0 18px 55px rgba(15,23,42,0.09)",
                                 transition: "transform 0.25s, box-shadow 0.25s",
                                 position: "relative", overflow: "hidden",
                                 cursor: "pointer",
                              }}
                                 onClick={() => setSelectedJob(job)}
                                 onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 22px 60px rgba(15,23,42,0.14)"; }}
                                 onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = "0 18px 55px rgba(15,23,42,0.09)"; }}
                              >
                                 <div style={{
                                    position: "absolute", left: 0, top: 0, bottom: 0, width: "4px",
                                    background: job.companyColor, borderRadius: "20px 0 0 20px",
                                 }} />

                                 <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: "22px", alignItems: "flex-start" }}>
                                    <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                                       <div style={{
                                          width: "60px", height: "60px", borderRadius: "18px", flexShrink: 0,
                                          background: `${job.companyColor}15`,
                                          border: `2px solid ${job.companyColor}30`,
                                          display: "flex", alignItems: "center", justifyContent: "center",
                                       }}>
                                          <img src={job.image} alt={job.company} style={{ width: "100%", height: "100%", borderRadius: "16px", objectFit: "cover" }} />
                                       </div>
                                    </div>
                                    <div>
                                       <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "10px" }}>
                                          {job.hot && (
                                             <span style={{
                                                display: "inline-flex", alignItems: "center", gap: "4px",
                                                background: "#fef3c7", color: "#b45309",
                                                borderRadius: "999px", padding: "4px 12px",
                                                fontSize: "11px", fontWeight: 800,
                                             }}>
                                                <Flame style={{ width: 10, height: 10 }} /> HOT
                                             </span>
                                          )}
                                          <span style={{
                                             background: "#ecfdf5", color: "#059669",
                                             borderRadius: "999px", padding: "4px 12px",
                                             fontSize: "11px", fontWeight: 700,
                                          }}>
                                             Mới đăng
                                          </span>
                                       </div>
                                       <h3 style={{ fontSize: "20px", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em", marginTop: 0, marginBottom: "10px" }}>
                                          {toVietnameseJobTitle(job.title)}
                                       </h3>
                                       <p style={{ fontSize: "13px", color: "#64748b", marginTop: 0, marginBottom: "12px" }}>{job.company} • {job.posted}</p>
                                       <p style={{ fontSize: "14px", color: "#475569", marginTop: 0, lineHeight: 1.75 }}>
                                          {buildJobLongDescription(job)}
                                       </p>
                                       <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "16px" }}>
                                          <Link to={buildCompanyDeepLink(job)} style={{
                                             color: job.companyColor,
                                             fontWeight: 800,
                                             textDecoration: "none",
                                             borderBottom: `2px solid ${job.companyColor}`,
                                             paddingBottom: "2px",
                                          }}>
                                             Xem công ty
                                          </Link>
                                       </div>
                                    </div>

                                    {/* Actions */}
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                                       <button onClick={(event) => { event.stopPropagation(); addSavedJob(job); }} style={{
                                          width: "38px", height: "38px", borderRadius: "10px",
                                          border: "1px solid #e2e8f0", background: "#fff",
                                          display: "flex", alignItems: "center", justifyContent: "center",
                                          cursor: "pointer", color: "#64748b",
                                       }}>
                                          <Bookmark style={{ width: 15, height: 15 }} />
                                       </button>
                                       <button onClick={(event) => { event.stopPropagation(); addApplication(job); }} style={{
                                          display: "inline-flex", alignItems: "center", gap: "6px",
                                          background: job.companyColor, color: "#fff",
                                          borderRadius: "10px", padding: "9px 20px",
                                          fontSize: "13px", fontWeight: 700, border: "none", cursor: "pointer",
                                          boxShadow: `0 4px 14px ${job.companyColor}40`,
                                       }}>
                                          Ứng tuyển
                                       </button>
                                    </div>
                                 </div>

                                 {/* Meta info */}
                                 <div style={{ display: "flex", gap: "16px", marginTop: "16px", flexWrap: "wrap", alignItems: "center" }}>
                                    <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "13px", color: "#475569" }}>
                                       <MapPin style={{ width: 13, height: 13 }} /> {job.place}
                                    </span>
                                    <span style={{
                                       display: "inline-flex", alignItems: "center", gap: "5px",
                                       background: tc.bg, color: tc.text,
                                       borderRadius: "999px", padding: "3px 10px",
                                       fontSize: "12px", fontWeight: 700,
                                    }}>
                                       <Clock3 style={{ width: 12, height: 12 }} /> {job.type}
                                    </span>
                                    <span style={{
                                       display: "inline-flex", alignItems: "center", gap: "5px",
                                       background: fc.bg, color: fc.text,
                                       borderRadius: "999px", padding: "3px 10px",
                                       fontSize: "12px", fontWeight: 700,
                                    }}>
                                       {job.field}
                                    </span>
                                    <span style={{
                                       display: "inline-flex", alignItems: "center", gap: "5px",
                                       fontSize: "14px", fontWeight: 800, color: "#0f172a",
                                    }}>
                                       <Wallet style={{ width: 14, height: 14, color: "#64748b" }} /> {job.salary}
                                    </span>
                                 </div>

                                 {/* Tags */}
                                 <div style={{ display: "flex", gap: "6px", marginTop: "12px", flexWrap: "wrap" }}>
                                    {job.tags.map((tag) => (
                                       <span key={tag} style={{
                                          background: "#f8fafc", border: "1px solid #e2e8f0",
                                          borderRadius: "8px", padding: "3px 10px",
                                          fontSize: "11px", fontWeight: 600, color: "#475569",
                                       }}>
                                          {tag}
                                       </span>
                                    ))}
                                 </div>
                              </article>
                           );
                        })}
                     </div>
                  )}
               </section>
            </>
         )}

         <button onClick={() => setShowTray(true)} style={{ position: "fixed", right: "24px", bottom: "24px", width: "60px", height: "60px", borderRadius: "999px", border: "none", background: "linear-gradient(135deg, #ec4899, #db2777)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 14px 30px rgba(236,72,153,0.35)", zIndex: 900 }} title="Ứng tuyển và công việc đã lưu"><Heart style={{ width: 24, height: 24, color: "#fff" }} /></button>

         {showTray && (
            <>
               <div onClick={() => setShowTray(false)} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", backdropFilter: "blur(4px)", zIndex: 1100 }} />
               <div style={{ position: "fixed", right: "24px", bottom: "94px", width: "min(420px, calc(100vw - 32px))", maxHeight: "72vh", overflowY: "auto", background: "#fff", borderRadius: "18px", boxShadow: "0 24px 70px rgba(15,23,42,0.3)", zIndex: 1101, padding: "18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                     <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a" }}>Mục đã lưu</h3>
                     <button onClick={() => setShowTray(false)} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748b" }}><X style={{ width: 16, height: 16 }} /></button>
                  </div>
                  <div style={{ display: "grid", gap: "14px" }}>
                     <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>Đã ứng tuyển ({applications.length})</div>
                        <div style={{ display: "grid", gap: 10 }}>{applications.length === 0 ? <div style={{ fontSize: 13, color: "#94a3b8" }}>Chưa có ứng tuyển nào.</div> : applications.map((item) => (
                           <div key={item.id} style={{ position: "relative" }}>
                              {renderApplicationCard(item)}
                              <button
                                 onClick={() => removeApplication(item.id)}
                                 style={{ position: "absolute", top: 10, right: 10, width: 32, height: 32, borderRadius: 10, border: "1px solid #fecaca", background: "#fff1f2", color: "#be123c", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                                 title="Xóa hồ sơ ứng tuyển"
                              >
                                 <Trash2 style={{ width: 14, height: 14 }} />
                              </button>
                           </div>
                        ))}</div>
                     </div>
                     <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>Công việc đã lưu ({savedJobs.length})</div>
                        <div style={{ display: "grid", gap: 10 }}>{savedJobs.length === 0 ? <div style={{ fontSize: 13, color: "#94a3b8" }}>Chưa có công việc nào được lưu.</div> : savedJobs.map((item) => (
                           <div key={item.id} style={{ position: "relative" }}>
                              {renderSavedJobCard(item)}
                              <button
                                 onClick={() => removeSavedJob(item.id)}
                                 style={{ position: "absolute", top: 10, right: 10, width: 32, height: 32, borderRadius: 10, border: "1px solid #fecaca", background: "#fff1f2", color: "#be123c", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                                 title="Xóa mục đã lưu"
                              >
                                 <Trash2 style={{ width: 14, height: 14 }} />
                              </button>
                           </div>
                        ))}</div>
                     </div>
                  </div>
               </div>
            </>
         )}

         {toast && (
            <div style={{ position: "fixed", left: "50%", top: 24, transform: "translateX(-50%)", zIndex: 1300, minWidth: "min(520px, calc(100vw - 24px))" }}>
               <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "14px 16px",
                  borderRadius: 14,
                  border: `1px solid ${toast.kind === "success" ? "#86efac" : "#fca5a5"}`,
                  background: toast.kind === "success" ? "linear-gradient(135deg, #f0fdf4, #ffffff)" : "linear-gradient(135deg, #fff1f2, #ffffff)",
                  boxShadow: "0 18px 50px rgba(15,23,42,0.16)",
               }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                     <div style={{ width: 10, height: 10, borderRadius: 999, background: toast.kind === "success" ? "#16a34a" : "#dc2626", flexShrink: 0 }} />
                     <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{toast.message}</p>
                  </div>
                  <button onClick={() => setToast(null)} style={{ border: "none", background: "transparent", color: "#64748b", cursor: "pointer", fontWeight: 700 }}>×</button>
               </div>
            </div>
         )}
      </div>
   );
}
