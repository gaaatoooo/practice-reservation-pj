import { router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

// ⭕️ 修正：データベースのカラム名に合わせて型定義を「数値型」に更新
type Notice = {
    id: number;
    title: string;
    category: number; // 1=重要, 2=イベント, 3=案内
    status: number;   // 1=下書き, 2=公開, 3=非公開
    created_at: string;
};

export default function NoticeList() {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // 画面表示時のお知らせ一覧取得（新設したコントローラーのAPIを呼び出します）
    useEffect(() => {
        fetch('/api/notices')
            .then(res => res.json())
            .then(data => {
                setNotices(data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error('お知らせ取得エラー:', err);
                setIsLoading(false);
            });
    }, []);

    // 行をクリックしたときに詳細画面へジャンプする処理
    const handleRowClick = (id: number) => {
        router.get(`/user/notice/${id}`);
    };

    if (isLoading) {
        return <p className="text-sm text-neutral-400 py-4 animate-pulse">お知らせを読み込み中...</p>;
    }

    if (notices.length === 0) {
        return <p className="text-sm text-neutral-400 py-4">現在お知らせはありません。</p>;
    }

    return (
        <div className="flex flex-col gap-1 w-full">
            {notices.map((notice) => {
                // 日付形式を「YYYY.MM.DD」に綺麗に整形
                const formattedDate = new Date(notice.created_at).toLocaleDateString('ja-JP', {
                    year: 'numeric', month: '2-digit', day: '2-digit'
                }).replace(/\//g, '/');

                // ⭕️ 追記：categoryの数値（1, 2, 3）を、対応する日本語とTailwindの色クラスに自動マッピング
                let tagText = '案内';
                let tagColor = 'bg-neutral-100 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300';

                if (notice.category === 1) {
                    tagText = '重要';
                    tagColor = 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
                } else if (notice.category === 2) {
                    tagText = 'イベント';
                    tagColor = 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
                }

                return (
                    <div 
                        key={notice.id} 
                        onClick={() => handleRowClick(notice.id)} // どこを押しても詳細へ遷移
                        className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-3.5 border-b border-neutral-100 dark:border-neutral-700/50 last:border-0 cursor-pointer hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 px-2 -mx-2 rounded-xl transition-all group"
                    >
                        {/* 日付 */}
                        <span className="text-sm font-medium text-neutral-400 dark:text-neutral-500 font-mono whitespace-nowrap">
                            {formattedDate}
                        </span>
                        
                        {/* ⭕️ 自動判定されたテキストと色をバインド */}
                        <span className={`text-xs px-2 py-0.5 rounded-md font-semibold self-start sm:self-auto ${tagColor}`}>
                            {tagText}
                        </span>
                        
                        {/* タイトル（ホバー時に綺麗に青色に変わるエフェクト付き） */}
                        <div className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1 flex-1">
                            {notice.title}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
