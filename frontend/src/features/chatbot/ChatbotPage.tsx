import { useState, useRef, useEffect, useCallback } from "react";
import { Bot, Send, Trash2, User, Loader2, Sparkles, X } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const API_BASE = "/api/chatbot";

function uid() {
  return Math.random().toString(36).slice(2);
}

/** Build SSE URL for streaming */
function buildStreamUrl(message: string, userId?: string, activeCvId?: number) {
  const params = new URLSearchParams({ message });
  if (userId)     params.set("userId", userId);
  if (activeCvId) params.set("activeCvId", String(activeCvId));
  return `${API_BASE}/stream?${params}`;
}

// ─── Suggestion chips ────────────────────────────────────────────────────────

const SUGGESTIONS = [
  "Phân tích CV của tôi theo tiêu chuẩn ATS",
  "Gợi ý kỹ năng còn thiếu so với JD",
  "Viết lại phần Summary chuyên nghiệp hơn",
  "Tôi muốn xin việc Java Developer, CV phù hợp chưa?",
  "Điểm mạnh và điểm yếu trong CV hiện tại",
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ChatbotPage() {
  const [messages, setMessages]   = useState<Message[]>([]);
  const [input, setInput]         = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const bottomRef  = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLTextAreaElement>(null);
  const esRef      = useRef<EventSource | null>(null);

  // Lấy userId từ localStorage (do auth module lưu)
  const userId = localStorage.getItem("userId") ?? undefined;

  // Auto-scroll khi có message mới
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Cleanup SSE khi unmount
  useEffect(() => () => esRef.current?.close(), []);

  // ── Gửi tin nhắn (SSE streaming) ─────────────────────────────────────────

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      setError(null);
      setInput("");
      inputRef.current?.focus();

      const userMsg: Message = { id: uid(), role: "user", content: trimmed };
      const aiMsg:   Message = { id: uid(), role: "assistant", content: "", isStreaming: true };

      setMessages(prev => [...prev, userMsg, aiMsg]);
      setIsLoading(true);

      // Đóng SSE cũ nếu còn
      esRef.current?.close();

      try {
        const url = buildStreamUrl(trimmed, userId);
        const es  = new EventSource(url);
        esRef.current = es;

        es.addEventListener("token", (e) => {
          setMessages(prev =>
            prev.map(m =>
              m.id === aiMsg.id
                ? { ...m, content: m.content + e.data }
                : m
            )
          );
        });

        es.addEventListener("done", () => {
          setMessages(prev =>
            prev.map(m =>
              m.id === aiMsg.id ? { ...m, isStreaming: false } : m
            )
          );
          setIsLoading(false);
          es.close();
          esRef.current = null;
        });

        es.addEventListener("error", (e: MessageEvent) => {
          setError(e.data ?? "Kết nối bị gián đoạn.");
          setMessages(prev =>
            prev.map(m =>
              m.id === aiMsg.id
                ? { ...m, content: m.content || "⚠️ Có lỗi xảy ra.", isStreaming: false }
                : m
            )
          );
          setIsLoading(false);
          es.close();
          esRef.current = null;
        });

        es.onerror = () => {
          // Connection dropped without error event
          setMessages(prev =>
            prev.map(m =>
              m.id === aiMsg.id && m.content === ""
                ? { ...m, content: "⚠️ Không kết nối được tới server.", isStreaming: false }
                : { ...m, isStreaming: false }
            )
          );
          setIsLoading(false);
          es.close();
          esRef.current = null;
        };
      } catch (err) {
        setError("Không thể kết nối tới chatbot.");
        setIsLoading(false);
      }
    },
    [isLoading, userId]
  );

  // ── Xoá lịch sử ──────────────────────────────────────────────────────────

  const clearHistory = async () => {
    esRef.current?.close();
    setMessages([]);
    setError(null);
    if (userId) {
      await fetch(`${API_BASE}/history?userId=${userId}`, { method: "DELETE" }).catch(() => {});
    }
  };

  // ── Keyboard handler ──────────────────────────────────────────────────────

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // ── Auto-resize textarea ──────────────────────────────────────────────────

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const ta = e.target;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-4xl mx-auto">

      {/* ── Header ── */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-slate-800 text-base leading-tight">
              CV Assistant
            </h1>
            <p className="text-xs text-slate-400">Phân tích & tư vấn CV bằng AI</p>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            onClick={clearHistory}
            title="Xoá lịch sử"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-rose-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Xoá hội thoại
          </button>
        )}
      </div>

      {/* ── Message list ── */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">

        {/* Empty state */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-6 text-center pb-8">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-200">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-700 mb-1">
                Xin chào! Tôi là CV Assistant
              </h2>
              <p className="text-sm text-slate-400 max-w-sm">
                Tôi có thể phân tích CV, đề xuất cải thiện và tư vấn theo tiêu chuẩn ATS.
              </p>
            </div>

            {/* Suggestion chips */}
            <div className="flex flex-wrap gap-2 justify-center max-w-lg">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 transition-all duration-200 shadow-sm"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center mt-0.5 ${
                msg.role === "assistant"
                  ? "bg-gradient-to-br from-emerald-500 to-teal-600 shadow-sm"
                  : "bg-slate-800"
              }`}
            >
              {msg.role === "assistant"
                ? <Bot className="w-4 h-4 text-white" />
                : <User className="w-4 h-4 text-white" />}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-slate-800 text-white rounded-tr-sm"
                  : "bg-white border border-slate-100 text-slate-700 shadow-sm rounded-tl-sm"
              }`}
            >
              {msg.content
                ? <span className="whitespace-pre-wrap">{msg.content}</span>
                : msg.isStreaming
                  ? <span className="flex items-center gap-1.5 text-slate-400">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span className="text-xs">Đang xử lý...</span>
                    </span>
                  : null}

              {/* Streaming cursor */}
              {msg.isStreaming && msg.content && (
                <span className="inline-block w-0.5 h-4 bg-emerald-500 ml-0.5 animate-pulse align-middle" />
              )}
            </div>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* ── Error banner ── */}
      {error && (
        <div className="flex items-center justify-between text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-4 py-2.5 mb-2">
          <span>{error}</span>
          <button onClick={() => setError(null)}><X className="w-3.5 h-3.5" /></button>
        </div>
      )}

      {/* ── Input area ── */}
      <div className="border-t border-slate-100 pt-3">
        <div className="flex items-end gap-2 bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-500/10 transition-all">
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Nhập câu hỏi... (Enter để gửi, Shift+Enter xuống dòng)"
            disabled={isLoading}
            className="flex-1 resize-none bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none disabled:opacity-50 max-h-40 leading-relaxed"
            style={{ height: "24px" }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            className="w-8 h-8 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0 transition-colors shadow-sm"
          >
            {isLoading
              ? <Loader2 className="w-4 h-4 text-white animate-spin" />
              : <Send className="w-4 h-4 text-white" />}
          </button>
        </div>
        <p className="text-center text-[10px] text-slate-400 mt-2">
          AI có thể mắc lỗi. Vui lòng kiểm tra thông tin quan trọng.
        </p>
      </div>
    </div>
  );
}
