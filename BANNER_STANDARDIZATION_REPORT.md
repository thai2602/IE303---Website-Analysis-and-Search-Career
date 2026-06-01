# Banner/Hero Heading Standardization Report

## PageHero Component Status
**Location:** [frontend/src/components/PageHero.tsx](frontend/src/components/PageHero.tsx)

**Current Implementation:**
```jsx
<h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 md:text-5xl">{title}</h1>
```
- **Mobile:** `text-3xl` (30px) 
- **Desktop:** `md:text-5xl` (48px)
- **Font Weight:** `font-bold` (700)
- **Color:** `text-gray-900` (dark gray)
- **Tracking:** `tracking-tight`

**Status:** ⚠️ **NOT USED** - None of the main pages use this component for their page headers

---

## Current Usage Summary

| Page | Component/Approach | Location | Desktop Size | Mobile Size | Font Weight | Color |
|------|-------------------|----------|--------------|------------|------------|-------|
| **JobsPage** | Custom banner | [L447](frontend/src/features/jobs/JobsPage.tsx#L447) | text-5xl (48px) | text-3xl (30px) | font-black (900) | white |
| **CompaniesPage** | Image banner + h2 | [L740](frontend/src/features/companies/CompaniesPage.tsx#L740) | 32px | 32px | 800 | white |
| **HomePage** | Custom banner | [L475](frontend/src/features/home/HomePage.tsx#L475) | 48px | 24px | font-bold (700) | slate-900 |
| **CvTemplatesPage** | Custom banner | [L358](frontend/src/features/cv-builder/CvTemplatesPage.tsx#L358) | text-5xl (48px) | text-3xl (30px) | font-black (900) | white |
| **UtilitiesPage** | Custom banner | [L286](frontend/src/features/utilities/UtilitiesPage.tsx#L286) | text-5xl (48px) | text-3xl (30px) | font-black (900) | white |
| **HandbookPage** | Custom banner | [L295](frontend/src/features/blog/HandbookPage.tsx#L295) | 36px | 36px | 800 | white |

---

## Detailed Analysis

### 1. **JobsPage.tsx** (Jobs Listing)
**File:** [frontend/src/features/jobs/JobsPage.tsx](frontend/src/features/jobs/JobsPage.tsx#L440-L455)

**Banner Type:** Custom gradient banner (dark gradient)

**H1 Implementation:**
```jsx
<h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
   Khám phá cơ hội nghề nghiệp <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">bứt phá tương lai</span>
</h1>
```

**Font Specifications:**
- **Mobile (text-3xl):** 30px
- **Desktop/Tablet (sm:text-5xl):** 48px
- **Font Weight:** `font-black` (900)
- **Color:** white with gradient accent on span
- **Letter Spacing:** `tracking-tight`
- **Line Height:** `leading-tight`

---

### 2. **CompaniesPage.tsx** (Companies Listing)
**File:** [frontend/src/features/companies/CompaniesPage.tsx](frontend/src/features/companies/CompaniesPage.tsx#L734-L750)

**Banner Type:** Rotating image banner with overlay

**H2 Implementation** (Note: Uses `<h2>` not `<h1>`):
```jsx
<h2 style={{ 
   marginTop: "16px", 
   marginBottom: "12px", 
   fontSize: "32px", 
   fontWeight: 800, 
   lineHeight: 1.05, 
   color: "#ffffff" 
}}>
   {companyBannerItems[bannerIndex].title}
</h2>
```

**Font Specifications:**
- **Font Size:** 32px (both mobile and desktop)
- **Font Weight:** 800
- **Color:** white (#ffffff)
- **Line Height:** 1.05
- **Margin:** 16px top, 12px bottom

**Issue:** ⚠️ Uses `<h2>` instead of `<h1>` - should be semantic `<h1>` for main page heading

---

### 3. **HomePage.tsx** (Home/Landing Page)
**File:** [frontend/src/features/home/HomePage.tsx](frontend/src/features/home/HomePage.tsx#L473-L485)

**Banner Type:** Custom gradient section with stats cards

**H1 Implementation:**
```jsx
<h1 className="text-[24px] md:text-[48px] font-bold tracking-tight text-slate-900 leading-tight">
   Ứng tuyển nhanh, việc làm tốt
</h1>
```

**Font Specifications:**
- **Mobile (text-[24px]):** 24px ⚠️ (smallest among all pages)
- **Desktop (md:text-[48px]):** 48px
- **Font Weight:** `font-bold` (700) ⚠️ (lightest weight)
- **Color:** `text-slate-900` (dark gray - only page with dark text)
- **Letter Spacing:** `tracking-tight`
- **Line Height:** `leading-tight`

**Issues:** 
- ⚠️ Different color scheme (dark text instead of white)
- ⚠️ Lighter font weight (700 vs 800-900)
- ⚠️ Smallest mobile size (24px)

---

### 4. **CvTemplatesPage.tsx** (CV Templates)
**File:** [frontend/src/features/cv-builder/CvTemplatesPage.tsx](frontend/src/features/cv-builder/CvTemplatesPage.tsx#L355-L370)

**Banner Type:** Custom gradient banner (dark gradient with emerald accents)

**H1 Implementation:**
```jsx
<h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
   Kho CV mẫu <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">chuẩn hóa và chuyên nghiệp</span>
</h1>
```

**Font Specifications:**
- **Mobile (text-3xl):** 30px
- **Desktop (sm:text-5xl):** 48px
- **Font Weight:** `font-black` (900)
- **Color:** white with gradient accent on span
- **Letter Spacing:** `tracking-tight`
- **Line Height:** `leading-tight`

---

### 5. **UtilitiesPage.tsx** (Tools & Utilities)
**File:** [frontend/src/features/utilities/UtilitiesPage.tsx](frontend/src/features/utilities/UtilitiesPage.tsx#L280-L295)

**Banner Type:** Custom gradient banner (dark gradient with emerald accents)

**H1 Implementation:**
```jsx
<h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
   Tiện ích chuyên nghiệp <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">tối ưu lương & phúc lợi</span>
</h1>
```

**Font Specifications:**
- **Mobile (text-3xl):** 30px
- **Desktop (sm:text-5xl):** 48px
- **Font Weight:** `font-black` (900)
- **Color:** white with gradient accent on span
- **Letter Spacing:** `tracking-tight`
- **Line Height:** `leading-tight`

---

### 6. **HandbookPage.tsx** (Blog/Handbook)
**File:** [frontend/src/features/blog/HandbookPage.tsx](frontend/src/features/blog/HandbookPage.tsx#L295-L310)

**Banner Type:** Custom gradient background with positioned text

**H1 Implementation:**
```jsx
<h1 style={{ 
   fontSize: "36px", 
   fontWeight: 800, 
   color: "#fff", 
   letterSpacing: "-0.02em", 
   marginBottom: "10px", 
   fontFamily: 'var(--font-heading)' 
}}>
   Cẩm nang việc làm
</h1>
```

**Font Specifications:**
- **Font Size:** 36px (fixed, no responsive breakpoint)
- **Font Weight:** 800
- **Color:** white (#fff)
- **Letter Spacing:** -0.02em (negative spacing)
- **Font Family:** `var(--font-heading)` (custom CSS variable)
- **Margin:** 10px bottom

**Issues:**
- ⚠️ Fixed size (36px) - not responsive
- ⚠️ Different letter spacing approach (negative vs tight)
- ⚠️ Uses inline styles instead of Tailwind

---

## Inconsistencies Identified

### 1. **Font Weight Inconsistency**
| Page | Weight | Value |
|------|--------|-------|
| JobsPage | font-black | 900 ✓ |
| CompaniesPage | inline | 800 |
| **HomePage** | font-bold | **700** ⚠️ |
| CvTemplatesPage | font-black | 900 ✓ |
| UtilitiesPage | font-black | 900 ✓ |
| HandbookPage | inline | 800 |

### 2. **Font Size Inconsistency**
**Desktop sizes vary:**
- HomePage: 48px (highest)
- JobsPage: 48px (text-5xl)
- CvTemplatesPage: 48px (text-5xl)
- UtilitiesPage: 48px (text-5xl)
- HandbookPage: 36px ⚠️ (lowest)
- CompaniesPage: 32px ⚠️ (lowest on actual heading)

**Mobile sizes vary:**
- HomePage: 24px ⚠️ (smallest)
- JobsPage: 30px (text-3xl)
- CvTemplatesPage: 30px (text-3xl)
- UtilitiesPage: 30px (text-3xl)
- HandbookPage: 36px (fixed)
- CompaniesPage: 32px (fixed)

### 3. **Color Inconsistency**
- HomePage: **dark text** (`text-slate-900`) ⚠️
- All others: **white text**

### 4. **Styling Approach**
- JobsPage, CvTemplatesPage, UtilitiesPage: **Tailwind classes**
- HomePage: **Tailwind with arbitrary values** (`text-[24px]`)
- CompaniesPage, HandbookPage: **Inline styles**

### 5. **Responsive Approach**
- Most pages: Use `sm:` breakpoint (640px)
- HomePage: Uses `md:` breakpoint (768px)
- HandbookPage, CompaniesPage: No responsive breakpoint

### 6. **PageHero Component**
- **Defined:** Yes, at [frontend/src/components/PageHero.tsx](frontend/src/components/PageHero.tsx)
- **Used:** No - not imported or used in any of these pages

---

## Recommendations

### Standardization Strategy

**Option 1: Use Updated PageHero Component** (Recommended)
Update [PageHero.tsx](frontend/src/components/PageHero.tsx) to match the modern style used elsewhere:
```jsx
export default function PageHero({ title, subtitle }: PageHeroProps) {
   return (
      <section className="relative rounded-[32px] overflow-hidden bg-gradient-to-br from-slate-950 via-emerald-950/70 to-slate-950 px-6 sm:px-12 py-16 sm:py-20 shadow-[0_28px_80px_rgba(4,120,87,0.15)] border border-emerald-900/30">
         <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl" />
         <div className="absolute -bottom-20 left-1/4 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl" />
         
         <div className="relative max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
               {title}
            </h1>
            <p className="text-[14px] sm:text-[16px] text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
               {subtitle}
            </p>
         </div>
      </section>
   );
}
```

**Standard Specs to Apply:**
- **Mobile h1:** `text-3xl` (30px)
- **Desktop h1:** `sm:text-5xl` (48px)
- **Font Weight:** `font-black` (900)
- **Color:** `text-white`
- **Letter Spacing:** `tracking-tight`
- **Line Height:** `leading-tight`
- **Approach:** Tailwind classes (not inline styles)

**Pages to Update:**
1. ✅ JobsPage - Already matches standard
2. 🔄 CompaniesPage - Change h2 to h1, update font-weight to 900, add responsive sizing
3. 🔄 HomePage - Change to font-black, add dark gradient background option
4. ✅ CvTemplatesPage - Already matches standard
5. ✅ UtilitiesPage - Already matches standard
6. 🔄 HandbookPage - Convert inline styles to Tailwind, add responsive sizing

---

## Files to Modify

Priority order:
1. **CompaniesPage.tsx** - Use proper h1, update font-weight to 900
2. **HomePage.tsx** - Update font-weight to 900
3. **HandbookPage.tsx** - Convert to Tailwind, add responsive breakpoint
4. **PageHero.tsx** - Update component to modern style (optional, if planning to reuse)
