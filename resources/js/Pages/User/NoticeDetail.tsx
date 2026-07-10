import { Head, Link } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

type Props = {
    notice: {
        id: number;
        title: string;
        content: string;
        category: number; // ⭕️ 修正
        status: number;   // ⭕️ 修正
        created_at: string;
    };
};

export default function NoticeDetail({ notice }: Props) {
    // ⭕️ 戻り先のURLと文言の初期値を設定（デフォルトは一覧画面）
    const [backUrl, setBackUrl] = useState('/user/notices');
    const [backLabel, setBackLabel] = useState('お知らせ一覧へ戻る');
    
    // ⭕️ マウント時に遷移元（リファラ）を検知して戻り先を上書き
    useEffect(() => {
        const referrer = document.referrer;
            
        // ダッシュボードから遷移してきた場合
        if (referrer.includes('/dashboard')) {
            setBackUrl('/user/dashboard');
            setBackLabel('ダッシュボードへ戻る');
        } else if (referrer.includes('/user/notices')) {
            // ユーザー側のお知らせ一覧から遷移してきた場合（明示的指定）
            setBackUrl('/user/notices');
            setBackLabel('お知らせ一覧へ戻る');
        }
    }, []);

    const formattedDate = new Date(notice.created_at).toLocaleDateString('ja-JP', {
        year: 'numeric', month: '2-digit', day: '2-digit'
    }).replace(/\//g, '/');

    // ⭕️ カテゴリ数値の変換ロジック
    let tagText = '案内';
    let tagColor = 'bg-neutral-100 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300';

    if (notice.category === 1) {
        tagText = '重要';
        tagColor = 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    } else if (notice.category === 2) {
        tagText = 'イベント';
        tagColor = 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    }

    // ⭕️ テキスト内の「\n」という文字列を本物の改行に安全に変換するヘルパー関数
    const formatText = (text: string | null | undefined) => {
        if (!text) {
            return '未登録';
        }
        
        // データベースから文字として届いた「\n」を実際の改行に置換
        return text.replace(/\\n/g, '\n');
    };

    return (
        <>
            <Head title={notice.title} />
            <div className="p-6 max-w-3xl mx-auto flex flex-col gap-6 py-12">
                <Link 
                    href={backUrl} 
                    className="text-sm font-medium text-neutral-500 hover:text-blue-600 transition-colors self-start flex items-center gap-1"
                >
                    ← {backLabel}
                </Link>

                <div className="flex flex-col gap-3 border-b pb-6">
                    <div className="flex items-center gap-3 text-sm">
                        <span className="font-mono text-neutral-400 dark:text-neutral-500">{formattedDate}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-md font-semibold ${tagColor}`}>
                            {tagText}
                        </span>
                    </div>
                    <h1 className="text-2xl font-black text-neutral-900 dark:text-neutral-100 leading-snug">
                        {notice.title}
                    </h1>
                </div>

                <div className="text-base text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap py-2 font-medium">
                    {formatText(notice.content)}
                </div>
            </div>
        </>
    );
}
