import { Link } from '@inertiajs/react';
import React from 'react';
import type { Reservation, AuthUser } from '../../Pages/Mypage/ReservationList';

interface RowProps {
    reservation: Reservation;
    auth_user: AuthUser;
    activeTab: 'upcoming' | 'past';
    processingId: number | null;
    onCancelClick: (id: number) => void;
}

export default function ReservationRow({ reservation, auth_user, activeTab, processingId, onCancelClick }: RowProps) {
    const displayName = reservation.guest_name || auth_user?.name || '未登録';
    const displayTel = reservation.guest_tel || auth_user?.tel || '未登録';

    const renderStatusBadge = (status: number) => {
        if (status === 1) {
            return <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded bg-green-50 text-green-800 border border-green-200">予約確定</span>;
        }

        if (status === 2) {
            return <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">キャンセル済</span>;
        }

        if (status === 3) {
            return <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">宿泊済み</span>;
        }

        return <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded bg-gray-50 text-gray-600 border border-gray-200">その他</span>;
    };

    return (
        <div className="py-6 first:pt-4 last:pb-4">
            {/* 上段：基本情報 */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                <div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-gray-500">予約番号: #{reservation.id}</span>
                        {renderStatusBadge(reservation.status)}
                    </div>
                    <Link
                        href={`/mypage/reservations/${reservation.id}`}
                        className="font-semibold text-neutral-800 dark:text-neutral-200 hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors decoration-blue-500/40"
                    >
                        {reservation.room?.name || 'お部屋情報なし'}
                    </Link>
                    <p className="text-xs text-gray-500 mt-0.5">プラン: {reservation.plan?.name || 'プラン情報なし'}</p>
                </div>
                <div className="sm:text-right text-xs text-gray-400">
                    申込日: {new Date(reservation.created_at).toLocaleDateString()}
                    {reservation.status === 2 && reservation.cancel_date &&(
                        <div className="sm:text-right text-xs text-gray-400">
                            キャンセル日: {new Date(reservation.cancel_date).toLocaleDateString()}
                        </div>
                    )}
                </div>
                
            </div>

            {/* 中段：宿泊日程・料金のグリッド */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 rounded-lg p-4 text-sm">
                <div>
                    <span className="text-xs text-gray-400 block mb-0.5">チェックイン</span>
                    <span className="font-medium text-gray-800">{reservation.reservation_start_date.replace(/-/g, '/')}</span>
                </div>
                <div>
                    <span className="text-xs text-gray-400 block mb-0.5">チェックアウト</span>
                    <span className="font-medium text-gray-800">{reservation.reservation_end_date.replace(/-/g, '/')}</span>
                </div>
                <div>
                    <span className="text-xs text-gray-400 block mb-0.5">ご利用人数</span>
                    <span className="font-medium text-gray-800">{reservation.number} 名様</span>
                </div>
                <div>
                    <span className="text-xs text-gray-400 block mb-0.5">合計料金（税込）</span>
                    <span className="font-bold text-indigo-600 text-base">¥{reservation.total_price.toLocaleString()}</span>
                </div>
            </div>

            {/* 下段：代表者情報 ＋ キャンセルアクション */}
            <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-y-3 text-xs text-gray-500 px-1">
                <div className="flex flex-col sm:flex-row gap-x-6 gap-y-1">
                    <div><span className="text-gray-400">宿泊代表者:</span> {displayName}</div>
                    <div><span className="text-gray-400">ご連絡先:</span> {displayTel}</div>
                </div>
                
                {activeTab === 'upcoming' && reservation.status === 1 && (
                    <button
                        onClick={() => onCancelClick(reservation.id)}
                        disabled={processingId === reservation.id}
                        className="self-end sm:self-auto px-3 py-1.5 bg-white text-red-600 font-medium border border-red-200 rounded-md hover:bg-red-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 transition-colors"
                    >
                        {processingId === reservation.id ? '処理中...' : '予約をキャンセルする'}
                    </button>
                )}
            </div>
        </div>
    );
}
