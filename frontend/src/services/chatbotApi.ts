import { ChatRequest, ChatResponse } from '../utils/chatbot';

const API_BASE_URL = import.meta.env.VITE_API_URL + '/api/chatbot';

export const chatApi = {
    sendMessage: async (message: string): Promise<string> => {
        const response = await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message } as ChatRequest),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data: ChatResponse = await response.json();
        return data.reply;
    },
};
