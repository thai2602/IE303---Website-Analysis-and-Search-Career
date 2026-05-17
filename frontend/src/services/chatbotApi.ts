const API_BASE_URL = import.meta.env.VITE_API_URL + '/api/chatbot';

export interface ChatRequest {
  message: string;
  userId?: string;
  activeCvId?: number;
}

export interface ChatResponse {
  reply: string;
}

/** Blocking POST — fallback khi SSE không khả dụng */
export const chatApi = {
  sendMessage: async (message: string, userId?: string, activeCvId?: number): Promise<string> => {
    const body: ChatRequest = { message };
    if (userId)     body.userId = userId;
    if (activeCvId) body.activeCvId = activeCvId;

    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) throw new Error(`Chat API error: ${response.status}`);
    const data: ChatResponse = await response.json();
    return data.reply;
  },
};

/**
 * SSE Streaming helper — gọi GET /api/chatbot/stream
 * Trả về EventSource để caller tự quản lý lifecycle.
 *
 * @param message   Nội dung tin nhắn
 * @param onToken   Callback mỗi khi nhận được token mới
 * @param onDone    Callback khi stream hoàn thành
 * @param onError   Callback khi có lỗi
 * @param userId    Memory ID phân tách per-user
 * @param activeCvId  CV đang mở — backend sẽ inject vào context AI
 * @returns Hàm cleanup để đóng EventSource
 */
export function streamChat(
  message: string,
  onToken: (token: string) => void,
  onDone: () => void,
  onError: (err: string) => void,
  userId?: string,
  activeCvId?: number,
): () => void {
  const abortController = new AbortController();
  const body: ChatRequest = { message };
  if (userId) body.userId = userId;
  if (activeCvId) body.activeCvId = activeCvId;

  const token = localStorage.getItem("accessToken");
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  fetch(`${API_BASE_URL}/stream`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    signal: abortController.signal
  }).then(async (response) => {
    if (!response.ok) {
      throw new Error(`Stream API error: ${response.status}`);
    }
    const reader = response.body?.getReader();
    if (!reader) throw new Error("No reader");
    const decoder = new TextDecoder("utf-8");
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      // Tách ra từng SSE event bằng dấu 2 dòng trống "\n\n"
      const events = buffer.split('\n\n');
      // Giữ lại phần cuối chưa hoàn chỉnh (chưa có \n\n) cho lần đọc tiếp
      buffer = events.pop() ?? '';

      for (const event of events) {
        if (!event.trim()) continue;

        // Đọc event name & data
        let eventName = 'message';
        const dataLines: string[] = [];

        for (const line of event.split('\n')) {
          if (line.startsWith('event:')) {
            eventName = line.slice(6).trim();
          } else if (line.startsWith('data:')) {
            dataLines.push(line.slice(5).trimStart());
          }
        }

        // Nối các dòng data bằng \n để khôi phục xuống dòng
        const data = dataLines.join('\n');

        if (eventName === 'done' || data === '[END]') {
          onDone();
          return;
        } else if (eventName === 'error') {
          onError(data || 'Lỗi kết nối.');
          return;
        } else if (eventName === 'token' || eventName === 'message') {
          if (data) onToken(data);
        }
      }
    }
    onDone();
  }).catch(err => {
    if (err.name === 'AbortError') return;
    onError(err.message);
  });

  return () => abortController.abort();
}

