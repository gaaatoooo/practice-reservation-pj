import React from 'react';

interface ModalProps {
    targetId: number | null;
    onClose: () => void;
    onConfirm: () => void;
}

export default function CancelModal({ targetId, onClose, onConfirm }: ModalProps) {
    if (targetId === null) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* 背景（領域外クリックで閉じる） */}
            <div 
                className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            
            {/* モーダル本体 */}
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative z-10 transform transition-all animate-fade-in-up">
                <div className="flex items-center gap-3 text-red-600 mb-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h3 className="text-lg font-bold text-gray-900">ご予約のキャンセル確認</h3>
                </div>
                
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                    この予約（予約番号: #{targetId}）をキャンセルしてもよろしいですか？<br />
                    <span className="text-red-500 font-medium mt-1 block">※この操作は取り消しできず、空室は即時開放されます。</span>
                </p>
                
                <div className="flex justify-end gap-3 text-sm">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 transition-colors"
                    >
                        閉じる
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 shadow-sm transition-colors"
                    >
                        キャンセルする
                    </button>
                </div>
            </div>
        </div>
    );
}
