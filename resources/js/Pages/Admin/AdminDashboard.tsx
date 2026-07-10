import { Head, Link } from '@inertiajs/react';
import { Mail, Calendar, ArrowRight, User, Key, CheckCircle, XCircle, Megaphone, Sparkles } from 'lucide-react';
import React, { useState } from 'react';

interface ContactItem {
    id: number;
    title: string;
    email: string;
    created_at: string;
}

interface ReservationItem {
    id: number;
    reservation_start_date: string;
    reservation_end_date: string;
    total_price: number;
    status: number; // ⭕️ ステータス判定用（例: 1=予定, 2=チェックイン済み, 0=キャンセル済み）
    user?: { name: string };
    room?: { name: string };
}

interface NoticeItem {
    id: number;
    title: string;
    created_at: string;
}

interface FairItem {
    id: number;
    title: string;
    created_at: string;
}

interface Props {
    unrepliedContacts: ContactItem[];
    todayReservations: ReservationItem[];
    notices: NoticeItem[];
    fairs: FairItem[];
}

// ⭕️ タブの型定義
type TabType = 'pending' | 'completed' | 'cancelled';

export default function AdminDashboard({ unrepliedContacts, todayReservations, notices, fairs }: Props) {
    // ⭕️ 現在選択されているタブのステート（デフォルトはチェックイン予定）
    const [activeTab, setActiveTab] = useState<TabType>('pending');

    // ⭕️ フロント側で本日のデータをステータスコードに応じて3つにフィルタリング
    // ※プロジェクトの実際のステータスID（1, 2, 0など）に合わせて数値を調整してください
    const pendingReservations = todayReservations.filter(res => res.status === 1);
    const completedReservations = todayReservations.filter(res => res.status === 2);
    const cancelledReservations = todayReservations.filter(res => res.status === 0);

    // ⭕️ 現在アクティブなタブに表示すべきリストとメッセージの選定
    const getActiveListData = () => {
        switch (activeTab) {
            case 'pending':
                return { list: pendingReservations, emptyMessage: '本日チェックイン予定の予約はありません。' };
            case 'completed':
                return { list: completedReservations, emptyMessage: '本日チェックイン済みの予約はありません。' };
            case 'cancelled':
                return { list: cancelledReservations, emptyMessage: '本日キャンセル済みの予約はありません。' };
        }
    };

    const { list: displayReservations, emptyMessage } = getActiveListData();

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
            <Head title="【管理画面】ダッシュボード" />

            {/* 管理画面ヘッダー */}
            <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="bg-emerald-600 text-xs px-2 py-0.5 rounded font-bold tracking-wider">ADMIN</span>
                        <h1 className="text-md font-bold tracking-tight">管理ダッシュボード</h1>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">
                
                {/* 🔴 セクション1：未返信のお問合せ（最大5件） */}
                <div>
                    <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-2">
                        <div className="flex items-center gap-2">
                            <Mail className="text-rose-500" size={20} />
                            <h2 className="text-lg font-bold tracking-tight text-slate-900">未返信のお問合せ（最新5件）</h2>
                        </div>
                        <Link 
                            href="/admin/contacts" 
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 flex items-center gap-0.5 transition-colors"
                        >
                            お問合せ管理へ <ArrowRight size={14} />
                        </Link>
                    </div>

                    {unrepliedContacts.length === 0 ? (
                        <p className="text-sm text-slate-400 italic py-4">現在、未返信のお問合せはありません。対応完了しています。</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <tbody className="divide-y divide-slate-200 text-sm">
                                    {unrepliedContacts.map((contact) => (
                                        <tr key={contact.id} className="hover:bg-slate-100/50 transition-colors">
                                            <td className="py-3 px-2 text-slate-400 w-12">#{contact.id}</td>
                                            <td className="py-3 px-2 text-slate-500 text-xs w-40">
                                                {new Date(contact.created_at).toLocaleString('ja-JP')}
                                            </td>
                                            <td className="py-3 px-2 font-semibold text-slate-900 w-64 truncate">{contact.email}</td>
                                            <td className="py-3 px-2 font-medium text-slate-800">{contact.title}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* 🔵 セクション2：本日のチェックイン予約一覧（分類タブ形式へリファクタリング） */}
                <div>
                    <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
                        <div className="flex items-center gap-2">
                            <Calendar className="text-blue-500" size={20} />
                            <h2 className="text-lg font-bold tracking-tight text-slate-900">本日チェックインの予約</h2>
                        </div>
                        <Link 
                            href="/admin/reservations" 
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 flex items-center gap-0.5 transition-colors"
                        >
                            予約一覧へ <ArrowRight size={14} />
                        </Link>
                    </div>

                    {/* ⭕️ 背景に溶け込むフラットなタブナビゲーションエリア */}
                    <div className="flex items-center gap-1 text-xs font-medium border-b border-slate-200 mb-4">
                        <button
                            onClick={() => setActiveTab('pending')}
                            className={`px-4 py-2.5 -mb-px border-b-2 font-bold transition-all flex items-center gap-1.5 ${
                                activeTab === 'pending'
                                    ? 'border-indigo-600 text-indigo-600'
                                    : 'border-transparent text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            <Calendar size={13} />
                            チェックイン予定 ({pendingReservations.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('completed')}
                            className={`px-4 py-2.5 -mb-px border-b-2 font-bold transition-all flex items-center gap-1.5 ${
                                activeTab === 'completed'
                                    ? 'border-emerald-600 text-emerald-600'
                                    : 'border-transparent text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            <CheckCircle size={13} />
                            チェックイン済み ({completedReservations.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('cancelled')}
                            className={`px-4 py-2.5 -mb-px border-b-2 font-bold transition-all flex items-center gap-1.5 ${
                                activeTab === 'cancelled'
                                    ? 'border-slate-400 text-slate-500'
                                    : 'border-transparent text-slate-400 hover:text-slate-700'
                            }`}
                        >
                            <XCircle size={13} />
                            キャンセル済み ({cancelledReservations.length})
                        </button>
                    </div>

                                        {/* ⭕️ タブで選ばれたフィルタデータに基づくテーブルレンダリング */}
                                        {displayReservations.length === 0 ? (
                        <p className="text-sm text-slate-400 italic py-4">{emptyMessage}</p>
                    ) : (
                        <div className="overflow-x-auto animate-in fade-in duration-150">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-slate-400 text-xs font-bold border-b border-slate-100">
                                        <th className="py-2 px-2 w-16">予約ID</th>
                                        <th className="py-2 px-2 w-48">お客様名</th>
                                        <th className="py-2 px-2 w-48">お部屋</th>
                                        <th className="py-2 px-2">宿泊期間</th>
                                        <th className="py-2 px-2 w-32 text-right">料金</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                    {displayReservations.map((res) => (
                                        <tr key={res.id} className="hover:bg-slate-100/50 transition-colors">
                                            <td className="py-3 px-2 font-medium text-slate-400">#{res.id}</td>
                                            <td className="py-3 px-2 font-semibold text-slate-900">
                                                <span className="inline-flex items-center gap-1">
                                                    <User size={14} className="text-slate-400" />
                                                    {res.user ? res.user.name : '退会済み'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-2 text-slate-700 font-medium">
                                                <span className="inline-flex items-center gap-1">
                                                    <Key size={14} className="text-slate-400" />
                                                    {res.room ? res.room.name : '削除済み'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-2 text-slate-500 text-xs">
                                                {res.reservation_start_date} ～ {res.reservation_end_date}
                                            </td>
                                            <td className="py-3 px-2 text-right font-bold text-slate-900">
                                                ¥{res.total_price.toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                {/* 🔴 セクション３：公開ステータスのお知らせ（最大5件） */}
                <div>
                    <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-2">
                        <div className="flex items-center gap-2">
                            <Megaphone className="text-cyan-500" size={20} />
                            <h2 className="text-lg font-bold tracking-tight text-slate-900">公開中のお知らせ</h2>
                        </div>
                        <Link 
                            href="/admin/notices" 
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 flex items-center gap-0.5 transition-colors"
                        >
                            お知らせ管理へ <ArrowRight size={14} />
                        </Link>
                    </div>

                    {notices.length === 0 ? (
                        <p className="text-sm text-slate-400 italic py-4">現在、公開中のお知らせはありません。</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <tbody className="divide-y divide-slate-200 text-sm">
                                    {notices.map((notice) => (
                                        <tr key={notice.id} className="hover:bg-slate-100/50 transition-colors">
                                            <td className="py-3 px-2 text-slate-400 w-12">#{notice.id}</td>
                                            <td className="py-3 px-2 text-slate-500 text-xs w-40">
                                                {new Date(notice.created_at).toLocaleString('ja-JP')}
                                            </td>
                                            <td className="py-3 px-2 font-medium text-slate-800">{notice.title}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                {/* 🔴 セクション4：公開ステータスのフェア（最大5件） */}
                <div>
                    <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-2">
                        <div className="flex items-center gap-2">
                            <Sparkles className="text-pink-500" size={20} />
                            <h2 className="text-lg font-bold tracking-tight text-slate-900">公開中のフェア情報</h2>
                        </div>
                        <Link 
                            href="/admin/fairs" 
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 flex items-center gap-0.5 transition-colors"
                        >
                            フェア管理へ <ArrowRight size={14} />
                        </Link>
                    </div>

                    {fairs.length === 0 ? (
                        <p className="text-sm text-slate-400 italic py-4">現在、公開中のフェアはありません。</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <tbody className="divide-y divide-slate-200 text-sm">
                                    {fairs.map((fair) => (
                                        <tr key={fair.id} className="hover:bg-slate-100/50 transition-colors">
                                            <td className="py-3 px-2 text-slate-400 w-12">#{fair.id}</td>
                                            <td className="py-3 px-2 text-slate-500 text-xs w-40">
                                                {new Date(fair.created_at).toLocaleString('ja-JP')}
                                            </td>
                                            <td className="py-3 px-2 font-medium text-slate-800">{fair.title}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
}
