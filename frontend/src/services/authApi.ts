const API_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined)?.trim() || (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() || "http://localhost:8080";

export interface RegisterPayload {
   email: string;
   password: string;
}

export interface LoginPayload {
   email: string;
   password: string;
}

export interface GoogleLoginPayload {
   idToken: string;
}

export interface RegisterResult {
   message: string;
}

export interface LoginResult {
   accessToken: string;
   tokenType: string;
}

async function safeFetch(path: string, payload: unknown): Promise<Response> {
   try {
      return await fetch(`${API_BASE_URL}${path}`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(payload),
      });
   } catch {
      throw new Error(`Không thể kết nối backend tại ${API_BASE_URL}. Hãy kiểm tra backend đã chạy chưa.`);
   }
}

async function parseErrorMessage(response: Response, fallback: string): Promise<string> {

   try {
      const raw = await response.text();
      if (!raw.trim()) {
         return fallback;
      }

      let data: unknown = raw;
      try {
         data = JSON.parse(raw);
      } catch {
         data = raw;
      }

      if (typeof data === "string" && data.trim()) {
         return data;
      }

      if (
         typeof data === "object" &&
         data !== null &&
         "message" in data &&
         typeof (data as { message: string }).message === "string" &&
         (data as { message: string }).message.trim()
      ) {
         return (data as { message: string }).message;
      }

      return fallback;
   } catch {
      return fallback;
   }
}

export async function registerUser(payload: RegisterPayload): Promise<RegisterResult> {
   const response = await safeFetch("/api/auth/register", payload);

   if (!response.ok) {
      throw new Error(await parseErrorMessage(response, "Đăng ký thất bại. Vui lòng thử lại."));
   }

   const text = await response.text();
   return { message: text || "User registered successfully" };
}

export async function loginUser(payload: LoginPayload): Promise<LoginResult> {
   const response = await safeFetch("/api/auth/login", payload);

   if (!response.ok) {
      throw new Error(await parseErrorMessage(response, "Đăng nhập thất bại. Vui lòng thử lại."));
   }

   return (await response.json()) as LoginResult;
}

export async function loginWithGoogle(payload: GoogleLoginPayload): Promise<LoginResult> {
   const response = await safeFetch("/api/auth/google", payload);

   if (!response.ok) {
      throw new Error(await parseErrorMessage(response, "Đăng nhập Google thất bại. Vui lòng thử lại."));
   }

   return (await response.json()) as LoginResult;
}
