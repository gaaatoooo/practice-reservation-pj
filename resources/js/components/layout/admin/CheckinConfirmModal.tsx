import React from 'react';

interface CheckinConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    processing: boolean;
    reservationId: number;
}

export default function CheckinConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    processing,
    reservationId,
}: CheckinConfirmModalProps) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-sm w-full p-6 space-y-4 mx-4">
                <div className="space-y-2">
                    <h4 className="text-base font-bold text-slate-900">チェックイン処理の実行</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">
                        予約 #{reservationId} を「チェックイン済み」ステータスに変更します。この処理を実行してよろしいですか？
                    </p>
                </div>
                <div className="flex justify-end gap-2.5 text-xs font-bold">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={processing}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors disabled:opacity-50"
                    >
                        キャンセル
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={processing}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-50 text-white rounded-lg shadow-sm transition-colors disabled:opacity-50"
                    >
                        {processing ? '処理中...' : '実行する'}
                    </button>
                </div>
            </div>
        </div>
    );
}
