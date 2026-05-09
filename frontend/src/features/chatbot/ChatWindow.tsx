import { useState, useEffect } from 'react';
import { useChatLogic } from '../../hooks/useChatLogic';
import { ChatMessage } from './ChatMessage';
import { Loader } from '../../components/Loader';
import { useCvContext } from '../cv-builder/CvContext';

export const ChatWindow = () => {
    const { messages, isLoading, sendMessage } = useChatLogic();
    const [input, setInput] = useState('');
    const { autoMessage, setAutoMessage } = useCvContext();

    useEffect(() => {
        if (autoMessage) {
            sendMessage(autoMessage);
            setAutoMessage(null);
        }
    }, [autoMessage, sendMessage, setAutoMessage]);

    const handleSend = () => {
        if (!input.trim()) return;
        sendMessage(input);
        setInput('');
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
                {messages.length === 0 && (
                    <div className="text-center text-gray-400 mt-10">
                        Bắt đầu trò chuyện với AI để được tư vấn CV!
                    </div>
                )}
                {messages.map((msg, idx) => (
                    <ChatMessage key={idx} role={msg.role} content={msg.content} />
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <Loader />
                    </div>
                )}
            </div>
            <div className="p-3 border-t border-gray-200 bg-white flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Hỏi về cách cải thiện CV của bạn..."
                    className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                />
                <button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                    Gửi
                </button>
            </div>
        </div>
    );
};
