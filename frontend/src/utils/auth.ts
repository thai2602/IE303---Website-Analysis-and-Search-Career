export interface AuthUser {
   name: string;
   email: string;
   avatarDataUrl?: string;
   phone?: string;
   hometown?: string;
   gender?: "Nam" | "Nữ" | "Khác";
   age?: number;
   password?: string;
}

const AUTH_USER_STORAGE_KEY = "jobpilot.auth.user";
const AUTH_USER_CHANGE_EVENT = "jobpilot:auth-user-changed";

function emitAuthUserChanged() {
   window.dispatchEvent(new Event(AUTH_USER_CHANGE_EVENT));
}

export function readAuthUser(): AuthUser | null {
   const raw = localStorage.getItem(AUTH_USER_STORAGE_KEY);

   if (!raw) {
      return null;
   }

   try {
      const parsed = JSON.parse(raw) as AuthUser;
      if (!parsed?.name || !parsed?.email) {
         return null;
      }

      return parsed;
   } catch {
      return null;
   }
}

export function setAuthUser(user: AuthUser) {
   localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
   emitAuthUserChanged();
}

export function updateAuthUser(fields: Partial<AuthUser>) {
   const current = readAuthUser();
   if (!current) {
      return;
   }

   setAuthUser({
      ...current,
      ...fields,
   });
}

export function clearAuthUser() {
   localStorage.removeItem(AUTH_USER_STORAGE_KEY);
   emitAuthUserChanged();
}

export function subscribeAuthUserChange(onChange: (user: AuthUser | null) => void) {
   const handler = () => {
      onChange(readAuthUser());
   };

   window.addEventListener(AUTH_USER_CHANGE_EVENT, handler);
   window.addEventListener("storage", handler);

   return () => {
      window.removeEventListener(AUTH_USER_CHANGE_EVENT, handler);
      window.removeEventListener("storage", handler);
   };
}
