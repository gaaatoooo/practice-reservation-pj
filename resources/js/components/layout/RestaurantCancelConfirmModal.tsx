import React from 'react';

interface RestaurantCancelConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    processing: boolean;
    reservationId: number;
}

export default function RestaurantCancelConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    processing,
    reservationId,
}: RestaurantCancelConfirmModalProps) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white border border-slate-200 rounded-xl shadow-xl max-w-md w-full overflow-hidden p-6 animate-in zoom-in-95 duration-200">
                <h3 className="text-lg font-bold text-slate-950 mb-2">
                    予約 #{reservationId} をキャンセルしますか？
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                    この操作を実行すると、予約ステータスが「キャンセル済み」に変更されます。この操作は取り消せません。
                </p>

                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                        閉じる
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={processing}
                        className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-sm font-bold shadow-sm transition-colors disabled:opacity-50"
                    >
                        {processing ? '処理中...' : 'はい、キャンセルします'}
                    </button>
                </div>
            </div>
        </div>
    );
}