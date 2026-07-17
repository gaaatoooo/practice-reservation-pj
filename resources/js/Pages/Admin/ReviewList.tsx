import { Head, Link, router } from '@inertiajs/react';
import { ChevronDown, ChevronUp, CornerDownRight, Reply } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

type ReviewItem = {
    id: number;
    rating: number;
    comment: string;
    created_at: string;
    user?: { name: string };
    room?: { name: string };
    plan?: { name: string };
    reply_content?: string | null; 
};

type Props = {
    reviews: {
        data: ReviewItem[];
        links: any[]; // ページネーション用
    };
};

export default function Index({ reviews }: Props) {

    const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

    // ⭕️ 各行の返信テキストを個別に管理するローカルステート
    const [replyInputs, setReplyInputs] = useState<Record<number, string>>({});
    const [submittingId, setSubmittingId] = useState<number | null>(null);

    // 開閉トグル処理
    const toggleRow = (id: number) => {
        setExpandedRows(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // ⭕️ 個別の返信入力値の変更をキャッチ
    const handleReplyChange = (id: number, text: string) => {
        setReplyInputs(prev => ({
            ...prev,
            [id]: text
        }));
    };

    const handleSendReply = (e: React.FormEvent, reviewId: number) => {
        e.preventDefault();
        const content = replyInputs[reviewId];

        if (!content || !content.trim()) {
            return;
        }

        setSubmittingId(reviewId);

        // お問合せ管理と同様のエンドポイント規約でPOST送信
        router.patch(`/admin/reviews/${reviewId}/reply`, {
            reply_content: content // ⭕️ データを直接第2引数として引き渡す
        }, {
            preserveScroll: true, // 画面のスクロール位置をキープする快適なおもてなし設定
            onSuccess: () => {
                setReplyInputs(prev => ({ ...prev, [reviewId]: '' }));
                setSubmittingId(null);
                alert('レビューへの返信を登録しました。');
            },
            onError: (errors) => {
                setSubmittingId(null);
                console.error('バリデーションエラー詳細:', errors);
            }
        });
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
                                        const isLongComment = review.comment.length > 60;
                                        
                                        // 表示するテキストの動的制御（展開時はすべて表示）
                                        const displayText = isLongComment && !isExpanded
                                            ? `${review.comment.substring(0, 60)}...`
                                            : review.comment;

                                        return (
                                            <React.Fragment key={review.id}>
                                                {/* ⭕️ メインのデータ行（行全体のクリックでも開閉可能にするため cursor-pointer を付与） */}
                                                <tr 
                                                    onClick={() => toggleRow(review.id)}
                                                    className={`hover:bg-slate-50/70 transition-colors items-start cursor-pointer select-none ${
                                                        isExpanded ? 'bg-slate-50/40' : ''
                                                    }`}
                                                >
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
                                                        
                                                        {/* 開閉状態を示すフラット補助リンク（クリックイベントのバブリングを止めて重複発火を防止） */}
                                                        <div className="mt-2 text-indigo-600 hover:text-indigo-500 font-bold flex items-center gap-0.5 transition-colors text-[11px]">
                                                            {isExpanded ? (
                                                                <span className="flex items-center gap-0.5">返信エリアを閉じる <ChevronUp size={12} /></span>
                                                            ) : (
                                                                <span className="flex items-center gap-0.5">
                                                                    {isLongComment ? 'すべて表示して返信する' : (review.reply_content ? 'このレビューの返信を確認する' :'このレビューに返信する')} 
                                                                    <ChevronDown size={12} />
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                                {/* ⭕️ アコーディオン展開行：該当行が開いている場合のみ下に差し込む */}
                                                {isExpanded && (
                                                    <tr className="bg-slate-50/30 border-t border-b border-slate-200/50 animate-in fade-in slide-in-from-top-1 duration-150">
                                                        <td colSpan={6} className="p-4 pl-12 pr-6">
                                                            <div className="flex items-start gap-3 w-full" onClick={(e) => e.stopPropagation()}>
                                                                <CornerDownRight className="text-slate-400 shrink-0 mt-1" size={16} />
                                                                
                                                                {/* ⭕️ 分岐：すでにデータベースに返信（review.reply_content）が存在する場合 */}
                                                                {review.reply_content ? (
                                                                    <div className="flex-1 bg-indigo-50/40 border border-indigo-100 rounded-xl p-4 text-left animate-in fade-in duration-200">
                                                                        <div className="text-[11px] font-bold text-indigo-600 flex items-center gap-1 uppercase mb-2">
                                                                            <Reply size={12} /> 投稿済みの公式返信
                                                                        </div>
                                                                        <div className="text-xs text-slate-800 font-medium whitespace-pre-wrap leading-relaxed">
                                                                            {review.reply_content}
                                                                        </div>
                                                                        {/* 💡 必要であれば、ここに「返信を編集する」ボタンなどを将来配置可能です */}
                                                                    </div>
                                                                ) : (
                                                                    /* ⭕️ 分岐：まだ返信がない場合のみ、入力フォームを表示する */
                                                                    <form 
                                                                        onSubmit={(e) => handleSendReply(e, review.id)}
                                                                        className="flex-1 flex flex-col gap-3"
                                                                    >
                                                                        <div className="grid gap-1.5">
                                                                            <label className="text-[11px] font-bold text-indigo-600 flex items-center gap-1 uppercase">
                                                                                <Reply size={12} /> この宿泊レビューへの公式返信内容
                                                                            </label>
                                                                            <textarea
                                                                                value={replyInputs[review.id] || ''}
                                                                                onChange={(e) => handleReplyChange(review.id, e.target.value)}
                                                                                placeholder="投稿者様へのお礼やコメントをご入力ください（この内容はサイト上に公式返信として公開されます）。"
                                                                                required
                                                                                rows={4}
                                                                                className="w-full text-xs border border-slate-200 rounded-lg p-3 bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 leading-relaxed font-medium"
                                                                            />
                                                                        </div>
                                                                        
                                                                        <div className="flex justify-end gap-2">
                                                                            <Button
                                                                                type="button"
                                                                                variant="outline"
                                                                                className="h-8 text-[11px] text-slate-500 border-slate-200"
                                                                                onClick={() => toggleRow(review.id)}
                                                                            >
                                                                                閉じる
                                                                            </Button>
                                                                            <Button
                                                                                type="submit"
                                                                                disabled={submittingId === review.id || !(replyInputs[review.id]?.trim())}
                                                                                className="h-8 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] px-4 rounded-md shadow-sm"
                                                                            >
                                                                                {submittingId === review.id ? '登録中...' : '公式返信を投稿する'}
                                                                            </Button>
                                                                        </div>
                                                                    </form>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
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
