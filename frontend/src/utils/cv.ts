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
