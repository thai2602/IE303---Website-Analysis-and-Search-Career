const MY_CVS_STORAGE_KEY = "jobpilot.my-cvs";

export const hasCreatedCv = (): boolean => {
   try {
      const raw = localStorage.getItem(MY_CVS_STORAGE_KEY);
      if (!raw) {
         return false;
      }

      const parsed = JSON.parse(raw) as unknown;
      return Array.isArray(parsed) && parsed.length > 0;
   } catch {
      return false;
   }
};

export const saveCvsToLocalStorage = (cvs: any[]) => {
   try {
      localStorage.setItem(MY_CVS_STORAGE_KEY, JSON.stringify(cvs));
   } catch (err) {
      console.error("Failed to save CVs to localStorage", err);
   }
};

export const getActiveCvId = (): number | null => {
   try {
      const raw = localStorage.getItem(MY_CVS_STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
         return parsed[0].id ?? null;
      }
      return null;
   } catch {
      return null;
   }
};

