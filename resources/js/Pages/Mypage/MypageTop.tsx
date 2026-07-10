import { Head, Link, usePage } from '@inertiajs/react';
import React from 'react';
import ReservationRow from '@/components/layout/ReservationRow';
import { edit } from '@/routes/profile';
import type { Auth } from '@/types';
import type { Reservation, AuthUser } from './ReservationList';

type ExtendedUser = Auth['user'] & {
    role: number | string;
};

interface Props {
    reservations: Reservation[];
    auth_user: AuthUser;
}

interface PageProps {
    auth: Omit<Auth, 'user'> & { user: ExtendedUser };
    [key: string]: any;
}

export default function MypageTop({ reservations = [], auth_user }: Props) {
    // ⭕️ 1. Inertiaの共通Propsからログインユーザー情報を取得
    const { auth } = usePage<PageProps>().props;
    
    // ユーザーかどうかの判定（role が 1 の場合をユーザーと定義。環境に合わせて適宜調整してください）
    const isUser = Number(auth.user?.role) === 1;

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 antialiased">
            <Head title="マイページトップ" />

            {/* ヘッダー */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <h1 className="text-lg font-bold text-gray-900 tracking-tight">マイページ</h1>
                    <Link href="/user/dashboard" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                        ← ダッシュボードへ戻る
                    </Link>
                </div>
            </header>

            {/* メインコンテンツ */}
            <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
                {/* ユーザーウェルカムエリア */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{auth_user?.name || 'ゲスト'} 様のマイページ</h2>
                        <p className="text-xs text-gray-500 mt-1">ご登録の電話番号: {auth_user?.tel || '未登録'}</p>
                    </div>
                    {/* ⭕️ プロフィール変更画面（Settings）への遷移ボタン */}
                    <Link 
                        href={edit()}
                        className="inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-300 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm gap-2"
                    >
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        会員情報の確認・変更
                    </Link>
                </div>

                {isUser && (
                    <>
                        {/* 直近の予約プレビューエリア */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-base font-bold text-gray-900 tracking-tight">直近のご予約状況（最大3件）</h3>
                                {/* ⭕️ すべての履歴一覧へ移動するボタン */}
                                {reservations.length > 0 && (
                                    <Link 
                                        href="/mypage/reservations" 
                                        className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 transition-colors flex items-center gap-0.5"
                                    >
                                        すべての予約履歴を見る →
                                    </Link>
                                )}
                            </div>

                            <div className="bg-white border border-gray-200 rounded-xl px-6 py-2 shadow-sm">
                                {reservations.length === 0 ? (
                                    <div className="py-12 text-center text-gray-500 text-sm">現在、登録されている予約情報はありません。</div>
                                ) : (
                                    <div className="divide-y divide-gray-100">
                                        {reservations.map((reservation) => (
                                            <ReservationRow
                                                key={reservation.id}
                                                reservation={reservation}
                                                auth_user={auth_user}
                                                activeTab="upcoming" // トップ画面では簡易表示のため一律upcoming扱いにし、キャンセルは詳細画面側で行わせる安全設計
                                                processingId={null}
                                                onCancelClick={() => {
                                                    // 誤操作防止のため、詳細履歴リンクへ誘導
                                                    window.location.href = '/mypage/reservations';
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
