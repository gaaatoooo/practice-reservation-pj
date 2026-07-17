import { Head, Link } from '@inertiajs/react';
import { ChevronDown, ChevronUp, CornerDownRight, Reply, MessageSquarePlus } from 'lucide-react';
import React, { useState } from 'react';

type ReviewItem = {
    id: number;
    room_id: number;
    plan_id: number;
    rating: string | number;
    comment: string;
    reply_content: string | null;
    created_at: string;
    room?: { name: string };
    plan?: { name: string };
};

type Props = {
    reviews: ReviewItem[];
};

export default function ReviewListPage({ reviews = [] }: Props) {
    // 各行の返信アコーディオン開閉状態を管理するステート（キーが review.id）
    const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

    // 行クリック時に対象の行の開閉をトグルする処理
    const toggleRow = (id: number) => {
        setExpandedRows(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 antialiased">
            <Head title="口コミ投稿履歴" />

            {/* ヘッダー */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/user/dashboard" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                        ← ダッシュボードへ戻る
                    </Link>
                </div>
            </header>

            {/* メインコンテンツエリア */}
            <main className="max-w-5xl mx-auto px-4 py-8">
                
                {/* ⭕️ タイトルエリアと新規投稿ボタンを横並びに配置（UI規約完全同期） */}
                <div className="flex items-start justify-between mb-6 gap-4">
                    <div className="text-left">
                        <h2 className="text-2xl font-bold tracking-tight text-gray-900">投稿済みの口コミ・評価一覧</h2>
                        <p className="text-sm text-gray-500 mt-1">これまでにあなたが投稿した客室レビューと、ホテルからの公式返信を確認できます。</p>
                    </div>
                    
                    {/* 🎁 口コミ新規投稿画面（review.create）への遷移ボタン */}
                    <Link
                        href="/user/review/create"
                        className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow-sm transition-colors shrink-0"
                    >
                        <MessageSquarePlus size={14} />
                        新しく口コミを投稿する
                    </Link>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl px-6 shadow-sm overflow-hidden">
                    {reviews.length === 0 ? (
                        <div className="py-16 text-center text-gray-500 text-sm italic text-gray-400">まだ投稿された口コミはありません。</div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {reviews.map((review) => {
                                const isExpanded = !!expandedRows[review.id];
                                // 日付形式を YYYY/MM/DD に美しく整形
                                const formattedDate = new Date(review.created_at).toLocaleDateString('ja-JP', {
                                    year: 'numeric', month: '2-digit', day: '2-digit'
                                });

                                // 評価値を数値として安全にハンドリング
                                const ratingValue = Number(review.rating) || 0;

                                return (
                                    <React.Fragment key={review.id}>
                                        {/* メインの口コミ行 */}
                                        <div
                                            onClick={() => toggleRow(review.id)}
                                            className={`flex flex-col gap-3 py-5 cursor-pointer hover:bg-neutral-50/70 -mx-6 px-6 transition-all group ${
                                                isExpanded ? 'bg-neutral-50/40' : ''
                                            }`}
                                        >
                                            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-400 font-mono">
                                                <span className="font-semibold">{formattedDate}</span>
                                                
                                                {/* 星マークのレーティング表示 */}
                                                <div className="flex items-center gap-0.5 text-amber-400 font-bold font-sans text-sm">
                                                    <span>★</span>
                                                    <span className="text-slate-900 text-xs font-semibold">{ratingValue.toFixed(1)}</span>
                                                </div>
                                            </div>

                                            {/* 宿泊した部屋・プランのバッジ表記 */}
                                            <div className="flex flex-wrap gap-2 text-[11px]">
                                                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold border border-slate-200/50">
                                                    客室: {review.room ? review.room.name : 'お部屋情報なし'}
                                                </span>
                                                <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold border border-indigo-100/50">
                                                    プラン: {review.plan ? review.plan.name : 'プラン情報なし'}
                                                </span>
                                            </div>

                                            {/* 口コミ本文 */}
                                            <div className="text-sm font-medium text-neutral-700 leading-relaxed whitespace-pre-wrap">
                                                {review.comment}
                                            </div>

                                            {/* 返信ステータスに応じたフラットな開閉補助案内ラベル */}
                                            <div className="text-xs font-bold text-indigo-600 flex items-center gap-0.5 mt-1 select-none">
                                                {review.reply_content ? (
                                                    isExpanded ? (
                                                        <>ホテルからの返信を閉じる <ChevronUp size={13} /></>
                                                    ) : (
                                                        <span className="text-emerald-600 flex items-center gap-0.5 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded text-[10px]">
                                                            💬 ホテルからの返信があります（クリックで展開） <ChevronDown size={13} />
                                                        </span>
                                                    )
                                                ) : (
                                                    <span className="text-neutral-400 font-normal text-[11px]">
                                                        ※ホテルからの返信はまだありません
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* アコーディオン展開エリア */}
                                        {isExpanded && review.reply_content && (
                                            <div 
                                                className="bg-slate-50/60 -mx-6 px-12 py-4 border-t border-b border-gray-100 flex items-start gap-3 animate-in fade-in slide-in-from-top-1 duration-150"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <CornerDownRight className="text-slate-400 shrink-0 mt-1" size={16} />
                                                <div className="flex-1 bg-white border border-indigo-100 rounded-xl p-4 text-left shadow-sm">
                                                    <div className="text-[10px] font-bold text-indigo-600 flex items-center gap-1 uppercase mb-2 tracking-wider">
                                                        <Reply size={12} /> ホテルからの公式返信
                                                    </div>
                                                    <div className="text-xs text-slate-700 font-semibold whitespace-pre-wrap leading-relaxed">
                                                        {review.reply_content}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
