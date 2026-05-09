export const ChatMessage = ({ role, content }: { role: 'user' | 'ai'; content: string }) => {
    const isUser = role === 'user';
    return (
        <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                    isUser
                        ? 'bg-blue-600 text-white rounded-br-sm'
                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm'
                }`}
            >
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{content}</p>
            </div>
        </div>
    );
};
