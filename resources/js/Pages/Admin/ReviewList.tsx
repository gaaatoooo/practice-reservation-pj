import { Head, Link } from '@inertiajs/react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import React, { useState } from 'react';

type ReviewItem = {
    id: number;
    rating: number;
    comment: string;
    created_at: string;
    user?: { name: string };
    room?: { name: string };
    plan?: { name: string };
};

type Props = {
    reviews: {
        data: ReviewItem[];
        links: any[]; // ページネーション用
    };
};

export default function Index({ reviews }: Props) {
    // ⭕️ 各行の「すべて表示」状態を管理するオブジェクトステート（キーがreview.id）
    const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

    // 開閉トグル処理
    const toggleRow = (id: number) => {
        setExpandedRows(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
            <Head title="口コミ管理" />

            {/* 管理画面専用ヘッダー */}
            <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10 text-white">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="bg-emerald-600 text-xs px-2 py-0.5 rounded font-bold tracking-wider">ADMIN</span>
                        <h1 className="text-md font-bold tracking-tight">宿泊レビュー一覧</h1>
                    </div>
                    <Link href="/admin/dashboard" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                        ダッシュボードへ戻る &rarr;
                    </Link>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-8">
                {/* メインコンテンツ（左右余白px-6対応） */}
                <div className="w-full max-w-[1600px] mx-auto px-6 flex flex-col gap-6">
                    
                    {/* 画面タイトル・説明 */}
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900">宿泊レビュー一覧</h1>
                        <p className="text-xs text-slate-500 mt-1">ユーザーから投稿されたお部屋・プランに対する評価とご感想の確認を行います。</p>
                    </div>

                    {/* 口コミ一覧テーブル（カード枠なしのフラットデザイン） */}
                    <div className="w-full overflow-x-auto border border-slate-200 rounded-lg bg-white shadow-sm">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-500 font-medium">
                                    <th className="p-4 w-16">ID</th>
                                    <th className="p-4 w-32">投稿日</th>
                                    <th className="p-4 w-40">お客様名</th>
                                    <th className="p-4 w-48">お部屋 / プラン</th>
                                    <th className="p-4 w-24">評価</th>
                                    <th className="p-4">口コミ内容</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {reviews.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-slate-400 italic">
                                            現在、投稿された口コミはありません。
                                        </td>
                                    </tr>
                                ) : (
                                    reviews.data.map((review) => {
                                        const isExpanded = !!expandedRows[review.id];
                                        // 60文字を超える場合は切り詰め対象にする
                                        const isLongComment = review.comment.length > 60;
                                        
                                        // ⭕️ 表示するテキストの動的制御
                                        const displayText = isLongComment && !isExpanded
                                            ? `${review.comment.substring(0, 60)}...`
                                            : review.comment;

                                        return (
                                            <tr key={review.id} className="hover:bg-slate-50/50 transition-colors items-start">
                                                <td className="p-4 font-mono text-slate-400 align-top">#{review.id}</td>
                                                <td className="p-4 text-slate-500 align-top">
                                                    {new Date(review.created_at).toLocaleDateString('ja-JP')}
                                                </td>
                                                <td className="p-4 font-medium text-slate-900 align-top">
                                                    {review.user ? review.user.name : '退会済みユーザー'}
                                                </td>
                                                <td className="p-4 align-top space-y-1">
                                                    <div className="font-bold text-slate-800">{review.room ? review.room.name : '削除部屋'}</div>
                                                    <div className="text-[11px] text-slate-400">{review.plan ? review.plan.name : '削除プラン'}</div>
                                                </td>
                                                <td className="p-4 align-top">
                                                    <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                                                        <span>★</span>
                                                        <span className="text-slate-900">{review.rating}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-slate-700 leading-relaxed align-top">
                                                    <div className="whitespace-pre-wrap font-medium">{displayText}</div>
                                                    
                                                    {/* ⭕️ 長文の時だけ「すべて表示する/閉じる」のフラットリンクを表示 */}
                                                    {isLongComment && (
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleRow(review.id)}
                                                            className="mt-1.5 text-indigo-600 hover:text-indigo-500 font-bold flex items-center gap-0.5 transition-colors focus:outline-none"
                                                        >
                                                            {isExpanded ? (
                                                                <>表示を閉じる <ChevronUp size={13} /></>
                                                            ) : (
                                                                <>すべて表示する <ChevronDown size={13} /></>
                                                            )}
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}