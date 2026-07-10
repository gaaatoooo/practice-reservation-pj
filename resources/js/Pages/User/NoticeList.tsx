import { Head, Link, router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';

type NoticeItem = {
    id: number;
    title: string;
    category: number; // 1=重要, 2=イベント, 3=案内
    status: number;   // 1=下書き, 2=公開, 3=非公開
    created_at: string;
};

export default function NoticeListPage() {
    const [notices, setNotices] = useState<NoticeItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // コントローラーのAPI経由でお知らせ一覧を高速取得
    useEffect(() => {
        fetch('/api/notices')
            .then(res => {
                if (!res.ok) {
                    throw new Error('サーバーエラー');
                }

                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    // 公開ステータス(2)のものだけにフロント側でも安全ガードフィルタ
                    const publicNotices = data.filter(n => n.status === 2);
                    setNotices(publicNotices);
                }
                
                setIsLoading(false);
            })
            .catch(err => {
                console.error('お知らせ一覧取得エラー:', err);
                setIsLoading(false);
            });
    }, []);

    // 行クリック時に詳細画面へジャンプ
    const handleRowClick = (id: number) => {
        router.get(`/user/notice/${id}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 antialiased">
            <Head title="お知らせ一覧" />

            {/* ヘッダー */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/user/dashboard" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                        ← ダッシュボードへ戻る
                    </Link>
                </div>
            </header>

            {/* メインコンテンツエリア */}
            <main className="max-w-4xl mx-auto px-4 py-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">お知らせ一覧</h2>
                    <p className="text-sm text-gray-500 mt-1">ホテルの最新ニュースや、館内施設のご案内などを掲載しております。</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl px-6 py-2 shadow-sm">
                    {isLoading ? (
                        <div className="py-16 text-center text-gray-500 text-sm animate-pulse">お知らせを読み込み中...</div>
                    ) : notices.length === 0 ? (
                        <div className="py-16 text-center text-gray-500 text-sm">現在、新しいお知らせはありません。</div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {notices.map((notice) => {
                                // 日付形式を YYYY.MM.DD に美しく整形
                                const formattedDate = new Date(notice.created_at).toLocaleDateString('ja-JP', {
                                    year: 'numeric', month: '2-digit', day: '2-digit'
                                }).replace(/\//g, '/');

                                // カテゴリ数値（1, 2, 3）を対応する日本語と色クラスにマッピング
                                let tagText = '案内';
                                let tagColor = 'bg-neutral-100 text-neutral-700';

                                if (notice.category === 1) {
                                    tagText = '重要';
                                    tagColor = 'bg-red-100 text-red-700';
                                } else if (notice.category === 2) {
                                    tagText = 'イベント';
                                    tagColor = 'bg-blue-100 text-blue-700';
                                }

                                return (
                                    <div
                                        key={notice.id}
                                        onClick={() => handleRowClick(notice.id)}
                                        className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 py-4 cursor-pointer hover:bg-neutral-50/70 -mx-6 px-6 transition-all group"
                                    >
                                        {/* 日付表示 */}
                                        <span className="text-sm font-medium text-neutral-400 font-mono whitespace-nowrap">
                                            {formattedDate}
                                        </span>

                                        {/* カテゴリバッジ */}
                                        <span className={`text-xs px-2.5 py-0.5 rounded-md font-semibold self-start sm:self-auto ${tagColor}`}>
                                            {tagText}
                                        </span>
                                        
                                        {/* タイトル */}
                                        <div className="text-sm font-semibold text-neutral-700 group-hover:text-blue-600 transition-colors line-clamp-1 flex-1 min-w-0">
                                            {notice.title}
                                        </div>

                                        {/* 右矢印アロー */}
                                        <span className="text-gray-300 group-hover:text-neutral-400 transition-colors hidden sm:block text-sm pl-2">
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
