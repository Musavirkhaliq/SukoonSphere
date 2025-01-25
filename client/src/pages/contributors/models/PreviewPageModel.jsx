import customFetch from '@/utils/customFetch';
import React, { useEffect, useState } from 'react'

const PreviewPageModel = ({ onClose, pageId, type }) => {
    const [pageData, setPageData] = useState(null);
    const handlePreviewPage = async () => {
        try {
            const response = await customFetch.get(`/${type === 'page' ? 'articles/get-article-page' : 'articles/get-article-cover-page'}/${pageId}`);
            
            setPageData(type === "page" ? response.data.page.pageContent : response.data.coverPage.coverPage);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        handlePreviewPage();
    }, [pageId]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center"> {type === 'page' ? 'Page Preview' : 'Cover Page Prview'} </h2>
                        {pageData && (
                            <p className="text-sm text-gray-600">Page {pageData.pageNumber}</p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="prose max-w-none">
                    {pageData && (
                        <div dangerouslySetInnerHTML={{
                            __html: pageData
                        }} />
                    )}
                </div>
            </div>
        </div>
    )
}

export default PreviewPageModel
