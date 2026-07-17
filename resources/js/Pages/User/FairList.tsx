import { Head, Link, router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';

type FairItem = {
    id: number;
    title: string;
    description: string;
    image_url: string;
    created_at: string;
};

export default function FairListPage() {
    const [fairs, setFairs] = useState<FairItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // お知らせ一覧と同様の手法でAPIから高速取得
    useEffect(() => {
        fetch('/api/fairs')
            .then(res => {
                if (!res.ok) {
                    throw new Error('サーバーエラー');
                }

                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    setFairs(data);
                }

                setIsLoading(false);
            })
            .catch(err => {
                console.error('フェア一覧取得エラー:', err);
                setIsLoading(false);
            });
    }, []);

    const handleRowClick = (id: number) => {
        router.get(`/user/fair/${id}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 antialiased">
            <Head title="フェア一覧" />

            {/* ヘッダー */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/user/dashboard" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                        ← ダッシュボードへ戻る
                    </Link>
                </div>
            </header>

            {/* メメインコンテンツエリア */}
            <main className="max-w-5xl mx-auto px-4 py-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">フェア一覧</h2>
                    <p className="text-sm text-gray-500 mt-1">当ホテルが自信を持ってお届けする、期間限定のイベントや優待プランのご案内です。</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl px-6 py-2 shadow-sm">
                    {isLoading ? (
                        <div className="py-16 text-center text-gray-500 text-sm animate-pulse">フェア情報を読み込み中...</div>
                    ) : fairs.length === 0 ? (
                        <div className="py-16 text-center text-gray-500 text-sm">現在、開催中のフェアはありません。</div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {fairs.map((fair) => {
                                // 日付形式を YYYY.MM.DD に美しく統一
                                const formattedDate = new Date(fair.created_at).toLocaleDateString('ja-JP', {
                                    year: 'numeric', month: '2-digit', day: '2-digit'
                                }).replace(/\//g, '/');

                                return (
                                    <div
                                        key={fair.id}
                                        onClick={() => handleRowClick(fair.id)}
                                        className="flex flex-col md:flex-row items-start md:items-center gap-4 py-5 cursor-pointer hover:bg-neutral-50/70 -mx-6 px-6 transition-all group"
                                    >
                                        {/* 日付表示（モノスペースフォント） */}
                                        <span className="text-sm font-medium text-neutral-400 font-mono whitespace-nowrap pt-0.5 md:pt-0">
                                            {formattedDate}
                                        </span>

                                        {/* 小さなサムネイル画像（左側に添えることで視認性をアップ） */}
                                        <div className="w-20 h-12 overflow-hidden rounded-md bg-gray-100 border border-gray-200/60 shrink-0 hidden sm:block">
                                        <img
                                            src={
                                                fair.image_url ? `/storage/${fair.image_url.replace(/^\//, '')}` : '/storage/img/default.png'
                                            }
                                            alt={fair.title}
                                            className="w-full h-full object-cover object-center"
                                        />
                                        </div>
                                        
                                        {/* タイトルと詳細概要のプレビュー */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-bold text-neutral-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                                                {fair.title}
                                            </h3>
                                            <p className="text-xs text-neutral-400 mt-0.5 line-clamp-1">
                                                {fair.description}
                                            </p>
                                        </div>

                                        {/* 右矢印アロー */}
                                        <span className="text-gray-300 group-hover:text-neutral-400 transition-colors hidden md:block text-sm pl-2">
                                            →
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
