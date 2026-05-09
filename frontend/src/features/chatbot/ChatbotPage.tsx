import { ChatWindow } from './ChatWindow';
import { CvViewer } from './CvViewer';
import { CvProvider } from '../cv-builder/CvContext';

export const ChatbotPage = () => {
    return (
        <CvProvider>
            <div className="flex flex-col md:flex-row h-[calc(100vh-80px)] max-w-7xl mx-auto p-4 gap-4 bg-gray-50">
                <div className="w-full md:w-1/3 h-full">
                    <CvViewer />
                </div>
                <div className="w-full md:w-2/3 h-full">
                    <ChatWindow />
                </div>
            </div>
        </CvProvider>
    );
};

export default ChatbotPage;
