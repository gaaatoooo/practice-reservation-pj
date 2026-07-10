import { Head, Link, useForm } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import CancelConfirmModal from '@/components/layout/CancelConfirmModal';
import CheckinConfirmModal from '@/components/layout/CheckinConfirmModal';


// ユーザー情報
interface User {
    name: string;
    email: string;
}

// お部屋情報
interface Room {
    name: string;
}

// プラン情報（マスタ）
interface Plan {
    name: string;
}

// 予約情報
interface Reservation {
    id: number;
    reservation_start_date: string;
    reservation_end_date: string;
    status: number; // 1: 確定, 2: キャンセル済, 3: チェックイン済み
    total_price: number;
    number: number;
    created_at: string;
    user: User;
    room: Room;
    plan?: Plan | null;
}

interface Props {
    reservation: Reservation;
}

export default function ReservationShow({ reservation }: Props) {
    const isCancelled = reservation.status === 2;

    // ⭕️ 1. 遷移元（リファラ）を検知して戻り先を上書き（デフォルトはマイページ予約一覧）
    const [backUrl, setBackUrl] = useState('/user/reservations');
    const [backLabel, setBackLabel] = useState('予約一覧へ戻る');

    useEffect(() => {
        setBackUrl('/mypage/reservations');
        setBackLabel('予約一覧へ戻る');
    }, []);

    // ⭕️ 2. 不足していたモーダル開閉ステートを追加
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);

    // ⭕️ 3. 不足していた各アクション用フォームフックを追加
    const cancelForm = useForm({});
    const checkinForm = useForm({});

    // ⭕️ 2. 日付形式をお知らせやフェアと同様に「YYYY.MM.DD」へ綺麗に整形
    const formattedCheckIn = new Date(reservation.reservation_start_date).toLocaleDateString('ja-JP', {
        year: 'numeric', month: '2-digit', day: '2-digit'
    }).replace(/\//g, '/');

    const formattedCheckOut = new Date(reservation.reservation_end_date).toLocaleDateString('ja-JP', {
        year: 'numeric', month: '2-digit', day: '2-digit'
    }).replace(/\//g, '/');

    // ⭕️ キャンセル実行ハンドラ（パスを /mypage に統一）
    const handleCancelSubmit = () => {
        cancelForm.post(`/mypage/reservations/${reservation.id}/cancel`, {
            preserveScroll: true,
            onSuccess: () => setIsCancelModalOpen(false),
        });
    };
    
    // ⭕️ チェックイン実行ハンドラ（パスを /mypage に統一）
    const handleCheckinSubmit = () => {
        checkinForm.patch(`/mypage/reservations/${reservation.id}/checkin`, {
            preserveScroll: true,
            onSuccess: () => setIsCheckinModalOpen(false),
        });
    };

    console.log(reservation);
    
    return (
        <>
            <Head title={`ご宿泊予約詳細 #${reservation.id}`} />
            
            {/* 💡 引き継ぎ仕様：カード枠のない、背景に溶け込むフルフラットでミニマルな構成 */}
            <div className="p-6 max-w-3xl mx-auto flex flex-col gap-8 py-12 text-sm text-neutral-800 dark:text-neutral-200">
                
                {/* 戻るリンク */}
                <Link 
                    href={backUrl} 
                    className="text-sm font-medium text-neutral-500 hover:text-blue-600 transition-colors self-start flex items-center gap-1"
                >
                    &larr; {backLabel}
                </Link>

                {/* ヘッダー領域 */}
                <div className="flex flex-col gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-6">
                    <div className="flex items-center gap-3">
                        <span className="font-mono text-xs tracking-wider text-neutral-400 dark:text-neutral-500">
                            RESERVATION #{reservation.id}
                        </span>
                        {/* 管理側の分岐ロジックと完全に統一されたステータスバッジ */}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                            reservation.status === 2
                                ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/50'
                                : reservation.status === 3
                                    ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/50'
                                    : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50'
                        }`}>
                            {reservation.status === 2 ? 'キャンセル済' : reservation.status === 3 ? 'チェックイン済み' : '確定（ご予約中）'}
                        </span>
                    </div>
                    <h1 className="text-2xl font-black text-neutral-900 dark:text-neutral-100 leading-snug tracking-tight">
                        ご宿泊予約内容のご確認
                    </h1>
                </div>

                {/* ⭕️ 不足していたキャンセル・チェックインボタンを追加配置 */}
                {!isCancelled && (
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                        {reservation.status !== 3 && (
                            <button
                                type="button"
                                onClick={() => setIsCheckinModalOpen(true)}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg shadow-sm transition-colors"
                            >
                                チェックインする
                            </button>
                        )}
                        {reservation.status !== 3 && (
                            <button
                                type="button"
                                onClick={() => setIsCancelModalOpen(true)}
                                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg shadow-sm transition-colors"
                            >
                                予約をキャンセルする
                            </button>
                        )}
                    </div>
                )}

                {/* 予約基本詳細セクション（1列のフラットな羅列でミニマルさを追求） */}
                <div className="flex flex-col gap-6">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 border-b border-neutral-100 dark:border-neutral-900 pb-4">
                        <span className="font-bold text-neutral-400 dark:text-neutral-500 text-xs tracking-wider uppercase">ご宿泊用客室</span>
                        <span className="sm:col-span-2 text-base font-bold text-neutral-900 dark:text-neutral-100">{reservation.room?.name}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 border-b border-neutral-100 dark:border-neutral-900 pb-4">
                        <span className="font-bold text-neutral-400 dark:text-neutral-500 text-xs tracking-wider uppercase">選択プラン</span>
                        <span className="sm:col-span-2 font-medium">{reservation.plan?.name || 'プラン選択なし'}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 border-b border-neutral-100 dark:border-neutral-900 pb-4">
                        <span className="font-bold text-neutral-400 dark:text-neutral-500 text-xs tracking-wider uppercase">日程 / 期間</span>
                        <span className="sm:col-span-2 font-mono font-semibold text-neutral-900 dark:text-neutral-100">
                            {formattedCheckIn} &mdash; {formattedCheckOut}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 border-b border-neutral-100 dark:border-neutral-900 pb-4">
                        <span className="font-bold text-neutral-400 dark:text-neutral-500 text-xs tracking-wider uppercase">ご宿泊人数</span>
                        <span className="sm:col-span-2 font-medium font-mono">{reservation.number} 名様</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 border-b border-neutral-100 dark:border-neutral-900 pb-4">
                        <span className="font-bold text-neutral-400 dark:text-neutral-500 text-xs tracking-wider uppercase">決済合計金額</span>
                        <span className="sm:col-span-2 text-xl font-black text-neutral-900 dark:text-neutral-100 font-mono">
                            ¥{reservation.total_price.toLocaleString()} 
                            <span className="text-xs text-neutral-400 dark:text-neutral-500 font-normal ml-1">（消費税・サービス料込）</span>
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 pb-4">
                        <span className="font-bold text-neutral-400 dark:text-neutral-500 text-xs tracking-wider uppercase">ご登録名義</span>
                        <span className="sm:col-span-2 font-medium">{reservation.user?.name} 様</span>
                    </div>
                </div>

                {/* ご案内・フッターアクション領域 */}
                <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="text-xs text-neutral-400 dark:text-neutral-500 font-medium max-w-xl leading-relaxed">
                        ご予約内容の変更・手動でのキャンセルを希望される場合は、お手数ですがお問合せフォーム、またはお電話にてフロントスタッフまで直接お申し付けください。
                    </div>
                    <Link
                        href="/user/contact"
                        className="inline-flex items-center justify-center px-4 py-2 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 dark:text-neutral-900 text-white font-bold text-xs rounded-lg shadow-sm transition-colors whitespace-nowrap self-end sm:self-auto"
                    >
                        この予約について問合せる
                    </Link>
                </div>
                <CancelConfirmModal 
                    isOpen={isCancelModalOpen}
                    onClose={() => setIsCancelModalOpen(false)}
                    onConfirm={handleCancelSubmit}
                    processing={cancelForm.processing}
                    reservationId={reservation.id}
                />
                <CheckinConfirmModal
                    isOpen={isCheckinModalOpen}
                    onClose={() => setIsCheckinModalOpen(false)}
                    onConfirm={handleCheckinSubmit}
                    processing={checkinForm.processing}
                    reservationId={reservation.id}
                />
            </div>
        </>
    );
}
