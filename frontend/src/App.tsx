import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";
import HomePage from "./features/home/HomePage";
import JobsPage from "./features/jobs/JobsPage";
import CompaniesPage from "./features/companies/CompaniesPage";
import CvTemplatesPage from "./features/cv-builder/CvTemplatesPage";
import CvEditorPage from "./features/cv-builder/CvEditorPage";
import UtilitiesPage from "./features/utilities/UtilitiesPage";
import HandbookPage from "./features/blog/HandbookPage";
import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";
import UserProfilePage from "./features/auth/UserProfilePage";
import AppliedJobsPage from "./features/jobs/AppliedJobsPage";
import JobDetailPage from "./features/jobs/JobDetailPage";
import MyCvsPage from "./features/cv-builder/MyCvsPage";
import GlobalSavedTray from "./components/GlobalSavedTray";
import ChatbotPage from "./features/chatbot/ChatbotPage";
import CompanyDetailPage from "./features/companies/CompanyDetailPage";

function ScrollToTop() {
   const location = useLocation();

   useEffect(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
   }, [location.pathname]);

   return null;
}

function SiteLayout() {
   return (
      <div className="min-h-screen bg-white text-gray-900 flex flex-col">
         <div className="pointer-events-none fixed inset-0 -z-10 opacity-40" />
         <ScrollToTop />
         <Header />
         <main className="mx-auto max-w-[1200px] w-full px-4 py-8 md:px-6 md:py-14 flex-grow">
            <Outlet />
         </main>
         <GlobalSavedTray />
         <Footer />
      </div>
   );
}

export default function App() {
   return (
      <Routes>
         <Route element={<SiteLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/tim-viec" element={<JobsPage />} />
            <Route path="/tim-viec/:jobSlug" element={<JobDetailPage />} />
            <Route path="/cong-ty" element={<CompaniesPage />} />
            <Route path="/cong-ty/:companySlug" element={<CompanyDetailPage />} />
            <Route path="/cv-mau" element={<CvTemplatesPage />} />
            <Route path="/tien-ich" element={<UtilitiesPage />} />
            <Route path="/cam-nang" element={<HandbookPage />} />
            <Route path="/dang-nhap" element={<LoginPage />} />
            <Route path="/dang-ky" element={<RegisterPage />} />
            <Route path="/ho-so-nguoi-dung" element={<UserProfilePage />} />
            <Route path="/cv-cua-toi" element={<MyCvsPage />} />
            <Route path="/cong-viec-da-ung-tuyen" element={<AppliedJobsPage />} />
            <Route path="/chatbot" element={<ChatbotPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
         </Route>
         
         {/* Fullscreen layout for CV Editor */}
         <Route path="/cv-editor" element={<CvEditorPage />} />
         <Route path="/cv-cua-toi/chinh-sua/:id" element={<CvEditorPage />} />
      </Routes>
   );
}
