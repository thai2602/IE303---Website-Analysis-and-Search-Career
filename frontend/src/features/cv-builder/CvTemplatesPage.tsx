import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Eye, Sparkles, X } from "lucide-react";
import profilePicture1 from "../../assets/profile_picture/image_1.png";
import profilePicture2 from "../../assets/profile_picture/image_2.png";
import profilePicture3 from "../../assets/profile_picture/image_3.png";
import profilePicture4 from "../../assets/profile_picture/image_4.png";
import { readAuthUser } from "../../utils/auth";

const templates = [
   {
      name: "CV Chuẩn",
      level: "Phù hợp mọi vị trí",
      tag: "Phổ biến",
      tagColor: "#10b981",
      accent: "#10b981",
      preview: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
   },
   {
      name: "CV Chuyên nghiệp",
      level: "Dành cho IT & Tech",
      tag: "Công nghệ",
      tagColor: "#10b981",
      accent: "#10b981",
      preview: "linear-gradient(135deg, #ecfdf5 0%, #a7f3d0 100%)",
   },
   {
      name: "CV Marketing",
      level: "Dành cho Marketing",
      tag: "Sáng tạo",
      tagColor: "#10b981",
      accent: "#10b981",
      preview: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
   },
   {
      name: "CV Quản lý",
      level: "Dành cho Lãnh đạo",
      tag: "Cao cấp",
      tagColor: "#10b981",
      accent: "#10b981",
      preview: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
   },
];

type CvEntry = {
   period: string;
   title: string;
   subtitle?: string;
   details?: string[];
};

type SampleCv = {
   fullName: string;
   title: string;
   avatar: string;
   summary: string;
   personalInfo: Array<{ label: string; value: string }>;
   objective: string;
   education: CvEntry[];
   experience: CvEntry[];
   activities: CvEntry[];
   certificates: string[];
   awards: string[];
   skills: string[];
   references: string[];
   hobbies: string[];
};

type SavedCvItem = {
   id: string;
   name: string;
   role: string;
   createdAt: string;
   cv: SampleCv;
};

const MY_CVS_STORAGE_KEY = "jobpilot.my-cvs";

type CvFormState = {
   avatarDataUrl: string;
   fullName: string;
   title: string;
   dob: string;
   email: string;
   phone: string;
   address: string;
   summary: string;
   objective: string;
   education: string;
   experience: string;
   activities: string;
   certificates: string;
   awards: string;
   skills: string;
   references: string;
   hobbies: string;
};

const createEmptyCvForm = (): CvFormState => ({
   avatarDataUrl: "",
   fullName: "",
   title: "",
   dob: "",
   email: "",
   phone: "",
   address: "",
   summary: "",
   objective: "",
   education: "",
   experience: "",
   activities: "",
   certificates: "",
   awards: "",
   skills: "",
   references: "",
   hobbies: "",
});

const inputStyle = {
   width: "100%",
   border: "1px solid #cbd5e1",
   borderRadius: "10px",
   padding: "10px 12px",
   fontSize: "13px",
   color: "#0f172a",
   outline: "none",
   background: "#fff",
};

const textAreaStyle = {
   width: "100%",
   border: "1px solid #cbd5e1",
   borderRadius: "12px",
   padding: "10px 12px",
   fontSize: "13px",
   color: "#0f172a",
   outline: "none",
   background: "#fff",
   resize: "vertical" as const,
};

const primaryButtonStyle = {
   background: "#2563eb",
   color: "#fff",
   borderRadius: "10px",
   padding: "10px 18px",
   fontSize: "13px",
   fontWeight: 700,
   border: "none",
   cursor: "pointer",
   boxShadow: "0 4px 15px rgba(37,99,235,0.25)",
};

const secondaryButtonStyle = {
   background: "#fff",
   color: "#334155",
   borderRadius: "10px",
   padding: "10px 18px",
   fontSize: "13px",
   fontWeight: 700,
   border: "1px solid #cbd5e1",
   cursor: "pointer",
};

const splitLines = (value: string) =>
   value
      .split(/\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);

const parseCvEntries = (value: string): CvEntry[] =>
   splitLines(value).map((line) => {
      const [period = "", title = "", subtitle = "", ...detailParts] = line.split("|").map((item) => item.trim());
      const details = detailParts.join("|").trim();

      return {
         period: period || "N/A",
         title: title || line,
         subtitle: subtitle || undefined,
         details: details ? details.split(/;|•/).map((item) => item.trim()).filter(Boolean) : undefined,
      };
   });

const buildPreviewCv = (form: CvFormState): SampleCv => ({
   fullName: form.fullName || "Ho va ten cua ban",
   title: form.title || "Vi tri ung tuyen",
   avatar: form.avatarDataUrl || profilePicture1,
   summary: form.summary || "Mo ta ngan ve ban than va kinh nghiem noi bat.",
   personalInfo: [
      { label: "Ngày sinh", value: form.dob || "Chưa cập nhật" },
      { label: "Email", value: form.email || "Chưa cập nhật" },
      { label: "Số điện thoại", value: form.phone || "Chưa cập nhật" },
      { label: "Địa chỉ", value: form.address || "Chưa cập nhật" },
   ],
   objective: form.objective || "Mục tiêu nghề nghiệp sẽ hiển thị ở đây.",
   education: parseCvEntries(form.education),
   experience: parseCvEntries(form.experience),
   activities: parseCvEntries(form.activities),
   certificates: splitLines(form.certificates),
   awards: splitLines(form.awards),
   skills: splitLines(form.skills),
   references: splitLines(form.references),
   hobbies: splitLines(form.hobbies),
});

const cvWritingTips = [
   {
      title: "Tiêu đề CV",
      good: "Ghi ngắn gọn, rõ vị trí ứng tuyển và tên ứng viên; nếu viết tiếng Việt thì dùng dấu đầy đủ.",
      bad: "Viết quá dài, thiếu thông tin hoặc không thể hiện đúng vị trí đang ứng tuyển.",
   },
   {
      title: "Mục tiêu nghề nghiệp",
      good: "Trình bày ngắn gọn, chia thành mục tiêu ngắn hạn và dài hạn, gắn với lợi ích cho cả bạn và doanh nghiệp.",
      bad: "Viết lan man, quá xa vời hoặc không liên quan tới công việc muốn ứng tuyển.",
   },
   {
      title: "Học vấn",
      good: "Liệt kê theo thứ tự thời gian, kèm trường, ngành, thời gian học và chứng chỉ/thành tích nổi bật.",
      bad: "Chỉ ghi tên trường hoặc liệt kê lan man từ tiểu học đến đại học.",
   },
   {
      title: "Kinh nghiệm làm việc",
      good: "Nêu rõ công ty, vị trí, nhiệm vụ chính, kỹ năng đã dùng và thành tựu nổi bật theo mốc thời gian gần tới xa.",
      bad: "Mô tả dài dòng, đưa thông tin sai sự thật hoặc liệt kê công việc không liên quan.",
   },
   {
      title: "Trình bày CV",
      good: "Giữ CV gọn trong 1-2 trang, đúng chính tả, trung thực và ưu tiên xuất file PDF khi gửi online.",
      bad: "Nhồi quá nhiều chữ, sai ngữ pháp, format lộn xộn hoặc để CV quá dài không cần thiết.",
   },
];

const provinceOptions = [
   "An Giang",
   "Bac Ninh",
   "Ca Mau",
   "Can Tho",
   "Cao Bang",
   "Da Nang",
   "Dak Lak",
   "Dien Bien",
   "Dong Nai",
   "Dong Thap",
   "Gia Lai",
   "Ha Noi",
   "Ha Tinh",
   "Hai Phong",
   "Hung Yen",
   "Khanh Hoa",
   "Lai Chau",
   "Lam Dong",
   "Lang Son",
   "Lao Cai",
   "Nghe An",
   "Ninh Binh",
   "Phu Tho",
   "Quang Ngai",
   "Quang Ninh",
   "Quang Tri",
   "Soc Trang",
   "Son La",
   "Tay Ninh",
   "Thai Nguyen",
   "Thanh Hoa",
   "TP Ho Chi Minh",
   "Tuyen Quang",
   "Vinh Long",
];

const sampleCvByTemplate: Record<string, SampleCv> = {
   "CV Chuẩn": {
      fullName: "Nguyen Minh Anh",
      title: "Junior Frontend Developer",
      avatar: profilePicture1,
      summary: "Sinh viên mới tốt nghiệp, có kinh nghiệm xây dựng ứng dụng React + TypeScript và khả năng học nhanh.",
      personalInfo: [
         { label: "Ngày sinh", value: "12/08/2002" },
         { label: "Email", value: "anh.nguyen@email.com" },
         { label: "Số điện thoại", value: "0901 234 567" },
         { label: "Địa chỉ", value: "TP.HCM" },
      ],
      objective: "Trở thành Frontend Developer chuyên sâu về sản phẩm web hiện đại, đóng góp vào các dự án có tác động thực tế và liên tục cải thiện trải nghiệm người dùng.",
      education: [
         {
            period: "2020 - 2024",
            title: "Đại học Khoa học Tự nhiên",
            subtitle: "Cử nhân Công nghệ Thông tin",
            details: ["GPA: 3.42/4.0", "Tốt nghiệp loại Khá"],
         },
      ],
      experience: [
         {
            period: "06/2025 - 12/2025",
            title: "Frontend Intern",
            subtitle: "ABC Software",
            details: ["Phát triển 6 màn hình dashboard với React và TailwindCSS.", "Tối ưu hiệu năng trang, giảm 35% thời gian tải ban đầu."],
         },
      ],
      activities: [
         {
            period: "06/2025 - 12/2025",
            title: "Thành viên CLB Lập trình",
            subtitle: "Trường Đại học Khoa học Tự nhiên",
            details: ["Tham gia tổ chức workshop React cho sinh viên năm 2.", "Hỗ trợ nhóm truyền thông triển khai landing page cho sự kiện."],
         },
      ],
      certificates: ["Google UX Design Certificate", "Front-End Web Development with React"],
      awards: ["Học bổng Khuyến khích học tập năm 2023", "Giải Ba cuộc thi Web Design Sprint 2024"],
      skills: ["React", "TypeScript", "TailwindCSS", "Git", "REST API", "HTML/CSS", "Figma"],
      references: ["Nguyễn Văn Huy - Mentor thực tập - 0909 111 222", "Trần Minh Khoa - Giảng viên hướng dẫn - khoa@example.edu.vn"],
      hobbies: ["Đọc sách công nghệ", "Chạy bộ", "Chụp ảnh", "Tham gia hackathon"],
   },
   "CV Chuyên nghiệp": {
      fullName: "Tran Hoang Nam",
      title: "Frontend Developer",
      avatar: profilePicture2,
      summary: "3 năm kinh nghiệm phát triển sản phẩm web quy mô lớn, tập trung vào trải nghiệm người dùng và hiệu năng.",
      personalInfo: [
         { label: "Ngày sinh", value: "19/03/1999" },
         { label: "Email", value: "nam.tran@email.com" },
         { label: "Số điện thoại", value: "0908 111 222" },
         { label: "Địa chỉ", value: "Đà Nẵng" },
      ],
      objective: "Phát triển lên vị trí Senior Frontend Developer, dẫn dắt các sáng kiến kỹ thuật và xây dựng trải nghiệm số có khả năng mở rộng cao.",
      education: [
         {
            period: "2017 - 2021",
            title: "Đại học Bách khoa Đà Nẵng",
            subtitle: "Công nghệ Phần mềm",
            details: ["GPA: 3.55/4.0", "Khóa luận về hệ thống quản lý học tập"],
         },
      ],
      experience: [
         {
            period: "01/2023 - Nay",
            title: "Frontend Developer",
            subtitle: "JobTech Vietnam",
            details: ["Xây dựng hệ thống quản lý ứng viên phục vụ 100k+ người dùng mỗi tháng.", "Phối hợp với UX team để tăng tỉ lệ chuyển đổi đăng ký 18%."],
         },
      ],
      activities: [
         {
            period: "2022 - 2024",
            title: "Diễn giả nội bộ",
            subtitle: "JobTech Vietnam",
            details: ["Chia sẻ kinh nghiệm tối ưu component reusable và quy chuẩn code review.", "Hỗ trợ onboarding cho 8 thành viên mới."],
         },
      ],
      certificates: ["AWS Cloud Practitioner", "Professional Scrum Master I"],
      awards: ["Employee of the Quarter Q3/2024"],
      skills: ["React", "Next.js", "TypeScript", "Redux Toolkit", "Testing Library", "Performance Tuning"],
      references: ["Lê Minh Quân - Engineering Manager - 0912 333 444"],
      hobbies: ["Bóng đá", "Nấu ăn", "Đọc tài liệu kỹ thuật"],
   },
   "CV Quản lý": {
      fullName: "Le Thu Ha",
      title: "Product Manager",
      avatar: profilePicture3,
      summary: "Hơn 7 năm dẫn dắt đội nhóm cross-functional, triển khai sản phẩm SaaS từ ý tưởng đến vận hành.",
      personalInfo: [
         { label: "Ngày sinh", value: "25/11/1992" },
         { label: "Email", value: "ha.le@email.com" },
         { label: "Số điện thoại", value: "0933 999 888" },
         { label: "Địa chỉ", value: "Hà Nội" },
      ],
      objective: "Tiếp tục phát triển ở vai trò Product Lead/Head of Product, xây dựng chiến lược sản phẩm dựa trên dữ liệu và tăng trưởng bền vững.",
      education: [
         {
            period: "2010 - 2014",
            title: "Đại học Kinh tế Quốc dân",
            subtitle: "Quản trị Kinh doanh",
            details: ["GPA: 3.67/4.0", "Thành viên đội sinh viên nghiên cứu khoa học"],
         },
      ],
      experience: [
         {
            period: "03/2021 - Nay",
            title: "Senior Product Manager",
            subtitle: "Talent Hub",
            details: ["Quản lý roadmap 4 quý cho nền tảng tuyển dụng B2B.", "Đạt mức tăng trưởng MRR 40% năm 2025 qua tối ưu quy trình onboarding."],
         },
      ],
      activities: [
         {
            period: "2023 - Nay",
            title: "Mentor Product",
            subtitle: "Cộng đồng Product Vietnam",
            details: ["Mentor cho 15+ học viên chuyển ngành sang Product.", "Tổ chức 4 buổi workshop về discovery và prioritization."],
         },
      ],
      certificates: ["Certified Scrum Product Owner", "Google Data Analytics"],
      awards: ["Top 10 Women in Tech 2024"],
      skills: ["Leadership", "Product Strategy", "Data Analysis", "Roadmap", "Stakeholder Mgmt", "A/B Testing"],
      references: ["Phạm Quốc Dũng - CEO - 0903 777 888"],
      hobbies: ["Yoga", "Du lịch", "Viết blog sản phẩm"],
   },
   "CV Marketing": {
      fullName: "Pham Quynh Nhu",
      title: "UI/UX Designer",
      avatar: profilePicture4,
      summary: "Designer hướng đến trải nghiệm, có kinh nghiệm thiết kế ứng dụng web/mobile và xây dựng design system.",
      personalInfo: [
         { label: "Ngày sinh", value: "09/06/1998" },
         { label: "Email", value: "nhu.pham@email.com" },
         { label: "Số điện thoại", value: "0977 555 444" },
         { label: "Địa chỉ", value: "TP.HCM" },
      ],
      objective: "Phát triển thành Senior Product Designer, tạo ra trải nghiệm trực quan, nhất quán và có khả năng chuyển đổi cao trên đa nền tảng.",
      education: [
         {
            period: "2016 - 2020",
            title: "Đại học Kiến trúc TP.HCM",
            subtitle: "Thiết kế Đồ họa",
            details: ["GPA: 3.61/4.0", "Đồ án tốt nghiệp đạt điểm A"],
         },
      ],
      experience: [
         {
            period: "09/2022 - Nay",
            title: "UI/UX Designer",
            subtitle: "Creative Studio",
            details: ["Thiết kế lại trang careers giúp giảm 27% tỉ lệ thoát trang.", "Xây dựng bộ component dùng chung cho 3 sản phẩm nội bộ."],
         },
      ],
      activities: [
         {
            period: "2021 - 2022",
            title: "Thành viên ban thiết kế",
            subtitle: "UX Vietnam Meetup",
            details: ["Hỗ trợ thiết kế key visual cho sự kiện cộng đồng.", "Chia sẻ case study về design system."],
         },
      ],
      certificates: ["Google UX Design Certificate", "Figma UI/UX Essentials"],
      awards: ["Giải Nhất cuộc thi UI Challenge 2023"],
      skills: ["Figma", "Design System", "Prototyping", "User Research", "Interaction Design", "Illustrator"],
      references: ["Nguyễn Hải Nam - Design Lead - 0911 444 555"],
      hobbies: ["Vẽ tay", "Chụp ảnh", "Sưu tầm sách thiết kế"],
   },
};

export default function CvTemplatesPage() {
   const navigate = useNavigate();
   const [previewTitle, setPreviewTitle] = useState<string | null>(null);
   const [previewCv, setPreviewCv] = useState<SampleCv | null>(null);
   const [isCreateOpen, setIsCreateOpen] = useState(false);
   const [cvForm, setCvForm] = useState<CvFormState>(() => createEmptyCvForm());

   const openTemplatePreview = (templateName: string) => {
      setPreviewTitle(templateName);
      setPreviewCv(sampleCvByTemplate[templateName]);
   };

   const handleFormChange = (field: keyof CvFormState, value: string) => {
      setCvForm((current) => ({ ...current, [field]: value }));
   };

   const handleCvAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file || !file.type.startsWith("image/")) {
         return;
      }

      const reader = new FileReader();
      reader.onload = () => {
         handleFormChange("avatarDataUrl", String(reader.result));
      };
      reader.readAsDataURL(file);
   };

   const handleCreateSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!readAuthUser()) {
         navigate("/dang-nhap");
         return;
      }

      const builtCv = buildPreviewCv(cvForm);
      const createdItem: SavedCvItem = {
         id: `${Date.now()}`,
         name: builtCv.fullName,
         role: builtCv.title,
         createdAt: new Date().toLocaleString("vi-VN"),
         cv: builtCv,
      };

      const raw = localStorage.getItem(MY_CVS_STORAGE_KEY);
      let storedItems: SavedCvItem[] = [];

      if (raw) {
         try {
            const parsed = JSON.parse(raw) as SavedCvItem[];
            if (Array.isArray(parsed)) {
               storedItems = parsed;
            }
         } catch {
            storedItems = [];
         }
      }

      localStorage.setItem(MY_CVS_STORAGE_KEY, JSON.stringify([createdItem, ...storedItems]));
      setPreviewTitle("CV của bạn");
      setPreviewCv(builtCv);
      setIsCreateOpen(false);
      setCvForm(createEmptyCvForm());
   };

   const openCreateCvModal = () => {
      if (!readAuthUser()) {
         navigate("/dang-nhap");
         return;
      }

      setIsCreateOpen(true);
   };

   const renderEntry = (entry: CvEntry) => (
      <div
         key={`${entry.title}-${entry.period}`}
         style={{
            border: "1px solid #e2e8f0",
            borderRadius: "14px",
            padding: "14px 16px",
            background: "#fff",
         }}
      >
         <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
            <div>
               <p style={{ fontSize: "14px", fontWeight: 800, color: "#0f172a" }}>{entry.title}</p>
               {entry.subtitle && <p style={{ fontSize: "13px", color: "#475569", marginTop: "2px" }}>{entry.subtitle}</p>}
            </div>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#0f172a", background: "#f8fafc", borderRadius: "999px", padding: "4px 10px" }}>
               {entry.period}
            </span>
         </div>
         {entry.details?.length ? (
            <ul style={{ margin: "10px 0 0", paddingLeft: "18px", color: "#334155", fontSize: "13px", lineHeight: 1.6 }}>
               {entry.details.map((detail) => (
                  <li key={detail}>{detail}</li>
               ))}
            </ul>
         ) : null}
      </div>
   );

   return (
      <div className="space-y-8">
         <div
            style={{
               borderRadius: "20px",
               background: "linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)",
               padding: "48px",
               position: "relative",
               overflow: "hidden",
            }}
         >
            <div
               style={{
                  position: "absolute",
                  top: "-50px",
                  right: "-30px",
                  width: "220px",
                  height: "220px",
                  borderRadius: "50%",
                  background: "rgba(167,243,208,0.2)",
                  filter: "blur(40px)",
               }}
            />
            <div
               style={{
                  position: "absolute",
                  bottom: "-40px",
                  left: "30%",
                  width: "180px",
                  height: "180px",
                  borderRadius: "50%",
                  background: "rgba(110,231,183,0.15)",
                  filter: "blur(35px)",
               }}
            />
            <h1 style={{ fontSize: "36px", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: "10px" }}>
               Kho <span style={{ color: "#ffffff" }}>CV mẫu</span>
            </h1>
            <p style={{ color: "#ffffff", fontSize: "15px", lineHeight: 1.7 }}>
               Lựa chọn bộ mẫu CV theo ngành và cấp độ, có sẵn gợi ý nội dung để sửa nhanh.
            </p>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {templates.map((t) => (
               <article
                  key={t.name}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
               >
                  <div
                     className="h-32 bg-gradient-to-br p-6 relative overflow-hidden"
                     style={{ background: t.preview }}
                  >
                     <div className="absolute inset-0 bg-gray-900/5" />
                     <div className="relative flex flex-col justify-between h-full">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300" />
                        <p className="text-xs font-medium text-gray-600">CV mẫu</p>
                     </div>
                  </div>

                  <div className="p-5">
                     <div className="flex items-start justify-between gap-2 mb-3">
                        <h3 className="font-bold text-gray-900 text-sm">{t.name}</h3>
                        <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                           {t.tag}
                        </span>
                     </div>
                     <p className="text-xs text-gray-600 mb-4">{t.level}</p>
                     <div className="flex gap-2">
                        <button
                           className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2 rounded-lg transition-colors"
                           onClick={() => openTemplatePreview(t.name)}
                        >
                           <Eye className="w-4 h-4" /> Xem mẫu
                        </button>
                        <button className="px-3 py-2 border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors">
                           <Download className="w-4 h-4 text-gray-600" />
                        </button>
                     </div>
                  </div>
               </article>
            ))}
         </div>

         <div className="rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
               <h3 className="text-lg font-bold text-slate-900 mb-1">Tạo CV chuyên nghiệp</h3>
               <p className="text-sm text-slate-900">Xây dựng CV chuẩn ATS với hướng dẫn từng bước</p>
            </div>
            <button
               className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
               onClick={openCreateCvModal}
            >
               Tạo ngay
            </button>
         </div>

         <section
            style={{
               borderRadius: "18px",
               border: "1px solid #e2e8f0",
               background: "#fff",
               padding: "24px",
               boxShadow: "0 10px 30px rgba(15,23,42,0.05)",
            }}
         >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: "12px", flexWrap: "wrap", marginBottom: "18px" }}>
               <div>
                  <p style={{ fontSize: "12px", fontWeight: 800, color: "#7c3aed", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>
                     Hướng dẫn viết CV
                  </p>
                  <h3 style={{ fontSize: "22px", fontWeight: 800, color: "#0f172a" }}>Những lưu ý quan trọng khi viết CV xin việc</h3>
               </div>
               <p style={{ fontSize: "13px", color: "#64748b", maxWidth: "560px", lineHeight: 1.7 }}>
                  CV nên ngắn gọn, rõ ràng, trung thực và tập trung vào thông tin giúp nhà tuyển dụng đánh giá nhanh mức độ phù hợp của bạn.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {cvWritingTips.map((tip) => (
                  <article key={tip.title} style={{ border: "1px solid #e2e8f0", borderRadius: "16px", padding: "16px", background: "#f8fafc" }}>
                     <h4 style={{ fontSize: "15px", fontWeight: 800, color: "#0f172a", marginBottom: "10px" }}>{tip.title}</h4>
                     <div style={{ display: "grid", gap: "10px" }}>
                        <div style={{ borderRadius: "12px", background: "#ecfdf5", border: "1px solid #bbf7d0", padding: "12px" }}>
                           <p style={{ fontSize: "11px", fontWeight: 800, color: "#059669", marginBottom: "4px" }}>Nên</p>
                           <p style={{ fontSize: "13px", color: "#065f46", lineHeight: 1.7 }}>{tip.good}</p>
                        </div>
                        <div style={{ borderRadius: "12px", background: "#fef2f2", border: "1px solid #fecaca", padding: "12px" }}>
                           <p style={{ fontSize: "11px", fontWeight: 800, color: "#dc2626", marginBottom: "4px" }}>Không nên</p>
                           <p style={{ fontSize: "13px", color: "#991b1b", lineHeight: 1.7 }}>{tip.bad}</p>
                        </div>
                     </div>
                  </article>
               ))}
            </div>
         </section>

         {isCreateOpen && (
            <div
               style={{
                  position: "fixed",
                  inset: 0,
                  background: "rgba(15, 23, 42, 0.55)",
                  zIndex: 50,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  padding: "40px 16px",
                  overflowY: "auto",
               }}
               onClick={() => setIsCreateOpen(false)}
            >
               <section
                  style={{
                     width: "min(1120px, 100%)",
                     background: "#ffffff",
                     borderRadius: "20px",
                     border: "1px solid #e2e8f0",
                     boxShadow: "0 20px 60px rgba(15, 23, 42, 0.25)",
                     overflow: "hidden",
                  }}
                  onClick={(e) => e.stopPropagation()}
               >
                  <div
                     style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "18px 20px",
                        borderBottom: "1px solid #e2e8f0",
                        background: "#f8fafc",
                     }}
                  >
                     <div>
                        <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a" }}>Tạo CV mới</h3>
                        <p style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>Nhập thông tin để xem trước CV theo dữ liệu của bạn.</p>
                     </div>
                     <button
                        onClick={() => setIsCreateOpen(false)}
                        style={{
                           border: "1px solid #cbd5e1",
                           background: "#fff",
                           color: "#334155",
                           width: "34px",
                           height: "34px",
                           borderRadius: "10px",
                           cursor: "pointer",
                           display: "inline-flex",
                           justifyContent: "center",
                           alignItems: "center",
                        }}
                     >
                        <X style={{ width: 16, height: 16 }} />
                     </button>
                  </div>

                  <form onSubmit={handleCreateSubmit} style={{ padding: "24px" }}>
                     <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: "18px" }}>
                        <div style={{ display: "grid", gap: "14px" }}>
                           <div style={{ display: "grid", gap: "12px", gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
                              <label style={{ display: "grid", gap: "6px" }}>
                                 <span style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Họ và tên</span>
                                 <input value={cvForm.fullName} onChange={(e) => handleFormChange("fullName", e.target.value)} placeholder="Ví dụ: Nguyễn Minh Anh" style={inputStyle} />
                              </label>
                              <label style={{ display: "grid", gap: "6px" }}>
                                 <span style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Vị trí mong muốn</span>
                                 <input value={cvForm.title} onChange={(e) => handleFormChange("title", e.target.value)} placeholder="Ví dụ: Frontend Developer" style={inputStyle} />
                              </label>
                           </div>

                           <div style={{ display: "grid", gap: "12px", gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
                              <label style={{ display: "grid", gap: "6px" }}>
                                 <span style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Ngày sinh</span>
                                 <input type="date" value={cvForm.dob} onChange={(e) => handleFormChange("dob", e.target.value)} style={inputStyle} />
                              </label>
                              <label style={{ display: "grid", gap: "6px" }}>
                                 <span style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Địa chỉ</span>
                                 <select value={cvForm.address} onChange={(e) => handleFormChange("address", e.target.value)} style={inputStyle}>
                                    <option value="">Chọn 1 trong 34 tỉnh/thành</option>
                                    {provinceOptions.map((province) => (
                                       <option key={province} value={province}>
                                          {province}
                                       </option>
                                    ))}
                                 </select>
                              </label>
                           </div>

                           <div style={{ display: "grid", gap: "12px", gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
                              <label style={{ display: "grid", gap: "6px" }}>
                                 <span style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Email</span>
                                 <input value={cvForm.email} onChange={(e) => handleFormChange("email", e.target.value)} placeholder="you@email.com" style={inputStyle} />
                              </label>
                              <label style={{ display: "grid", gap: "6px" }}>
                                 <span style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Số điện thoại</span>
                                 <input value={cvForm.phone} onChange={(e) => handleFormChange("phone", e.target.value)} placeholder="090x xxx xxx" style={inputStyle} />
                              </label>
                           </div>

                           <label style={{ display: "grid", gap: "6px" }}>
                              <span style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Tóm tắt bản thân</span>
                              <textarea value={cvForm.summary} onChange={(e) => handleFormChange("summary", e.target.value)} placeholder="Viết 2-3 câu giới thiệu ngắn về bạn" rows={3} style={textAreaStyle} />
                           </label>

                           <label style={{ display: "grid", gap: "6px" }}>
                              <span style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Mục tiêu nghề nghiệp</span>
                              <textarea value={cvForm.objective} onChange={(e) => handleFormChange("objective", e.target.value)} placeholder="Mục tiêu nghề nghiệp của bạn" rows={3} style={textAreaStyle} />
                           </label>

                           <label style={{ display: "grid", gap: "6px" }}>
                              <span style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Học vấn</span>
                              <textarea value={cvForm.education} onChange={(e) => handleFormChange("education", e.target.value)} placeholder="Mỗi dòng: 2020 - 2024 | Trường đại học | Ngành học | GPA 3.5" rows={4} style={textAreaStyle} />
                           </label>

                           <label style={{ display: "grid", gap: "6px" }}>
                              <span style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Kinh nghiệm làm việc</span>
                              <textarea value={cvForm.experience} onChange={(e) => handleFormChange("experience", e.target.value)} placeholder="Mỗi dòng: 01/2023 - Nay | Vị trí | Công ty | Thành tựu 1; Thành tựu 2" rows={4} style={textAreaStyle} />
                           </label>

                           <label style={{ display: "grid", gap: "6px" }}>
                              <span style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Hoạt động</span>
                              <textarea value={cvForm.activities} onChange={(e) => handleFormChange("activities", e.target.value)} placeholder="Mỗi dòng một hoạt động" rows={3} style={textAreaStyle} />
                           </label>
                        </div>

                        <div style={{ display: "grid", gap: "14px" }}>
                           <div
                              style={{
                                 border: "1px dashed #cbd5e1",
                                 borderRadius: "12px",
                                 padding: "12px",
                                 background: "#f8fafc",
                              }}
                           >
                              <p style={{ fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "8px" }}>Ảnh đại diện CV</p>
                              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                 <img
                                    src={cvForm.avatarDataUrl || profilePicture1}
                                    alt="Avatar CV"
                                    style={{
                                       width: "56px",
                                       height: "56px",
                                       borderRadius: "12px",
                                       objectFit: "cover",
                                       border: "1px solid #cbd5e1",
                                       background: "#fff",
                                    }}
                                 />
                                 <label
                                    style={{
                                       display: "inline-flex",
                                       alignItems: "center",
                                       justifyContent: "center",
                                       border: "1px solid #cbd5e1",
                                       borderRadius: "10px",
                                       padding: "8px 12px",
                                       fontSize: "12px",
                                       fontWeight: 700,
                                       color: "#334155",
                                       background: "#fff",
                                       cursor: "pointer",
                                    }}
                                 >
                                    Chọn ảnh đại diện
                                    <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleCvAvatarChange} />
                                 </label>
                              </div>
                           </div>

                           <label style={{ display: "grid", gap: "6px" }}>
                              <span style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Kỹ năng</span>
                              <textarea value={cvForm.skills} onChange={(e) => handleFormChange("skills", e.target.value)} placeholder="React, TypeScript, SQL..." rows={3} style={textAreaStyle} />
                           </label>

                           <label style={{ display: "grid", gap: "6px" }}>
                              <span style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Chứng chỉ</span>
                              <textarea value={cvForm.certificates} onChange={(e) => handleFormChange("certificates", e.target.value)} placeholder="Google UX Design Certificate, AWS..." rows={3} style={textAreaStyle} />
                           </label>

                           <label style={{ display: "grid", gap: "6px" }}>
                              <span style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Giải thưởng</span>
                              <textarea value={cvForm.awards} onChange={(e) => handleFormChange("awards", e.target.value)} placeholder="Giải Nhất..." rows={3} style={textAreaStyle} />
                           </label>

                           <label style={{ display: "grid", gap: "6px" }}>
                              <span style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Người giới thiệu</span>
                              <textarea value={cvForm.references} onChange={(e) => handleFormChange("references", e.target.value)} placeholder="Tên - chức danh - số điện thoại" rows={4} style={textAreaStyle} />
                           </label>

                           <label style={{ display: "grid", gap: "6px" }}>
                              <span style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Sở thích</span>
                              <textarea value={cvForm.hobbies} onChange={(e) => handleFormChange("hobbies", e.target.value)} placeholder="Đọc sách, chạy bộ, chụp ảnh..." rows={3} style={textAreaStyle} />
                           </label>

                           <div style={{ borderRadius: "16px", border: "1px dashed #c4b5fd", background: "#faf5ff", padding: "16px" }}>
                              <p style={{ fontSize: "12px", fontWeight: 800, color: "#6d28d9", marginBottom: "6px" }}>Cách nhập nhanh</p>
                              <p style={{ fontSize: "12px", color: "#7c3aed", lineHeight: 1.7 }}>
                                 Với học vấn và kinh nghiệm, nhập theo dạng: thời gian | tiêu đề | mô tả phụ | thành tựu 1; thành tựu 2.
                              </p>
                           </div>

                           <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", flexWrap: "wrap" }}>
                              <button type="button" onClick={() => setIsCreateOpen(false)} style={secondaryButtonStyle}>
                                 Hủy
                              </button>
                              <button type="submit" style={primaryButtonStyle}>
                                 Tiến hành tạo CV
                              </button>
                           </div>
                        </div>
                     </div>
                  </form>
               </section>
            </div>
         )}

         {previewCv && (
            <div
               style={{
                  position: "fixed",
                  inset: 0,
                  background: "rgba(15, 23, 42, 0.55)",
                  zIndex: 50,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  padding: "40px 16px",
                  overflowY: "auto",
               }}
               onClick={() => setPreviewCv(null)}
            >
               <section
                  style={{
                     width: "min(900px, 100%)",
                     background: "#ffffff",
                     borderRadius: "20px",
                     border: "1px solid #e2e8f0",
                     boxShadow: "0 20px 60px rgba(15, 23, 42, 0.25)",
                     overflow: "hidden",
                  }}
                  onClick={(e) => e.stopPropagation()}
               >
                  <div
                     style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "18px 20px",
                        borderBottom: "1px solid #e2e8f0",
                        background: "#f8fafc",
                     }}
                  >
                     <div>
                        <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a" }}>{previewTitle || "Xem trước CV"}</h3>
                        <p style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>Bạn có thể dùng bố cục này để tạo CV ngay.</p>
                     </div>
                     <button
                        onClick={() => setPreviewCv(null)}
                        style={{
                           border: "1px solid #cbd5e1",
                           background: "#fff",
                           color: "#334155",
                           width: "34px",
                           height: "34px",
                           borderRadius: "10px",
                           cursor: "pointer",
                           display: "inline-flex",
                           justifyContent: "center",
                           alignItems: "center",
                        }}
                     >
                        <X style={{ width: 16, height: 16 }} />
                     </button>
                  </div>

                  <div style={{ padding: "24px" }}>
                     <div
                        style={{
                           border: "1px solid #e2e8f0",
                           borderRadius: "14px",
                           padding: "20px",
                           background: "#ffffff",
                        }}
                     >
                        <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "18px", alignItems: "start" }}>
                           <img
                              src={previewCv.avatar}
                              alt={previewCv.fullName}
                              style={{
                                 width: "120px",
                                 height: "120px",
                                 borderRadius: "18px",
                                 objectFit: "cover",
                                 border: "1px solid #e2e8f0",
                                 background: "#f8fafc",
                              }}
                           />
                           <div>
                              <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a", marginBottom: "4px" }}>{previewCv.fullName}</h2>
                              <p style={{ fontSize: "14px", color: "#475569", fontWeight: 600 }}>{previewCv.title}</p>
                              <p style={{ fontSize: "13px", color: "#64748b", marginTop: "8px", lineHeight: 1.7 }}>{previewCv.summary}</p>
                           </div>
                        </div>

                        <div style={{ marginTop: "18px" }}>
                           <h4 style={{ fontSize: "13px", fontWeight: 800, color: "#0f172a", marginBottom: "10px" }}>Thông tin cá nhân</h4>
                           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px" }}>
                              {previewCv.personalInfo.map((item) => (
                                 <div key={item.label} style={{ border: "1px solid #e2e8f0", borderRadius: "12px", padding: "10px 12px", background: "#f8fafc" }}>
                                    <p style={{ fontSize: "11px", color: "#64748b", fontWeight: 700 }}>{item.label}</p>
                                    <p style={{ fontSize: "13px", color: "#0f172a", fontWeight: 700, marginTop: "3px" }}>{item.value}</p>
                                 </div>
                              ))}
                           </div>
                        </div>

                        <div style={{ marginTop: "18px" }}>
                           <h4 style={{ fontSize: "13px", fontWeight: 800, color: "#0f172a", marginBottom: "8px" }}>Mục tiêu nghề nghiệp</h4>
                           <p
                              style={{
                                 fontSize: "13px",
                                 color: "#334155",
                                 lineHeight: 1.7,
                                 background: "#f8fafc",
                                 border: "1px solid #e2e8f0",
                                 borderRadius: "12px",
                                 padding: "12px 14px",
                              }}
                           >
                              {previewCv.objective}
                           </p>
                        </div>

                        <div style={{ marginTop: "18px" }}>
                           <h4 style={{ fontSize: "13px", fontWeight: 800, color: "#0f172a", marginBottom: "10px" }}>Học vấn</h4>
                           <div style={{ display: "grid", gap: "10px" }}>{previewCv.education.map(renderEntry)}</div>
                        </div>

                        <div style={{ marginTop: "18px" }}>
                           <h4 style={{ fontSize: "13px", fontWeight: 800, color: "#0f172a", marginBottom: "10px" }}>Kinh nghiệm làm việc</h4>
                           <div style={{ display: "grid", gap: "10px" }}>{previewCv.experience.map(renderEntry)}</div>
                        </div>

                        <div style={{ marginTop: "18px" }}>
                           <h4 style={{ fontSize: "13px", fontWeight: 800, color: "#0f172a", marginBottom: "10px" }}>Hoạt động</h4>
                           <div style={{ display: "grid", gap: "10px" }}>{previewCv.activities.map(renderEntry)}</div>
                        </div>

                        <div style={{ marginTop: "18px" }}>
                           <h4 style={{ fontSize: "13px", fontWeight: 800, color: "#0f172a", marginBottom: "8px" }}>Chứng chỉ</h4>
                           <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                              {previewCv.certificates.map((certificate) => (
                                 <span key={certificate} style={{ fontSize: "12px", color: "#334155", background: "#eef2ff", borderRadius: "999px", padding: "4px 10px", border: "1px solid #c7d2fe" }}>
                                    {certificate}
                                 </span>
                              ))}
                           </div>
                        </div>

                        <div style={{ marginTop: "18px" }}>
                           <h4 style={{ fontSize: "13px", fontWeight: 800, color: "#0f172a", marginBottom: "8px" }}>Giải thưởng</h4>
                           <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                              {previewCv.awards.map((award) => (
                                 <span key={award} style={{ fontSize: "12px", color: "#334155", background: "#ecfeff", borderRadius: "999px", padding: "4px 10px", border: "1px solid #a5f3fc" }}>
                                    {award}
                                 </span>
                              ))}
                           </div>
                        </div>

                        <div style={{ marginTop: "18px" }}>
                           <h4 style={{ fontSize: "13px", fontWeight: 800, color: "#0f172a", marginBottom: "8px" }}>Kỹ năng</h4>
                           <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                              {previewCv.skills.map((skill) => (
                                 <span key={skill} style={{ fontSize: "12px", color: "#0f172a", borderRadius: "8px", border: "1px solid #cbd5e1", padding: "4px 8px" }}>
                                    {skill}
                                 </span>
                              ))}
                           </div>
                        </div>

                        <div style={{ marginTop: "18px" }}>
                           <h4 style={{ fontSize: "13px", fontWeight: 800, color: "#0f172a", marginBottom: "8px" }}>Người giới thiệu</h4>
                           <div style={{ display: "grid", gap: "8px" }}>
                              {previewCv.references.map((reference) => (
                                 <div key={reference} style={{ fontSize: "13px", color: "#334155", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "10px 12px" }}>
                                    {reference}
                                 </div>
                              ))}
                           </div>
                        </div>

                        <div style={{ marginTop: "18px" }}>
                           <h4 style={{ fontSize: "13px", fontWeight: 800, color: "#0f172a", marginBottom: "8px" }}>Sở thích</h4>
                           <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                              {previewCv.hobbies.map((hobby) => (
                                 <span key={hobby} style={{ fontSize: "12px", color: "#334155", background: "#f1f5f9", borderRadius: "999px", padding: "4px 10px" }}>
                                    {hobby}
                                 </span>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>
               </section>
            </div>
         )}
      </div>
   );
}
