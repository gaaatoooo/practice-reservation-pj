import { Head, Link } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

type Fair = {
    id: number;
    title: string;
    description: string;
    image_url: string;
    created_at: string;
};

interface Props {
    fair: Fair;
}

export default function FairShow({ fair }: Props) {

    // ⭕️ 戻り先のURLと文言の初期値を設定（デフォルトは一覧画面）
    const [backUrl, setBackUrl] = useState('/user/fairs');
    const [backLabel, setBackLabel] = useState('フェア一覧へ戻る');

    // ⭕️ マウント時に遷移元（リファラ）を検知して戻り先を上書き
    useEffect(() => {
        const referrer = document.referrer;
        
        // ダッシュボードから遷移してきた場合
        if (referrer.includes('/dashboard')) {
            setBackUrl('/user/dashboard');
            setBackLabel('ダッシュボードへ戻る');
        } else if (referrer.includes('/user/fairs')) {
            // ユーザー側のフェア一覧から遷移してきた場合（明示的指定）
            setBackUrl('/user/fairs');
            setBackLabel('フェア一覧へ戻る');
        }
    }, []);

    // 日付形式をお知らせと同様に「YYYY.MM.DD」へ綺麗に整形
    const formattedDate = new Date(fair.created_at).toLocaleDateString('ja-JP', {
        year: 'numeric', month: '2-digit', day: '2-digit'
    }).replace(/\//g, '/');

    // ⭕️ テキスト内の「\n」という文字列を本物の改行に安全に変換するヘルパー関数
    const formatText = (text: string | null | undefined) => {
        if (!text) {
            return '未登録';
        }
        
        // データベースから文字として届いた「\n」を実際の改行に置換
        return text.replace(/\\n/g, '\n');
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 antialiased">
            <Head title={fair.title} />

            {/* ヘッダー */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href={backUrl} className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                        ← {backLabel}
                    </Link>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-8">
                {/* ヘッダー領域（タグを廃止し、日付とお名前のみのシンプルな構成へ） */}
                <div className="flex flex-col gap-3 border-b pb-6">
                    <div className="flex items-center text-sm">
                        <span className="font-mono text-neutral-400 dark:text-neutral-500">{formattedDate}</span>
                    </div>
                    <h1 className="text-2xl font-black text-neutral-900 dark:text-neutral-100 leading-snug">
                        {fair.title}
                    </h1>
                </div>

                {/* アイキャッチ大画像 */}
                <div className="w-full h-[250px] sm:h-[380px] overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-900/40 border border-neutral-100 dark:border-neutral-800">
                    <img
                        src={
                            fair.image_url ? `/storage/${fair.image_url.replace(/^\//, '')}` : '/storage/img/default.png'
                            }
                        alt={fair.title}
                        className="w-full h-full object-cover object-center"
                    />
                </div>

                {/* 詳細内容本文 */}
                <div className="text-base text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap py-2 font-medium">
                    {formatText(fair.description)}
                </div>

                {/* 予約アクション領域 */}
                <div className="mt-4 pt-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-medium max-w-xl">
                        こちらの限定フェア・特別プランでの宿泊予約は、ダッシュボードのカレンダーからいつでもお申し込みいただけます。
                    </div>
                    <Link
                        href="/user/reservation"
                        className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-bold text-xs sm:text-sm rounded-lg hover:bg-indigo-700 shadow-sm transition-colors whitespace-nowrap self-end sm:self-auto"
                    >
                        空室状況を見て予約する
                    </Link>
                </div>
            </main>
        </div>
    );
}
