import { useLayoutEffect, useRef, useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import "./cv-builder.css";
import { CvProvider, useCvContext, CvData, Skill, Experience, Education, Project } from "./CvContext";
import { readAuthUser } from "../../utils/auth";
import { chatApi } from "../../services/chatbotApi";

const COLOR_OPTIONS = [
  { value: "#7c3aed", label: "Tím" },
  { value: "#10b981", label: "Xanh lá" },
  { value: "#0ea5e9", label: "Xanh dương" },
  { value: "#ec4899", label: "Hồng" },
  { value: "#f59e0b", label: "Cam vàng" },
];

const inputCls = "w-full px-3 py-2.5 rounded-[10px] border border-slate-200 bg-slate-50 text-[13px] text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 focus:bg-white font-[inherit]";
const labelCls = "block text-xs font-semibold text-slate-600 mb-1.5 mt-3";
const sectionTitleCls = "text-[11px] font-bold text-violet-600 uppercase tracking-[0.06em] mb-3 pb-1.5 border-b-2 border-violet-50";
const addBtnCls = "mt-2 px-3 py-1.5 text-xs font-semibold text-violet-700 bg-violet-50 rounded-lg hover:bg-violet-100 transition-colors cursor-pointer";
const removeBtnCls = "text-rose-400 hover:text-rose-600 text-xs font-bold ml-2 cursor-pointer";
const cardCls = "border border-slate-100 rounded-xl p-3 mb-3 bg-slate-50 relative";

const accentH3 = "[color:var(--cv-accent,#7c3aed)] text-[11px] font-bold uppercase tracking-[0.06em] mb-2 transition-colors duration-300";

function CvEditorContent() {
  const { cvData, setCvData } = useCvContext();
  const [isUploading, setIsUploading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  const [isAiReviewVisible, setIsAiReviewVisible] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const [savedCvs, setSavedCvs] = useState<any[]>([]);
  const [selectedCvId, setSelectedCvId] = useState<number | "">("");

  const fetchCvs = useCallback(async () => {
    const currentUser = readAuthUser();
    if (!currentUser?.email) return;
    const token = localStorage.getItem("accessToken");
    const headers: Record<string, string> = token ? { 'Authorization': `Bearer ${token}` } : {};
    try {
      const userRes = await fetch(import.meta.env.VITE_API_URL + '/api/users/by-email?email=' + encodeURIComponent(currentUser.email), { headers });
      if (!userRes.ok) return;
      const { userId } = await userRes.json();
      const cvRes = await fetch(import.meta.env.VITE_API_URL + `/api/cvs/user/${userId}`, { headers });
      if (cvRes.ok) {
        const cvs = await cvRes.json();
        setSavedCvs(cvs.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      }
    } catch (err) {
      console.error("Failed to fetch CVs", err);
    }
  }, []);

  const { id: urlCvId } = useParams<{ id?: string }>();

  // Auto-load CV khi vào từ route /cv-cua-toi/chinh-sua/:id
  useEffect(() => {
    fetchCvs();
  }, [fetchCvs]);

  useEffect(() => {
    if (!urlCvId || savedCvs.length === 0) return;
    const targetId = Number(urlCvId);
    const found = savedCvs.find((cv: any) => cv.id === targetId);
    if (!found) return;
    setSelectedCvId(targetId);
    setCvData({
      fullName:    found.fullName    || "",
      jobTitle:    found.jobTitle    || "",
      email:       found.email       || "",
      phone:       found.phone       || "",
      location:    found.location    || "",
      summary:     found.summary     || "",
      color:       found.settings?.themeColor || "#7c3aed",
      skills:      found.skills?.length      ? found.skills.map((s: any)      => ({ skillName: s.skillName || "", level: s.level || "Intermediate" }))                                                                             : [],
      experiences: found.experiences?.length ? found.experiences.map((x: any) => ({ company: x.company || "", position: x.position || "", startDate: x.startDate || "", endDate: x.endDate || "", description: x.description || "" })) : [],
      educations:  found.educations?.length  ? found.educations.map((x: any)  => ({ school: x.school || x.institution || "", major: x.major || x.degree || "", startDate: x.startDate || "", endDate: x.endDate || "" }))         : [],
      projects:    found.projects?.length    ? found.projects.map((x: any)    => ({ name: x.name || x.projectName || "", description: x.description || "", technologies: Array.isArray(x.technologies) ? x.technologies.join(", ") : (x.techStack || x.technologies || ""), link: x.link || "" })) : [],
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlCvId, savedCvs]);

  const handleSelectCv = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedCvId(val ? Number(val) : "");
    if (!val) return;

    const selected = savedCvs.find(cv => cv.id === Number(val));
    if (selected) {
      setCvData({
        fullName: selected.fullName || "",
        jobTitle: selected.jobTitle || "",
        email: selected.email || "",
        phone: selected.phone || "",
        location: selected.location || "",
        summary: selected.summary || "",
        color: selected.settings?.themeColor || "#7c3aed",
        skills: selected.skills?.length ? selected.skills.map((s: any) => ({ skillName: s.skillName || "", level: s.level || "Intermediate" })) : [],
        experiences: selected.experiences?.length ? selected.experiences.map((x: any) => ({ company: x.company || "", position: x.position || "", startDate: x.startDate || "", endDate: x.endDate || "", description: x.description || "" })) : [],
        educations: selected.educations?.length ? selected.educations.map((x: any) => ({ school: x.school || "", major: x.major || "", startDate: x.startDate || "", endDate: x.endDate || "" })) : [],
        projects: selected.projects?.length ? selected.projects.map((x: any) => ({ name: x.name || "", description: x.description || "", technologies: Array.isArray(x.technologies) ? x.technologies.join(", ") : (x.technologies || ""), link: x.link || "" })) : [],
      });
    }
  };

  const set = (field: keyof CvData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setCvData(p => ({ ...p, [field]: e.target.value }));

  // ── Skills ──
  const addSkill = () => setCvData(p => ({ ...p, skills: [...p.skills, { skillName: "", level: "Intermediate" }] }));
  const updateSkill = (i: number, f: keyof Skill, v: string) =>
    setCvData(p => { const s = [...p.skills]; s[i] = { ...s[i], [f]: v }; return { ...p, skills: s }; });
  const removeSkill = (i: number) => setCvData(p => ({ ...p, skills: p.skills.filter((_, j) => j !== i) }));

  // ── Experiences ──
  const blankExp = (): Experience => ({ company: "", position: "", startDate: "", endDate: "", description: "" });
  const addExp = () => setCvData(p => ({ ...p, experiences: [...p.experiences, blankExp()] }));
  const updateExp = (i: number, f: keyof Experience, v: string) =>
    setCvData(p => { const a = [...p.experiences]; a[i] = { ...a[i], [f]: v }; return { ...p, experiences: a }; });
  const removeExp = (i: number) => setCvData(p => ({ ...p, experiences: p.experiences.filter((_, j) => j !== i) }));

  // ── Educations ──
  const blankEdu = (): Education => ({ school: "", major: "", startDate: "", endDate: "" });
  const addEdu = () => setCvData(p => ({ ...p, educations: [...p.educations, blankEdu()] }));
  const updateEdu = (i: number, f: keyof Education, v: string) =>
    setCvData(p => { const a = [...p.educations]; a[i] = { ...a[i], [f]: v }; return { ...p, educations: a }; });
  const removeEdu = (i: number) => setCvData(p => ({ ...p, educations: p.educations.filter((_, j) => j !== i) }));

  // ── Projects ──
  const blankProj = (): Project => ({ name: "", description: "", technologies: "", link: "" });
  const addProj = () => setCvData(p => ({ ...p, projects: [...p.projects, blankProj()] }));
  const updateProj = (i: number, f: keyof Project, v: string) =>
    setCvData(p => { const a = [...p.projects]; a[i] = { ...a[i], [f]: v }; return { ...p, projects: a }; });
  const removeProj = (i: number) => setCvData(p => ({ ...p, projects: p.projects.filter((_, j) => j !== i) }));

  const fetchAiScore = async () => {
    if (aiFeedback) return;
    setIsAiLoading(true);
    try {
      const hasData = Object.entries(cvData).some(([k, v]) => k !== 'color' && typeof v === 'string' && v.trim() !== '');
      const apiMessage = hasData
        ? `[Dữ liệu CV hiện tại của tôi (JSON): ${JSON.stringify(cvData)}]\n\nHãy chấm điểm CV này của tôi và gợi ý chi tiết cách cải thiện để tôi trông chuyên nghiệp hơn với nhà tuyển dụng.`
        : "Hãy chấm điểm CV này của tôi và gợi ý chi tiết cách cải thiện để tôi trông chuyên nghiệp hơn với nhà tuyển dụng.";

      const reply = await chatApi.sendMessage(apiMessage);
      setAiFeedback(reply);
    } catch (err) {
      setAiFeedback("Xin lỗi, đã có lỗi xảy ra khi gọi AI nhận xét. Vui lòng thử lại sau.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleScoreCv = () => {
    setIsPreviewVisible(false);
    if (!isAiReviewVisible) {
      setIsAiReviewVisible(true);
      fetchAiScore();
    } else {
      setIsAiReviewVisible(false);
    }
  };

  const handleTogglePreview = () => {
    setIsAiReviewVisible(false);
    setIsPreviewVisible(!isPreviewVisible);
  };

  const handleUploadCv = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const token = localStorage.getItem("accessToken");
      const extractHeaders: Record<string, string> = {};
      if (token) extractHeaders['Authorization'] = `Bearer ${token}`;
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/cvs/extract', {
        method: 'POST',
        headers: extractHeaders,
        body: formData,
      });
      if (res.ok) {
        const d = await res.json();
        setCvData(prev => ({
          ...prev,
          fullName: d.fullName || prev.fullName,
          jobTitle: d.jobTitle || prev.jobTitle,
          email: d.email || prev.email,
          phone: d.phone || prev.phone,
          location: d.location || prev.location,
          summary: d.summary || prev.summary,
          skills: d.skills?.length ? d.skills.map((s: any) => ({ skillName: s.skillName || "", level: s.level || "Intermediate" })) : prev.skills,
          experiences: d.experiences?.length ? d.experiences.map((x: any) => ({
            company: x.company || "", position: x.position || "",
            startDate: x.startDate || "", endDate: x.endDate || "",
            description: x.description || ""
          })) : prev.experiences,
          educations: d.educations?.length ? d.educations.map((x: any) => ({
            school: x.school || "", major: x.major || "",
            startDate: x.startDate || "", endDate: x.endDate || ""
          })) : prev.educations,
          projects: d.projects?.length ? d.projects.map((x: any) => ({
            name: x.name || "", description: x.description || "",
            technologies: Array.isArray(x.technologies) ? x.technologies.join(", ") : (x.technologies || ""),
            link: x.link || ""
          })) : prev.projects,
        }));
      } else {
        const errText = await res.text().catch(() => '');
        console.error('Extract error:', res.status, errText);
        alert(`Lỗi khi trích xuất dữ liệu CV (${res.status}). ${res.status === 403 ? 'Vui lòng đăng nhập lại.' : ''}`);
      }
    } catch (err) {
      console.error('Extract network error:', err);
      alert("Lỗi kết nối khi tải CV.");
    }
    finally { setIsUploading(false); if (e.target) e.target.value = ''; }
  };

  const handleSaveCv = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentUser = readAuthUser();
    if (!currentUser?.email) { setSaveStatus('error'); return; }
    setSaveStatus('saving');
    const token = localStorage.getItem("accessToken");
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const isUpdate = !!selectedCvId; // PUT nếu đang chỉnh CV có sẵn, POST nếu tạo mới

    try {
      const userRes = await fetch(import.meta.env.VITE_API_URL + '/api/users/by-email?email=' + encodeURIComponent(currentUser.email), { headers: token ? { 'Authorization': `Bearer ${token}` } : {} });
      if (!userRes.ok) throw new Error('User not found');
      const { userId } = await userRes.json() as { userId: number; email: string };

      const cvPayload = {
        userId,
        cvName: cvData.fullName ? cvData.fullName + ' - CV' : 'CV của tôi',
        fullName: cvData.fullName, jobTitle: cvData.jobTitle,
        email: cvData.email, phone: cvData.phone,
        location: cvData.location, summary: cvData.summary,
        settings: { themeColor: cvData.color },
        cvData: { skills: cvData.skills, color: cvData.color },
        skills: cvData.skills.map(s => ({ skillName: s.skillName, level: s.level })),
        experiences: cvData.experiences,
        educations: cvData.educations,
        projects: cvData.projects.map(p => ({
          ...p,
          technologies: Array.isArray(p.technologies)
            ? p.technologies
            : p.technologies.split(',').map(t => t.trim()).filter(Boolean)
        })),
      };

      const cvRes = await fetch(
        import.meta.env.VITE_API_URL + (isUpdate ? `/api/cvs/${selectedCvId}` : '/api/cvs'),
        { method: isUpdate ? 'PUT' : 'POST', headers, body: JSON.stringify(cvPayload) }
      );
      if (!cvRes.ok) {
        const errText = await cvRes.text().catch(() => '');
        console.error('Save CV error:', cvRes.status, errText);
        if (cvRes.status === 403) {
          alert('Lỗi 403: Phiên đăng nhập hết hạn. Vui lòng đăng xuất và đăng nhập lại để lấy token mới.');
        }
        throw new Error(`Save failed: ${cvRes.status}`);
      }
      // Nếu vừa tạo mới, lưu lại ID để lần sau sẽ update thay vì tạo tiếp
      if (!isUpdate) {
        const saved = await cvRes.json();
        if (saved?.id) setSelectedCvId(saved.id);
      }
      setSaveStatus('success');
      await fetchCvs(); // Refresh danh sách CV sau khi lưu thành công
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
      console.error('Save error:', err);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleCreateNew = () => {
    setSelectedCvId("");
    setCvData({
      fullName: '', jobTitle: '', email: '', phone: '',
      location: '', summary: '', color: '#7c3aed',
      skills: [], experiences: [], educations: [], projects: [],
    });
    setIsPreviewVisible(false);
    setIsAiReviewVisible(false);
  };

  const previewRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    previewRef.current?.style.setProperty("--cv-accent", cvData.color);
  }, [cvData.color]);

  return (
    <>
      <div className={`grid grid-cols-1 ${isPreviewVisible || isAiReviewVisible
          ? 'lg:grid-cols-[200px_minmax(400px,1fr)_450px]'
          : 'lg:grid-cols-[200px_minmax(500px,1fr)] max-w-5xl mx-auto w-full'
        } gap-6 items-start min-h-[calc(100vh-80px)]`}>

        {/* ── Left: Tools ── */}
        <aside className="bg-white rounded-[20px] border border-slate-200 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-5 lg:sticky lg:top-6 flex flex-col gap-3 shrink-0">
          <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Công cụ</h2>

          {/* Tạo CV mới */}
          <button type="button" onClick={handleCreateNew}
            className="w-full px-3 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer">
            ＋ Tạo CV mới
          </button>

          <button onClick={() => document.getElementById('cv-upload-input')?.click()} disabled={isUploading}
            className="w-full px-3 py-2.5 text-xs font-semibold text-violet-700 bg-violet-50 rounded-lg hover:bg-violet-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer">
            Tải CV lên
          </button>
          <input id="cv-upload-input" type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleUploadCv} />

          <button onClick={handleScoreCv}
            className={`w-full px-3 py-2.5 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer ${isAiReviewVisible ? 'text-white bg-emerald-600 hover:bg-emerald-700 shadow-md' : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'}`}>
            {isAiReviewVisible ? 'Đóng AI Nhận xét' : 'AI Chấm điểm'}
          </button>

          <button type="button" onClick={handleTogglePreview}
            className={`w-full px-3 py-2.5 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer ${isPreviewVisible ? 'text-white bg-blue-600 hover:bg-blue-700 shadow-md' : 'text-blue-700 bg-blue-50 hover:bg-blue-100'}`}>
            {isPreviewVisible ? 'Ẩn Xem trước' : 'Xem trước'}
          </button>
        </aside>

        {/* ── Middle: Editor ── */}
        <aside className="bg-white rounded-[20px] border border-slate-200 shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden lg:sticky lg:top-6 max-h-[calc(100vh-48px)] flex flex-col">
          <header className="px-6 pt-5 pb-4 border-b border-slate-100 flex flex-col gap-3 shrink-0">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-extrabold text-slate-900">Chỉnh sửa CV</h1>
              {isUploading && <span className="text-xs font-medium text-violet-600 animate-pulse">Đang trích xuất...</span>}
            </div>
            {savedCvs.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-700 whitespace-nowrap">CV đã lưu:</span>
                <select value={selectedCvId} onChange={handleSelectCv} className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-sm focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none truncate bg-slate-50 cursor-pointer">
                  <option value="">-- Chọn CV để tải --</option>
                  {savedCvs.map(cv => (
                    <option key={cv.id} value={cv.id}>
                      {cv.cvName || cv.fullName || "CV không tên"} {cv.createdAt ? `- ${new Date(cv.createdAt).toLocaleDateString('vi-VN')}` : ""}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </header>

          <form className="px-6 py-4 flex flex-col overflow-y-auto flex-1" onSubmit={handleSaveCv}>

            {/* Personal info */}
            <section className="mb-6">
              <h2 className={sectionTitleCls}>Thông tin cá nhân</h2>
              <label className={labelCls}>Họ và tên</label>
              <input className={inputCls} type="text" placeholder="Nguyễn Văn A" value={cvData.fullName} onChange={set("fullName")} />
              <label className={labelCls}>Vị trí / Nghề nghiệp</label>
              <input className={inputCls} type="text" placeholder="Frontend Developer" value={cvData.jobTitle} onChange={set("jobTitle")} />
              <label className={labelCls}>Email</label>
              <input className={inputCls} type="email" placeholder="example@email.com" value={cvData.email} onChange={set("email")} />
              <label className={labelCls}>Điện thoại</label>
              <input className={inputCls} type="tel" placeholder="0901 234 567" value={cvData.phone} onChange={set("phone")} />
              <label className={labelCls}>Địa chỉ</label>
              <input className={inputCls} type="text" placeholder="Hà Nội, Việt Nam" value={cvData.location} onChange={set("location")} />
              <label className={labelCls}>Tóm tắt bản thân</label>
              <textarea className={`${inputCls} resize-y min-h-[80px]`} rows={3} placeholder="Mô tả ngắn về bản thân..." value={cvData.summary} onChange={set("summary")} />
            </section>

            {/* Skills */}
            <section className="mb-6">
              <h2 className={sectionTitleCls}>Kỹ năng</h2>
              {cvData.skills.map((s, i) => (
                <div key={i} className={cardCls}>
                  <button type="button" className={removeBtnCls + " absolute top-2 right-2"} onClick={() => removeSkill(i)}>✕</button>
                  <input className={inputCls} placeholder="Tên kỹ năng (VD: React, Java...)" value={s.skillName}
                    onChange={e => updateSkill(i, "skillName", e.target.value)} />
                  <select className={`${inputCls} mt-2`} value={s.level} onChange={e => updateSkill(i, "level", e.target.value)}>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
              ))}
              <button type="button" className={addBtnCls} onClick={addSkill}>+ Thêm kỹ năng</button>
            </section>

            {/* Experience */}
            <section className="mb-6">
              <h2 className={sectionTitleCls}>Kinh nghiệm làm việc</h2>
              {cvData.experiences.map((x, i) => (
                <div key={i} className={cardCls}>
                  <button type="button" className={removeBtnCls + " absolute top-2 right-2"} onClick={() => removeExp(i)}>✕</button>
                  <input className={inputCls} placeholder="Tên công ty" value={x.company} onChange={e => updateExp(i, "company", e.target.value)} />
                  <input className={`${inputCls} mt-2`} placeholder="Vị trí" value={x.position} onChange={e => updateExp(i, "position", e.target.value)} />
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <input className={inputCls} placeholder="Bắt đầu (VD: 2022-06)" value={x.startDate} onChange={e => updateExp(i, "startDate", e.target.value)} />
                    <input className={inputCls} placeholder="Kết thúc / Hiện tại" value={x.endDate} onChange={e => updateExp(i, "endDate", e.target.value)} />
                  </div>
                  <textarea className={`${inputCls} mt-2 resize-y min-h-[60px]`} rows={2} placeholder="Mô tả công việc..." value={x.description} onChange={e => updateExp(i, "description", e.target.value)} />
                </div>
              ))}
              <button type="button" className={addBtnCls} onClick={addExp}>+ Thêm kinh nghiệm</button>
            </section>

            {/* Education */}
            <section className="mb-6">
              <h2 className={sectionTitleCls}>Học vấn</h2>
              {cvData.educations.map((x, i) => (
                <div key={i} className={cardCls}>
                  <button type="button" className={removeBtnCls + " absolute top-2 right-2"} onClick={() => removeEdu(i)}>✕</button>
                  <input className={inputCls} placeholder="Tên trường" value={x.school} onChange={e => updateEdu(i, "school", e.target.value)} />
                  <input className={`${inputCls} mt-2`} placeholder="Chuyên ngành" value={x.major} onChange={e => updateEdu(i, "major", e.target.value)} />
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <input className={inputCls} placeholder="Năm bắt đầu" value={x.startDate} onChange={e => updateEdu(i, "startDate", e.target.value)} />
                    <input className={inputCls} placeholder="Năm tốt nghiệp" value={x.endDate} onChange={e => updateEdu(i, "endDate", e.target.value)} />
                  </div>
                </div>
              ))}
              <button type="button" className={addBtnCls} onClick={addEdu}>+ Thêm học vấn</button>
            </section>

            {/* Projects */}
            <section className="mb-6">
              <h2 className={sectionTitleCls}>Dự án</h2>
              {cvData.projects.map((x, i) => (
                <div key={i} className={cardCls}>
                  <button type="button" className={removeBtnCls + " absolute top-2 right-2"} onClick={() => removeProj(i)}>✕</button>
                  <input className={inputCls} placeholder="Tên dự án" value={x.name} onChange={e => updateProj(i, "name", e.target.value)} />
                  <textarea className={`${inputCls} mt-2 resize-y min-h-[60px]`} rows={2} placeholder="Mô tả dự án..." value={x.description} onChange={e => updateProj(i, "description", e.target.value)} />
                  <input className={`${inputCls} mt-2`} placeholder="Công nghệ (VD: React, Spring Boot)" value={x.technologies} onChange={e => updateProj(i, "technologies", e.target.value)} />
                  <input className={`${inputCls} mt-2`} placeholder="Link dự án (tuỳ chọn)" value={x.link} onChange={e => updateProj(i, "link", e.target.value)} />
                </div>
              ))}
              <button type="button" className={addBtnCls} onClick={addProj}>+ Thêm dự án</button>
            </section>

            {/* Color */}
            <section className="mb-6">
              <h2 className={sectionTitleCls}>Màu sắc chủ đạo</h2>
              <div className="flex gap-2 mt-1 flex-wrap">
                {COLOR_OPTIONS.map(opt => (
                  <button key={opt.value} type="button" title={opt.label}
                    onClick={() => setCvData(p => ({ ...p, color: opt.value }))}
                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${cvData.color === opt.value ? 'border-slate-700 scale-110' : 'border-transparent'}`}
                    style={{ background: opt.value }} />
                ))}
              </div>
            </section>

            <button type="submit" disabled={saveStatus === 'saving'}
              className="w-full py-3 bg-violet-700 text-white rounded-xl text-sm font-bold cursor-pointer shadow-[0_4px_14px_rgba(124,58,237,0.35)] hover:opacity-90 active:scale-[0.98] transition-all mt-1 disabled:opacity-60 disabled:cursor-not-allowed">
              {saveStatus === 'saving' && '⏳ Đang lưu...'}
              {saveStatus === 'success' && '✅ Đã lưu thành công!'}
              {saveStatus === 'error' && '❌ Lỗi — thử lại'}
              {saveStatus === 'idle' && (selectedCvId ? 'Lưu thay đổi' : '＋ Tạo & Lưu CV')}
            </button>
          </form>
        </aside>

        {/* ── Right: preview or AI ── */}
        {(isPreviewVisible || isAiReviewVisible) && (
          <div className={`py-1 w-full ${isAiReviewVisible ? 'lg:sticky lg:top-6 lg:max-h-[calc(100vh-48px)] flex flex-col' : ''}`} aria-label={isPreviewVisible ? "Xem trước CV" : "AI Nhận xét"} role="region">

            {/* Preview View */}
            {isPreviewVisible && (
              <div ref={previewRef} className="bg-white rounded-[20px] shadow-[0_8px_40px_rgba(0,0,0,0.1)] overflow-hidden min-h-[700px]">

                {/* Header */}
                <div className="[background:var(--cv-accent,#7c3aed)] flex items-center gap-4 px-8 py-7 text-white transition-colors duration-300">
                  <div className="w-14 h-14 rounded-full bg-white/25 flex items-center justify-center text-[22px] font-extrabold shrink-0">
                    {cvData.fullName ? cvData.fullName[0].toUpperCase() : "?"}
                  </div>
                  <div>
                    <p className="text-[22px] font-extrabold mb-0.5">{cvData.fullName || "Họ và tên"}</p>
                    <p className="text-[13px] opacity-85">{cvData.jobTitle || "Vị trí"}</p>
                  </div>
                </div>

                <div className="px-8 py-7 flex flex-col gap-5">

                  {/* Contact */}
                  <section>
                    <h3 className={accentH3}>Liên hệ</h3>
                    <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[13px] text-slate-600">
                      {cvData.email && <li>✉ {cvData.email}</li>}
                      {cvData.phone && <li>📞 {cvData.phone}</li>}
                      {cvData.location && <li>📍 {cvData.location}</li>}
                      {!cvData.email && !cvData.phone && !cvData.location && (
                        <li className="text-slate-300 italic text-xs">Chưa có thông tin</li>
                      )}
                    </ul>
                  </section>

                  {/* Summary */}
                  {cvData.summary && (
                    <section>
                      <h3 className={accentH3}>Giới thiệu</h3>
                      <p className="text-[13px] text-slate-600 leading-relaxed">{cvData.summary}</p>
                    </section>
                  )}

                  {/* Skills */}
                  {cvData.skills.length > 0 && (
                    <section>
                      <h3 className={accentH3}>Kỹ năng</h3>
                      <div className="flex flex-wrap gap-2">
                        {cvData.skills.map((s, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                            {s.skillName}{s.level ? ` · ${s.level}` : ""}
                          </span>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Experience */}
                  {cvData.experiences.length > 0 && (
                    <section>
                      <h3 className={accentH3}>Kinh nghiệm làm việc</h3>
                      <div className="flex flex-col gap-4">
                        {cvData.experiences.map((x, i) => (
                          <div key={i}>
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-[13px] font-bold text-slate-900">{x.position || "Vị trí"}</p>
                                <p className="text-[12px] text-slate-500">{x.company}</p>
                              </div>
                              {(x.startDate || x.endDate) && (
                                <span className="text-[11px] text-slate-400 whitespace-nowrap ml-4">
                                  {x.startDate}{x.endDate ? ` – ${x.endDate}` : ""}
                                </span>
                              )}
                            </div>
                            {x.description && <p className="text-[12px] text-slate-600 mt-1 leading-relaxed">{x.description}</p>}
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Education */}
                  {cvData.educations.length > 0 && (
                    <section>
                      <h3 className={accentH3}>Học vấn</h3>
                      <div className="flex flex-col gap-3">
                        {cvData.educations.map((x, i) => (
                          <div key={i} className="flex justify-between items-start">
                            <div>
                              <p className="text-[13px] font-bold text-slate-900">{x.school || "Tên trường"}</p>
                              {x.major && <p className="text-[12px] text-slate-500">{x.major}</p>}
                            </div>
                            {(x.startDate || x.endDate) && (
                              <span className="text-[11px] text-slate-400 whitespace-nowrap ml-4">
                                {x.startDate}{x.endDate ? ` – ${x.endDate}` : ""}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Projects */}
                  {cvData.projects.length > 0 && (
                    <section>
                      <h3 className={accentH3}>Dự án</h3>
                      <div className="flex flex-col gap-4">
                        {cvData.projects.map((x, i) => (
                          <div key={i}>
                            <div className="flex items-center gap-2">
                              <p className="text-[13px] font-bold text-slate-900">{x.name || "Tên dự án"}</p>
                              {x.link && <a href={x.link} target="_blank" rel="noreferrer" className="text-[11px] [color:var(--cv-accent,#7c3aed)] underline">[link]</a>}
                            </div>
                            {x.description && <p className="text-[12px] text-slate-600 mt-0.5 leading-relaxed">{x.description}</p>}
                            {x.technologies && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {x.technologies.split(',').map(t => t.trim()).filter(Boolean).map((t, j) => (
                                  <span key={j} className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">{t}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Placeholder when empty */}
                  {cvData.skills.length === 0 && cvData.experiences.length === 0 && cvData.educations.length === 0 && (
                    <p className="text-slate-300 italic text-xs text-center mt-4">Điền thông tin vào form bên trái để xem bản preview</p>
                  )}

                </div>
              </div>
            )}

            {/* AI Chat View */}
            {isAiReviewVisible && (
              <div className="bg-white rounded-[20px] shadow-[0_8px_40px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col min-h-[600px] h-full flex-1">
                <div className="bg-emerald-600 px-5 py-4 flex justify-between items-center text-white shrink-0">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🤖</span>
                    <div>
                      <h3 className="font-bold text-base">Trợ lý AI</h3>
                      <p className="text-xs text-emerald-100">AI Đánh giá CV</p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-5 bg-slate-50 relative">
                  {isAiLoading ? (
                    <div className="flex flex-col items-center justify-center h-full text-emerald-600 gap-3">
                      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm font-semibold animate-pulse">AI đang phân tích và nhận xét...</span>
                    </div>
                  ) : (
                    <div className="prose prose-sm prose-emerald max-w-none text-slate-700 whitespace-pre-wrap leading-relaxed">
                      {aiFeedback || "Chưa có nhận xét nào."}
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </>
  );
}

export default function CvEditorPage() {
  return (
    <CvProvider>
      <CvEditorContent />
    </CvProvider>
  );
}
