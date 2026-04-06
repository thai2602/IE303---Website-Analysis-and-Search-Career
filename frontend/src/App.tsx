import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";
import HomePage from "./features/home/HomePage";
import JobsPage from "./features/jobs/JobsPage";
import CompaniesPage from "./features/companies/CompaniesPage";
import CvTemplatesPage from "./features/cv-builder/CvTemplatesPage";
import UtilitiesPage from "./features/utilities/UtilitiesPage";
import HandbookPage from "./features/blog/HandbookPage";
import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";

function ScrollToTop() {
   const location = useLocation();

   useEffect(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
   }, [location.pathname]);

   return null;
}

function SiteLayout() {
   return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
         <div className="bg-grid pointer-events-none fixed inset-0 -z-10 opacity-40" />
         <ScrollToTop />
         <Header />
         <main className="max-w-[1200px] mx-auto px-4 md:px-6 py-10 md:py-14">
            <Outlet />
         </main>
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
            <Route path="/cong-ty" element={<CompaniesPage />} />
            <Route path="/cv-mau" element={<CvTemplatesPage />} />
            <Route path="/tien-ich" element={<UtilitiesPage />} />
            <Route path="/cam-nang" element={<HandbookPage />} />
            <Route path="/dang-nhap" element={<LoginPage />} />
            <Route path="/dang-ky" element={<RegisterPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
         </Route>
      </Routes>
   );
}
