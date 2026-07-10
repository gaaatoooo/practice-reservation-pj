import { router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';

// ⭕️ データベースのカラム名（image_url）に合わせて型定義を更新
type FairItem = {
    id: number;
    title: string;
    description: string;
    image_url: string | null;
};

export default function FairSlider() {
    // ⭕️ ダミーデータを全廃し、APIから動的に受け取るためのステートを定義
    const [fairs, setFairs] = useState<FairItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // ⭕️ 新設：画面表示時にフェア情報一覧をAPI経由で非同期フェッチ（お知らせ一覧と同様の形式）
    useEffect(() => {
        fetch('/api/fairs')
            .then(res => {
                // ⭕️ サーバーが500エラー等を返した場合はエラーハンドリングへ飛ばす
                if (!res.ok) {
                    throw new Error('サーバーエラーが発生しました');
                }

                return res.json();
            })
            .then(data => {
                // ⭕️ 届いたデータが確実に配列(Array)である場合のみステートにセットする安全ガード
                if (Array.isArray(data)) {
                    setFairs(data);
                } else {
                    console.error('期待された配列形式のデータではありません:', data);
                    setFairs([]);
                }

                setIsLoading(false);
            })
            .catch(err => {
                console.error('フェア情報取得エラー:', err);
                setFairs([]); // エラー時は空配列にしてクラッシュを防ぐ
                setIsLoading(false);
            });
    }, []);

    // 5秒ごとに自動で次のスライドに切り替えるタイマー設定
    useEffect(() => {
        // ⭕️ 安全対策：フェアデータが空、または1枚以下の場合は自動スライドを実行しない
        if (fairs.length <= 1) {
            return;
        }

        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % fairs.length);
        }, 5000); // 5000ms = 5秒

        return () => clearInterval(timer); // コンポーネントが消えるときにタイマーを掃除
    }, [fairs.length]); // ⭕️ 依存配列にfairs.lengthを指定してデータ取得後に追従させる

    // ⭕️ 新設：画像クリック時に詳細画面へ遷移する処理
    const handleFairClick = (id: number) => {
        router.get(`/user/fair/${id}`);
    };

    // ⭕️ 読み込み中のプレースホルダー表示
    if (isLoading) {
        return (
            <div className="w-full h-full min-h-[350px] bg-neutral-100 dark:bg-neutral-800/50 rounded-xl flex items-center justify-center text-sm text-neutral-400 animate-pulse">
                フェア情報を読み込み中...
            </div>
        );
    }

    // ⭕️ 開催中のフェアデータが存在しない場合のセーフガード
    if (fairs.length === 0) {
        return (
            <div className="w-full h-full min-h-[350px] bg-neutral-100 dark:bg-neutral-800/30 rounded-xl flex items-center justify-center text-sm text-neutral-400">
                現在開催中のフェアはありません。
            </div>
        );
    }

    return (
        <div className="relative w-full h-full min-h-[350px] flex flex-col justify-between overflow-hidden rounded-xl">
            {/* スライドショーの画像エリア */}
            <div className="relative flex-1 w-full overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-900 group">
                {fairs.map((fair, index) => (
                    <div
                        key={fair.id}
                        onClick={() => handleFairClick(fair.id)}
                        className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out
                            ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}
                        `}
                    >
                        {/* 背景画像 (⭕️ fair.image_url に修正) */}
                        <img
                            src={
                                fair.image_url ? `/storage/${fair.image_url.replace(/^\//, '')}` : '/storage/img/default.png'
                            }
                            alt={fair.title}
                            className="w-full h-full object-cover object-center"
                        />
                        {/* 文字を見やすくするための薄い黒グラデーションの影 */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        
                        {/* 画像の上の文字コンテンツ */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-20">
                            <h4 className="text-lg font-bold mb-2 line-clamp-1">
                                {fair.title}
                            </h4>
                            <p className="text-xs text-neutral-200 line-clamp-2 md:line-clamp-none">
                                {fair.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* 下側のナビゲーションドット（今何枚目かを表す丸ポチ） */}
            <div className="flex justify-center gap-2 mt-4">
                {fairs.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`h-2 rounded-full transition-all duration-300
                            ${index === currentIndex ? 'w-6 bg-blue-600' : 'w-2 bg-neutral-300 dark:bg-neutral-600'}
                        `}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
