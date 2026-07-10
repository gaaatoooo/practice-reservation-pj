// resources/js/Pages/Mypage/ReservationList.tsx
import { Head, Link, router, usePage } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';

// 別ファイルに切り出した子コンポーネントをインポート
import CancelModal from '@/components/layout/CancelModal';
import ReservationRow from '@/components/layout/ReservationRow';

// ==========================================
// 型定義 (TypeScript Interface) - 子ファイルへ提供するためexport
// ==========================================
export interface Room {
    id: number;
    name: string;
    price: number;
    capacity: number;
    description: string;
    total_rooms: number;
    status: number;
}
export interface Plan {
    id: number;
    name: string;
    description: string;
}
export interface Reservation {
    id: number;
    user_id: number;
    room_id: number;
    plan_id: number;
    reservation_start_date: string;
    reservation_end_date: string;
    number: number;
    total_price: number;
    status: number;
    guest_name: string | null;
    guest_email: string | null;
    guest_tel: string | null;
    guest_zip: string | null;
    guest_address: string | null;
    guest_birthday: string | null;
    created_at: string;
    updated_at: string;
    cancel_date: string;
    room: Room;
    plan: Plan;
}

export interface AuthUser {
    id: number;
    name: string;
    tel: string | null;
}

interface PageProps {
    flash: {
        success: string | null;
        error: string | null;
    };
    [key: string]: any;
}

interface Props {
    reservations: Reservation[];
    auth_user: AuthUser;
}

// ==========================================
// メイン画面コンポーネント
// ==========================================
export default function ReservationList({ reservations = [], auth_user }: Props) {
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');
    const [processingId, setProcessingId] = useState<number | null>(null);
    const [cancelTargetId, setCancelTargetId] = useState<number | null>(null);
    
    // InertiaのグローバルPropsから直接メッセージを取得
    const page = usePage<PageProps>();
    const flashSuccess = page.props.flash?.success;

    // トーストのローカル非表示コントロール（手動で閉じる、またはタイマー用）
    const [showToast, setShowToast] = useState(false);
    const [displayMessage, setDisplayMessage] = useState('');

    // フラッシュメッセージが切り替わったタイミング（非同期）でのみ表示フラグをONにする
    useEffect(() => {
        if (flashSuccess) {
            const [messageText] = flashSuccess.split('|');
            setDisplayMessage(messageText);

            setShowToast(true);
            
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 4000);
            
            return () => clearTimeout(timer);
        }
    }, [flashSuccess]); // メッセージ文字列の変更のみをトリガーにする

    // 今日の日付を取得 (YYYY-MM-DD 形式)
    const todayStr = new Date().toISOString().split('T');

    // 1. これからの宿泊（確定のみ、かつ今日以降）
    const upcomingReservations = reservations.filter((r) => r.status === 1 && r.reservation_start_date >= todayStr);
    
    // 2. 過去の宿泊（確定のみ、かつ昨日以前）
    const pastReservations = reservations.filter((r) => r.status === 3 && r.reservation_start_date < todayStr);

    // 3. キャンセル済み（日付に関わらず、ステータスが2のものすべて）
    const cancelledReservations = reservations.filter((r) => r.status === 2);

    // タブに応じた表示データの切り替え
    const displayReservations = 
        activeTab === 'upcoming' ? upcomingReservations :
        activeTab === 'past' ? pastReservations : cancelledReservations;

    // キャンセル処理の実行
    const executeCancel = () => {
        if (!cancelTargetId) { 
            return;
        }

        const id = cancelTargetId;
        setCancelTargetId(null);
        setProcessingId(id);

        router.post(`/mypage/reservations/${id}/cancel`, {}, {
            onFinish: () => setProcessingId(null),
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 antialiased relative">
            <Head title="予約履歴一覧" />

            {/* トースト通知（showToastとバックエンドのメッセージが両方揃っている時だけ描画） */}
            {showToast && flashSuccess && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-up">
                    <div className="bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-xl font-medium flex items-center gap-2 border border-emerald-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{displayMessage}</span>
                    </div>
                </div>
            )}

            {/* ヘッダー */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <h1 className="text-lg font-bold text-gray-900 tracking-tight">マイページ</h1>
                    <Link href="/mypage" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                        ← マイページへ戻る
                    </Link>
                </div>
            </header>

            {/* メインコンテンツエリア */}
            <main className="max-w-4xl mx-auto px-4 py-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">予約履歴一覧</h2>
                    <p className="text-sm text-gray-500 mt-1">これまでのご宿泊とこれからの宿泊予定を確認できます。</p>
                </div>

                {/* タブ切り替え */}
                <div className="flex border-b border-gray-200 bg-white px-4 rounded-t-xl border-x border-t">
                    <button 
                        className={`py-4 px-4 font-medium text-sm focus:outline-none transition-colors -mb-px ${activeTab === 'upcoming' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'}`} 
                        onClick={() => setActiveTab('upcoming')}
                    >
                        これからのご宿泊 ({upcomingReservations.length})
                    </button>
                    <button 
                        className={`py-4 px-4 font-medium text-sm focus:outline-none transition-colors -mb-px ${activeTab === 'past' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'}`} 
                        onClick={() => setActiveTab('past')}
                    >
                        過去のご宿泊履歴 ({pastReservations.length})
                    </button>
                    <button 
                        className={`py-4 px-4 font-medium text-sm focus:outline-none transition-colors -mb-px ${activeTab === 'cancelled' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'}`} 
                        onClick={() => setActiveTab('cancelled')}
                    >
                        キャンセル済 ({cancelledReservations.length})
                    </button>
                </div>

                {/* リスト表示エリア */}
                <div className="bg-white border-x border-b rounded-b-xl px-6 py-2 shadow-sm">
                    {displayReservations.length === 0 ? (
                        <div className="py-16 text-center text-gray-500 text-sm">該当する予約情報がありません。</div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {displayReservations.map((reservation) => (
                                <ReservationRow
                                    key={reservation.id}
                                    reservation={reservation}
                                    auth_user={auth_user}
                                    activeTab={activeTab === 'cancelled' ? 'past' : activeTab} // キャンセル済タブでもボタン非表示（past扱い）で安全に描画
                                    processingId={processingId}
                                    onCancelClick={(id) => setCancelTargetId(id)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* 切り出したモーダルコンポーネントの呼び出し */}
            <CancelModal
                targetId={cancelTargetId}
                onClose={() => setCancelTargetId(null)}
                onConfirm={executeCancel}
            />
        </div>
    );
}
