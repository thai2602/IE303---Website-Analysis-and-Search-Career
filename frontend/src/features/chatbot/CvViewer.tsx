import { useFileUpload } from '../../hooks/useFileUpload';

export const CvViewer = () => {
    const { file, isUploading, uploadError, handleFileChange, uploadFile } = useFileUpload();

    return (
        <div className="flex flex-col h-full bg-white rounded-lg shadow-md border border-gray-200 p-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">CV Của Bạn</h2>
            
            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
                <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M28 8H12a4 4 0 00-4 4v24a4 4 0 004 4h24a4 4 0 004-4V20L28 8z" />
                    </svg>
                    <div className="mt-4 flex text-sm text-gray-600 justify-center">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 px-2 py-1">
                            <span>Tải CV lên</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
                        </label>
                        <p className="pl-1 pt-1">hoặc kéo thả vào đây</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">PDF, DOC up to 5MB</p>
                </div>
                
                {file && (
                    <div className="mt-6 w-full max-w-sm">
                        <div className="flex items-center justify-between p-3 bg-white border rounded-md shadow-sm">
                            <div className="truncate flex-1 pr-3 text-sm font-medium text-gray-700">
                                {file.name}
                            </div>
                            <button
                                onClick={uploadFile}
                                disabled={isUploading}
                                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50 transition-colors whitespace-nowrap"
                            >
                                {isUploading ? 'Đang tải...' : 'Xác nhận'}
                            </button>
                        </div>
                    </div>
                )}
                
                {uploadError && (
                    <p className="mt-3 text-sm text-red-600">{uploadError}</p>
                )}
            </div>
            
            <div className="mt-4 pt-4 border-t text-sm text-gray-600">
                <p>💡 Mẹo: Hãy tải CV lên để AI có thể phân tích và đưa ra gợi ý trực tiếp dựa trên nội dung CV của bạn.</p>
            </div>
        </div>
    );
};
