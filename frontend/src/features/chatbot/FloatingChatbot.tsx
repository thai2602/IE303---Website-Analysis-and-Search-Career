import { ChatWindow } from './ChatWindow';
import { useCvContext } from '../cv-builder/CvContext';

export const FloatingChatbot = () => {
    const { isChatOpen: isOpen, setIsChatOpen: setIsOpen } = useCvContext();

    return (
        <div className="fixed bottom-[100px] right-6 z-50 flex flex-col items-end">
            {/* Chat Panel */}
            <div 
                className={`transition-all duration-300 ease-in-out origin-bottom-right mb-4 ${
                    isOpen 
                        ? 'opacity-100 scale-100 pointer-events-auto translate-y-0' 
                        : 'opacity-0 scale-95 pointer-events-none translate-y-4'
                }`}
                style={{ width: '380px', height: '600px', maxHeight: 'calc(100vh - 120px)' }}
            >
                {/* Header for Chat Panel */}
                <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden w-full h-full flex flex-col">
                    <div className="bg-violet-600 px-4 py-3 flex justify-between items-center text-white shrink-0">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">🤖</span>
                            <div>
                                <h3 className="font-bold text-sm">Trợ lý AI</h3>
                                <p className="text-[11px] text-violet-200">Hỗ trợ viết CV chuyên nghiệp</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:bg-violet-700 p-1.5 rounded-lg transition-colors"
                            aria-label="Đóng cửa sổ chat"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    
                    {/* ChatWindow container */}
                    <div className="flex-1 overflow-hidden relative">
                        {/* Wrapper to override ChatWindow's internal border/rounded styling slightly if needed */}
                        <div className="absolute inset-0 [&>div]:rounded-none [&>div]:border-none [&>div]:shadow-none">
                            <ChatWindow />
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Action Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-violet-600 hover:bg-violet-700 text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(124,58,237,0.4)] transition-transform hover:scale-105 active:scale-95"
                aria-label="Mở trợ lý AI"
            >
                {isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                )}
            </button>
        </div>
    );
};

export default FloatingChatbot;
