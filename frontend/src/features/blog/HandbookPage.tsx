import { useState, useMemo } from "react";
import { CheckCircle, Clock, ChevronRight, TrendingUp, Lightbulb, MessageSquare, Shield, Search, Building, Users, Heart, Tag, X } from "lucide-react";
import articleBanner1 from "../../assets/banner/company/image_1.png";
import articleBanner2 from "../../assets/banner/company/image_2.png";
import articleBanner3 from "../../assets/banner/company/image_3.png";

const guides = [
   {
      title: "Cách viết CV ngắn gọn, đúng từ khóa ATS",
      category: "CV & Hồ sơ",
      tags: ["CV", "ATS", "Từ khóa"],
      readTime: "5 phút",
      icon: CheckCircle,
      color: "#10b981",
      bg: "linear-gradient(135deg, #ecfdf5, #d1fae5)",
      featured: true,
      type: "guide",
   },
   {
      title: "5 bước chuẩn bị cho phỏng vấn đầu tiên",
      category: "Phỏng vấn",
      tags: ["Phỏng vấn", "Chuẩn bị", "Kinh nghiệm"],
      readTime: "7 phút",
      icon: MessageSquare,
      color: "#6366f1",
      bg: "linear-gradient(135deg, #eef2ff, #e0e7ff)",
      featured: false,
      type: "guide",
   },
   {
      title: "Cách đàm phán lương mà vẫn lịch sự",
      category: "Thương lượng",
      tags: ["Lương", "Đàm phán", "Kỹ năng"],
      readTime: "6 phút",
      icon: TrendingUp,
      color: "#f59e0b",
      bg: "linear-gradient(135deg, #fffbeb, #fde68a)",
      featured: false,
      type: "guide",
   },
   {
      title: "Những dấu hiệu môi trường làm việc tích cực",
      category: "Văn hóa công ty",
      tags: ["Môi trường", "Văn hóa", "Làm việc"],
      readTime: "4 phút",
      icon: Shield,
      color: "#0ea5e9",
      bg: "linear-gradient(135deg, #f0f9ff, #bae6fd)",
      featured: false,
      type: "guide",
   },
   {
      title: "Kinh nghiệm phỏng vấn: Trả lời câu hỏi hành vi",
      category: "Phỏng vấn",
      tags: ["Phỏng vấn", "STAR", "Kinh nghiệm"],
      readTime: "8 phút",
      icon: MessageSquare,
      color: "#6366f1",
      bg: "linear-gradient(135deg, #eef2ff, #e0e7ff)",
      featured: false,
      type: "guide",
   },
   {
      title: "Cách viết CV hiệu quả cho ngành CNTT",
      category: "CV & Hồ sơ",
      tags: ["CV", "CNTT", "Hiệu quả"],
      readTime: "6 phút",
      icon: CheckCircle,
      color: "#10b981",
      bg: "linear-gradient(135deg, #ecfdf5, #d1fae5)",
      featured: false,
      type: "guide",
   },
   {
      title: "Kỹ năng mềm cần thiết cho nhân viên văn phòng",
      category: "Kỹ năng mềm",
      tags: ["Kỹ năng mềm", "Văn phòng", "Giao tiếp"],
      readTime: "9 phút",
      icon: Lightbulb,
      color: "#ec4899",
      bg: "linear-gradient(135deg, #fce7f3, #fbcfe8)",
      featured: false,
      type: "guide",
   },
   {
      title: "Review công ty NovaTech: Môi trường làm việc",
      category: "Review công ty",
      tags: ["NovaTech", "Review", "Môi trường"],
      readTime: "5 phút",
      icon: Building,
      color: "#059669",
      bg: "linear-gradient(135deg, #ecfdf5, #d1fae5)",
      featured: false,
      type: "review",
   },
   {
      title: "Văn hóa doanh nghiệp tại BluePixel",
      category: "Văn hóa doanh nghiệp",
      tags: ["BluePixel", "Văn hóa", "Doanh nghiệp"],
      readTime: "7 phút",
      icon: Heart,
      color: "#0284c7",
      bg: "linear-gradient(135deg, #f0f9ff, #bae6fd)",
      featured: false,
      type: "review",
   },
   {
      title: "Môi trường làm việc tại ScaleHub",
      category: "Môi trường làm việc",
      tags: ["ScaleHub", "Môi trường", "Làm việc"],
      readTime: "6 phút",
      icon: Users,
      color: "#7c3aed",
      bg: "linear-gradient(135deg, #f5f3ff, #ddd6fe)",
      featured: false,
      type: "review",
   },
];

const articleContents: Record<string, { intro: string; sections: { heading: string; body: string }[]; conclusion: string }> = {
   "Cách viết CV ngắn gọn, đúng từ khóa ATS": {
      intro: "CV tối ưu ATS cần rõ ràng, đúng từ khóa và tập trung vào kết quả công việc thay vì mô tả chung chung.",
      sections: [
         {
            heading: "1. Đọc kỹ mô tả công việc",
            body: "Lấy các từ khóa về kỹ năng, công cụ, vị trí và kinh nghiệm từ JD. Đưa chúng vào CV một cách tự nhiên ở phần Kỹ năng, Kinh nghiệm và Tóm tắt bản thân.",
         },
         {
            heading: "2. Viết theo cấu trúc dễ quét",
            body: "Dùng các mục chuẩn: Thông tin, Mục tiêu, Kỹ năng, Kinh nghiệm, Học vấn. Tránh bảng quá phức tạp hoặc icon dày đặc để ATS không đọc sai.",
         },
         {
            heading: "3. Ưu tiên thành tựu đo được",
            body: "Mỗi kinh nghiệm nên có kết quả cụ thể như tăng % chuyển đổi, giảm thời gian xử lý, hoặc số dự án đã triển khai.",
         },
      ],
      conclusion: "Một CV ngắn gọn, đúng từ khóa và có số liệu sẽ tăng tỷ lệ qua vòng lọc tự động và được HR chú ý nhanh hơn.",
   },
   "5 bước chuẩn bị cho phỏng vấn đầu tiên": {
      intro: "Phỏng vấn đầu tiên dễ áp lực, nhưng bạn có thể làm tốt nếu chuẩn bị theo quy trình rõ ràng.",
      sections: [
         { heading: "1. Nghiên cứu công ty", body: "Tìm hiểu sản phẩm, văn hóa, mô hình kinh doanh và tin tức gần đây của công ty." },
         { heading: "2. So khớp hồ sơ với JD", body: "Xác định 3 điểm mạnh phù hợp nhất để nhấn mạnh khi trả lời." },
         { heading: "3. Luyện câu trả lời", body: "Chuẩn bị phần giới thiệu bản thân 60-90 giây và các tình huống thường gặp." },
      ],
      conclusion: "Chuẩn bị tốt giúp bạn tự tin hơn và thể hiện tư duy chuyên nghiệp ngay từ vòng đầu.",
   },
   "Cách đàm phán lương mà vẫn lịch sự": {
      intro: "Đàm phán lương là trao đổi giá trị hai chiều, không phải mặc cả một chiều.",
      sections: [
         { heading: "1. Có dữ liệu thị trường", body: "Dùng mức lương trung vị theo vị trí/khu vực để đặt kỳ vọng hợp lý." },
         { heading: "2. Trình bày theo giá trị", body: "Nêu kỹ năng, kết quả và kinh nghiệm giúp bạn tạo tác động cho doanh nghiệp." },
         { heading: "3. Mở rộng phạm vi thương lượng", body: "Ngoài lương cơ bản, có thể trao đổi thêm về thưởng, phụ cấp, hybrid hoặc lộ trình tăng lương." },
      ],
      conclusion: "Giữ thái độ tôn trọng và rõ ràng sẽ giúp buổi đàm phán đi đến kết quả tích cực cho cả hai bên.",
   },
   "Những dấu hiệu môi trường làm việc tích cực": {
      intro: "Một môi trường tốt giúp bạn phát triển lâu dài, không chỉ dừng ở mức lương.",
      sections: [
         { heading: "1. Minh bạch mục tiêu", body: "Đội ngũ có mục tiêu rõ, KPI cụ thể và phản hồi định kỳ." },
         { heading: "2. Tôn trọng con người", body: "Lãnh đạo lắng nghe, ghi nhận đóng góp và xử lý xung đột công bằng." },
         { heading: "3. Học tập liên tục", body: "Có văn hóa chia sẻ kiến thức, mentoring và tạo cơ hội nâng cấp kỹ năng." },
      ],
      conclusion: "Chọn đúng môi trường sẽ quyết định tốc độ trưởng thành nghề nghiệp của bạn.",
   },
   "Kinh nghiệm phỏng vấn: Trả lời câu hỏi hành vi": {
      intro: "Câu hỏi hành vi đánh giá cách bạn xử lý tình huống thực tế, không chỉ kiến thức chuyên môn.",
      sections: [
         { heading: "1. Dùng STAR", body: "Trả lời theo cấu trúc Situation, Task, Action, Result để mạch lạc và thuyết phục." },
         { heading: "2. Chọn ví dụ có kết quả", body: "Ưu tiên ví dụ có số liệu hoặc thay đổi cụ thể sau hành động của bạn." },
         { heading: "3. Kết nối với vị trí ứng tuyển", body: "Nhấn mạnh kỹ năng liên quan trực tiếp đến vai trò đang ứng tuyển." },
      ],
      conclusion: "Trả lời hành vi tốt cho thấy bạn có kinh nghiệm thực chiến và tư duy giải quyết vấn đề.",
   },
   "Cách viết CV hiệu quả cho ngành CNTT": {
      intro: "CV ngành CNTT cần thể hiện stack kỹ thuật, dự án tiêu biểu và tác động kinh doanh.",
      sections: [
         { heading: "1. Tách rõ kỹ năng kỹ thuật", body: "Nhóm kỹ năng theo ngôn ngữ, framework, database, cloud và công cụ." },
         { heading: "2. Mô tả dự án theo vai trò", body: "Nêu rõ bạn phụ trách phần nào, công nghệ nào và kết quả đạt được." },
         { heading: "3. Đưa link chứng minh năng lực", body: "Thêm GitHub, portfolio hoặc sản phẩm thực tế để tăng độ tin cậy." },
      ],
      conclusion: "Một CV CNTT hiệu quả là CV cho thấy bạn có thể triển khai giải pháp thật, không chỉ biết lý thuyết.",
   },
   "Kỹ năng mềm cần thiết cho nhân viên văn phòng": {
      intro: "Kỹ năng mềm quyết định hiệu quả phối hợp và khả năng thăng tiến trong môi trường công sở.",
      sections: [
         { heading: "1. Giao tiếp rõ ràng", body: "Truyền đạt ngắn gọn, đúng trọng tâm và đúng đối tượng nhận thông tin." },
         { heading: "2. Quản lý thời gian", body: "Ưu tiên việc quan trọng, chia nhỏ mục tiêu và theo dõi tiến độ hằng ngày." },
         { heading: "3. Hợp tác liên phòng ban", body: "Lắng nghe, thống nhất kỳ vọng và xử lý khác biệt theo hướng xây dựng." },
      ],
      conclusion: "Nâng cấp kỹ năng mềm giúp bạn làm việc hiệu quả hơn và tạo ấn tượng chuyên nghiệp bền vững.",
   },
   "Review công ty NovaTech: Môi trường làm việc": {
      intro: "NovaTech có nhịp làm việc nhanh, chú trọng sản phẩm và văn hóa phản hồi liên tục.",
      sections: [
         { heading: "1. Điểm mạnh", body: "Đội ngũ kỹ thuật mạnh, quy trình agile rõ ràng, cơ hội học từ dự án thực tế." },
         { heading: "2. Lưu ý", body: "Khối lượng công việc có thể cao theo sprint, cần tự quản lý thời gian tốt." },
         { heading: "3. Phù hợp với ai", body: "Ứng viên thích môi trường tăng trưởng nhanh và chủ động trong công việc." },
      ],
      conclusion: "NovaTech phù hợp với người muốn phát triển năng lực chuyên môn trong môi trường sản phẩm năng động.",
   },
   "Văn hóa doanh nghiệp tại BluePixel": {
      intro: "BluePixel nổi bật ở văn hóa sáng tạo, tôn trọng cá tính và chất lượng trải nghiệm người dùng.",
      sections: [
         { heading: "1. Môi trường", body: "Cởi mở, khuyến khích thảo luận ý tưởng và thử nghiệm các phương án thiết kế mới." },
         { heading: "2. Quy trình", body: "Làm việc chặt với team sản phẩm và kỹ thuật, review thiết kế định kỳ." },
         { heading: "3. Cơ hội", body: "Thích hợp cho UI/UX muốn nâng năng lực research và design system." },
      ],
      conclusion: "BluePixel phù hợp với ứng viên đề cao sáng tạo và muốn làm sản phẩm có trải nghiệm tinh chỉnh.",
   },
   "Môi trường làm việc tại ScaleHub": {
      intro: "ScaleHub tập trung vào cloud và backend với tiêu chuẩn vận hành ổn định, bảo mật cao.",
      sections: [
         { heading: "1. Đặc thù công việc", body: "Nhiều bài toán hạ tầng, tối ưu hiệu năng và xử lý sự cố hệ thống." },
         { heading: "2. Văn hóa kỹ thuật", body: "Ưu tiên automation, monitoring và cải tiến quy trình liên tục." },
         { heading: "3. Phát triển nghề nghiệp", body: "Phù hợp cho backend/devops muốn nâng trình độ ở hệ thống lớn." },
      ],
      conclusion: "ScaleHub là môi trường tốt cho ứng viên thích kỹ thuật chuyên sâu và tính ổn định hệ thống.",
   },
};

const articleIllustrations: Record<string, string> = {
   "Cách viết CV ngắn gọn, đúng từ khóa ATS": articleBanner1,
   "5 bước chuẩn bị cho phỏng vấn đầu tiên": articleBanner2,
   "Cách đàm phán lương mà vẫn lịch sự": articleBanner3,
   "Những dấu hiệu môi trường làm việc tích cực": articleBanner1,
   "Kinh nghiệm phỏng vấn: Trả lời câu hỏi hành vi": articleBanner2,
   "Cách viết CV hiệu quả cho ngành CNTT": articleBanner3,
   "Kỹ năng mềm cần thiết cho nhân viên văn phòng": articleBanner1,
   "Review công ty NovaTech: Môi trường làm việc": articleBanner2,
   "Văn hóa doanh nghiệp tại BluePixel": articleBanner3,
   "Môi trường làm việc tại ScaleHub": articleBanner1,
};

const categories = [
   { label: "CV & Hồ sơ", count: 12, color: "#10b981" },
   { label: "Phỏng vấn", count: 8, color: "#6366f1" },
   { label: "Thương lượng", count: 6, color: "#f59e0b" },
   { label: "Phát triển sự nghiệp", count: 15, color: "#ec4899" },
   { label: "Kỹ năng mềm", count: 10, color: "#ec4899" },
   { label: "Review công ty", count: 20, color: "#059669" },
   { label: "Môi trường làm việc", count: 18, color: "#7c3aed" },
   { label: "Văn hóa doanh nghiệp", count: 14, color: "#0284c7" },
];

const allTags = [
   "CV", "ATS", "Từ khóa", "Phỏng vấn", "Chuẩn bị", "Kinh nghiệm", "Lương", "Đàm phán", "Kỹ năng",
   "Môi trường", "Văn hóa", "Làm việc", "STAR", "CNTT", "Hiệu quả", "Kỹ năng mềm", "Văn phòng", "Giao tiếp",
   "NovaTech", "Review", "BluePixel", "Doanh nghiệp", "ScaleHub"
];

export default function HandbookPage() {
   const [searchQuery, setSearchQuery] = useState("");
   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
   const [selectedTags, setSelectedTags] = useState<string[]>([]);
   const [selectedArticleTitle, setSelectedArticleTitle] = useState<string | null>(null);

   const filteredGuides = useMemo(() => {
      return guides.filter((guide) => {
         const matchesSearch = guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            guide.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            guide.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

         const matchesCategory = !selectedCategory || guide.category === selectedCategory;

         const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => guide.tags.includes(tag));

         return matchesSearch && matchesCategory && matchesTags;
      });
   }, [searchQuery, selectedCategory, selectedTags]);

   const featuredGuides = filteredGuides.filter(guide => guide.featured);
   const regularGuides = filteredGuides.filter(guide => !guide.featured);
   const selectedGuide = guides.find((guide) => guide.title === selectedArticleTitle) ?? null;
   const selectedContent = selectedGuide ? articleContents[selectedGuide.title] : null;
   const selectedIllustration = selectedGuide ? articleIllustrations[selectedGuide.title] : null;

   const toggleTag = (tag: string) => {
      setSelectedTags(prev =>
         prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
      );
   };

   return (
      <div className="space-y-8">
         {/* Hero */}
         <div style={{
            borderRadius: "20px",
            background: "linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #14b8a6 100%)",
            padding: "48px",
            position: "relative",
            overflow: "hidden",
         }}>
            <div style={{
               position: "absolute", top: "-30px", right: "60px", width: "180px", height: "180px",
               borderRadius: "50%", background: "rgba(153,246,228,0.2)", filter: "blur(35px)",
            }} />
            <h1 style={{ fontSize: "36px", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: "10px" }}>
               Cẩm nang <span style={{ color: "#99f6e4" }}>việc làm</span>
            </h1>
            <p style={{ color: "#99f6e4", fontSize: "15px", lineHeight: 1.7 }}>
               Bộ nội dung hướng dẫn từ tạo CV đến phỏng vấn và phát triển sự nghiệp bền vững.
            </p>
         </div>

         {/* Search and Filters */}
         <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
               <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <input
                     type="text"
                     placeholder="Tìm kiếm bài viết..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
               </div>
               <div className="flex gap-2">
                  <button
                     onClick={() => setSelectedCategory(null)}
                     className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!selectedCategory ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                  >
                     Tất cả
                  </button>
                  <button
                     onClick={() => setSelectedCategory("CV & Hồ sơ")}
                     className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === "CV & Hồ sơ" ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                  >
                     CV
                  </button>
                  <button
                     onClick={() => setSelectedCategory("Phỏng vấn")}
                     className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === "Phỏng vấn" ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                  >
                     Phỏng vấn
                  </button>
               </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
               {allTags.slice(0, 12).map((tag) => (
                  <button
                     key={tag}
                     onClick={() => toggleTag(tag)}
                     className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${selectedTags.includes(tag)
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                  >
                     <Tag className="h-3 w-3" />
                     {tag}
                  </button>
               ))}
            </div>
         </div>

         {/* Category pills */}
         <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {categories.map((cat) => (
               <button
                  key={cat.label}
                  onClick={() => setSelectedCategory(cat.label)}
                  style={{
                     display: "inline-flex", alignItems: "center", gap: "6px",
                     padding: "7px 16px", borderRadius: "999px", fontSize: "13px", fontWeight: 600,
                     background: `${cat.color}12`, color: cat.color,
                     border: `1px solid ${cat.color}30`, cursor: "pointer",
                  }}
               >
                  {cat.label}
                  <span style={{
                     background: cat.color, color: "#fff",
                     borderRadius: "999px", fontSize: "10px", fontWeight: 700,
                     padding: "1px 6px",
                  }}>
                     {cat.count}
                  </span>
               </button>
            ))}
         </div>

         {/* Featured articles */}
         {featuredGuides.length > 0 && (
            <div className="space-y-4">
               <h2 className="text-xl font-bold text-slate-900">Bài viết nổi bật</h2>
               {featuredGuides.map((featured) => (
                  <div key={featured.title} style={{
                     borderRadius: "20px", overflow: "hidden",
                     background: featured.bg, border: "1px solid #d1fae5",
                     padding: "36px", position: "relative",
                     boxShadow: "0 8px 30px rgba(16,185,129,0.12)",
                  }}>
                     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", flexWrap: "wrap" }}>
                        <div style={{ maxWidth: "520px" }}>
                           <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "14px" }}>
                              <span style={{
                                 background: featured.color, color: "#fff",
                                 borderRadius: "999px", padding: "3px 12px",
                                 fontSize: "11px", fontWeight: 700,
                              }}>
                                 ✦ NỔI BẬT
                              </span>
                              <span style={{ fontSize: "12px", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}>
                                 <Clock style={{ width: 12, height: 12 }} /> {featured.readTime} đọc
                              </span>
                           </div>
                           <h2 style={{ fontSize: "26px", fontWeight: 800, color: "#0f172a", lineHeight: 1.3, letterSpacing: "-0.01em", marginBottom: "12px" }}>
                              {featured.title}
                           </h2>
                           <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.7, marginBottom: "20px" }}>
                              Hướng dẫn chi tiết cách xây dựng CV vượt qua hệ thống ATS tự động, chọn đúng từ khóa theo ngành và trình bày thông tin ấn tượng nhất.
                           </p>
                           <div className="flex flex-wrap gap-2 mb-4">
                              {featured.tags.map((tag) => (
                                 <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-white/60 rounded-full text-xs font-medium text-slate-700">
                                    <Tag className="h-3 w-3" />
                                    {tag}
                                 </span>
                              ))}
                           </div>
                           <button style={{
                              display: "inline-flex", alignItems: "center", gap: "6px",
                              background: featured.color, color: "#fff",
                              borderRadius: "10px", padding: "10px 22px",
                              fontSize: "13px", fontWeight: 700, border: "none", cursor: "pointer",
                              boxShadow: `0 4px 15px ${featured.color}40`,
                           }}
                              onClick={() => setSelectedArticleTitle(featured.title)}>
                              Đọc ngay <ChevronRight style={{ width: 14, height: 14 }} />
                           </button>
                        </div>
                        <div style={{
                           width: "100px", height: "100px", borderRadius: "24px",
                           background: featured.color, display: "flex",
                           alignItems: "center", justifyContent: "center", flexShrink: 0,
                           boxShadow: `0 12px 30px ${featured.color}40`,
                        }}>
                           <Lightbulb style={{ width: 48, height: 48, color: "#fff" }} />
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         )}

         {/* Article list */}
         <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginBottom: "4px" }}>
               {regularGuides.length > 0 ? `Bài viết khác (${regularGuides.length})` : "Không tìm thấy bài viết nào"}
            </h3>
            {regularGuides.map((item) => {
               const Icon = item.icon;
               return (
                  <div key={item.title} style={{
                     display: "flex", alignItems: "center", gap: "16px",
                     background: "#fff", borderRadius: "16px", padding: "18px 22px",
                     border: "1px solid #f1f5f9", cursor: "pointer",
                     boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                     transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                     onClick={() => setSelectedArticleTitle(item.title)}
                     onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateX(4px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px ${item.color}15`; }}
                     onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)"; }}
                  >
                     <div style={{
                        width: "44px", height: "44px", borderRadius: "12px",
                        background: item.bg, display: "flex", alignItems: "center",
                        justifyContent: "center", flexShrink: 0,
                        border: `1px solid ${item.color}20`,
                     }}>
                        <Icon style={{ width: 18, height: 18, color: item.color }} />
                     </div>
                     <div style={{ flex: 1 }}>
                        <div className="flex items-center gap-2 mb-1">
                           <span style={{
                              fontSize: "11px", fontWeight: 700, color: item.color,
                              letterSpacing: "0.03em",
                           }}>
                              {item.category}
                           </span>
                           <span className="text-xs text-slate-400">•</span>
                           <span className="text-xs text-slate-500">{item.type === 'review' ? 'Review' : 'Hướng dẫn'}</span>
                        </div>
                        <p style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a", marginTop: "2px" }}>
                           {item.title}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                           {item.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded-full text-xs font-medium text-slate-600">
                                 <Tag className="h-2.5 w-2.5" />
                                 {tag}
                              </span>
                           ))}
                        </div>
                     </div>
                     <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
                        <span style={{ fontSize: "12px", color: "#94a3b8", display: "flex", alignItems: "center", gap: "4px" }}>
                           <Clock style={{ width: 11, height: 11 }} /> {item.readTime}
                        </span>
                        <ChevronRight style={{ width: 16, height: 16, color: "#cbd5e1" }} />
                     </div>
                  </div>
               );
            })}
         </div>

         {selectedGuide && selectedContent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
               <button
                  type="button"
                  aria-label="Đóng nội dung bài viết"
                  className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                  onClick={() => setSelectedArticleTitle(null)}
               />
               <section className="relative z-10 w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl md:p-8">
                  <button
                     type="button"
                     onClick={() => setSelectedArticleTitle(null)}
                     className="absolute right-4 top-4 z-20 flex rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                     aria-label="Đóng"
                  >
                     <X className="h-4 w-4" />
                  </button>

                  <div className="max-h-[62vh] overflow-y-auto pr-1 md:max-h-[68vh] md:pr-2">
                     <div className="mt-1 flex items-start justify-between gap-4 pr-12">
                        <div className="flex flex-wrap items-center gap-2">
                           <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: `${selectedGuide.color}18`, color: selectedGuide.color }}>
                              {selectedGuide.category}
                           </span>
                           <span className="text-xs text-slate-500">{selectedGuide.readTime} đọc</span>
                        </div>
                     </div>

                     <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">{selectedGuide.title}</h2>

                     {selectedIllustration && (
                        <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
                           <img
                              src={selectedIllustration}
                              alt={`Ảnh minh họa: ${selectedGuide.title}`}
                              className="h-56 w-full object-cover md:h-72"
                           />
                        </div>
                     )}

                     <p className="mt-4 text-sm leading-7 text-slate-600">{selectedContent.intro}</p>

                     <div className="mt-6 space-y-5">
                        {selectedContent.sections.map((section) => (
                           <article key={section.heading}>
                              <h3 className="text-base font-semibold text-slate-900">{section.heading}</h3>
                              <p className="mt-2 text-sm leading-7 text-slate-600">{section.body}</p>
                           </article>
                        ))}
                     </div>

                     <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4">
                        <p className="text-sm leading-7 text-emerald-900">{selectedContent.conclusion}</p>
                     </div>
                  </div>
               </section>
            </div>
         )}
      </div>
   );
}