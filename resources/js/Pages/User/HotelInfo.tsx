import { Head, Link } from '@inertiajs/react';
import React, { useState, useEffect, useRef } from 'react';

type HotelDetail = {
    postal_code: string;
    address: string;
    tel: string;
    email: string;
    check_in_time: string;
    check_out_time: string;
    description: string;
    amenities: string;
    access_info: string;
    child_policy: string;
    parking_info: string;
    cancel_policy: string;
};

export default function HotelInfoPage() {
    const [info, setInfo] = useState<HotelDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const accessRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch('/api/hotel-info')
            .then(res => {
                if (!res.ok) {
                    throw new Error('サーバーエラー');
                }

                return res.json();
            })
            .then(data => {
                if (data && (data.postal_code || data.description)) {
                    setInfo(data);
                }

                setIsLoading(false);
            })
            .catch(err => {
                console.error('施設情報取得エラー:', err);
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        if (!isLoading && window.location.hash === '#access' && accessRef.current) {
            // 少しだけ実行を遅らせる（DOMのレンダリング確定を待つため）
            setTimeout(() => {
                accessRef.current?.scrollIntoView({
                    behavior: 'smooth', // ふんわりとスムーズにスクロール
                    block: 'start'      // 要素の先頭が画面の上端にくるように移動
                });
            }, 100);
        }
    }, [isLoading]);

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
            <Head title="施設のご案内" />
            <div className="p-6 max-w-3xl mx-auto flex flex-col gap-8 py-12 text-neutral-900 antialiased">
                
                {/* 戻るリンクをお知らせ・フェア詳細と完全同期 */}
                <Link 
                    href="/user/dashboard" 
                    className="text-sm font-medium text-neutral-500 hover:text-blue-600 transition-colors self-start flex items-center gap-1"
                >
                    ← ダッシュボードへ戻る
                </Link>

                {/* ヘッダー領域 */}
                <div className="flex flex-col gap-2 border-b pb-6">
                    <span className="text-xs text-neutral-400 font-mono tracking-wider">HOTEL INFORMATION</span>
                    <h1 className="text-2xl font-black text-neutral-900 leading-snug">
                        施設のご案内
                    </h1>
                </div>

                {isLoading ? (
                    <div className="py-12 text-center text-neutral-400 text-sm animate-pulse">情報を読み込み中...</div>
                ) : !info ? (
                    <div className="py-12 text-center text-neutral-400 text-sm">施設情報が登録されていません。</div>
                ) : (
                    <div className="space-y-12">
                        
                        {/* 1. ホテルコンセプト */}
                        <div className="space-y-3">
                            <h2 className="text-lg font-bold text-neutral-900">当ホテルについて</h2>
                            <div className="text-base text-neutral-700 leading-relaxed whitespace-pre-wrap font-medium">
                                {formatText(info.description)}
                            </div>
                        </div>

                        {/* 2. 基本情報リスト（テーブルレスのクリーンな箇条書き形式） */}
                        <div className="space-y-4 pt-4 border-t border-neutral-100">
                            <h2 className="text-lg font-bold text-neutral-900">基本インフォメーション</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4 text-sm font-medium">
                                <div className="space-y-1">
                                    <span className="text-xs text-neutral-400 font-bold block">チェックイン時間</span>
                                    <span className="text-neutral-700">{info.check_in_time}</span>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs text-neutral-400 font-bold block">チェックアウト時間</span>
                                    <span className="text-neutral-700">{info.check_out_time}</span>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs text-neutral-400 font-bold block">代表電話番号</span>
                                    <span className="text-neutral-700 font-mono">{info.tel}</span>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs text-neutral-400 font-bold block">メールアドレス</span>
                                    <span className="text-neutral-700 font-mono">{info.email}</span>
                                </div>
                                <div className="space-y-1 sm:col-span-2">
                                    <span className="text-xs text-neutral-400 font-bold block">所在地</span>
                                    <span className="text-neutral-700 leading-relaxed">
                                        〒{info.postal_code}<br />{info.address}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 4. 駐車場のご案内 */}
                        <div className="space-y-3 pt-6 border-t border-neutral-100">
                            <h2 className="text-lg font-bold text-neutral-900">駐車場のご案内</h2>
                            <div className="text-base text-neutral-700 leading-relaxed whitespace-pre-wrap font-medium">
                                {formatText(info.parking_info)}
                            </div>
                        </div>

                        {/* 5. お子様規定 */}
                        <div className="space-y-3 pt-6 border-t border-neutral-100">
                            <h2 className="text-lg font-bold text-neutral-900">お子様・添い寝規定</h2>
                            <div className="text-base text-neutral-700 leading-relaxed whitespace-pre-wrap font-medium">
                                {formatText(info.child_policy)}
                            </div>
                        </div>

                        {/* 6. キャンセルポリシー（文字色が上品に赤みがかかる設計を同期） */}
                        <div className="space-y-3 pt-6 border-t border-neutral-100">
                            <h2 className="text-lg font-bold text-red-700">キャンセルポリシー</h2>
                            <div className="text-base text-red-700/90 leading-relaxed whitespace-pre-wrap font-medium">
                                {formatText(info.cancel_policy)}
                            </div>
                        </div>

                        {/* 7. 客室設備・アメニティ */}
                        <div className="space-y-3 pt-6 border-t border-neutral-100">
                            <h2 className="text-lg font-bold text-neutral-900">客室設備・アメニティ</h2>
                            <div className="text-base text-neutral-700 leading-relaxed whitespace-pre-wrap font-medium">
                                {formatText(info.amenities)}
                            </div>
                        </div>
                        {/* 3. 交通アクセス */}
                        <div ref={accessRef} id="access" className="space-y-4 pt-6 border-t border-neutral-100 scroll-mt-6">
                            <h2 className="text-lg font-bold text-neutral-900">交通アクセス</h2>
                            
                            {/* アクセス文章のテキスト */}
                            <div className="text-base text-neutral-700 leading-relaxed whitespace-pre-wrap font-medium">
                                {formatText(info.access_info)}
                            </div>

                            {/* ⭕️ Googleマップ埋め込みコンテナ */}
                            <div className="w-full mt-4 overflow-hidden rounded-xl border border-neutral-200 shadow-sm bg-neutral-50">
                                <div className="relative w-full h-0 pb-[56.25%] sm:pb-[45%]">
                                <iframe
                                    title="Google Map - Hotel Location"
                                    src={`https://maps.google.com/maps?q=${encodeURIComponent(info.address || '北海道札幌市')}&t=&z=15&ie=UTF8&iwloc=B&output=embed`}
                                    className="absolute top-0 left-0 w-full h-full border-0"
                                    allowFullScreen={false}
                                    loading="lazy"
                                    referrerPolicy="no-referrer"
                                />
                                </div>
                                <div className="bg-neutral-50 px-4 py-2.5 border-t border-neutral-100 flex justify-between items-center text-xs text-neutral-500 font-medium">
                                    <span>📍 {info.address || '住所情報が登録されていません'}</span>
                                    <a 
                                        href={`https://google.com{encodeURIComponent(info.address || '')}`}
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-700 font-bold hover:underline shrink-0 ml-4"
                                    >
                                        大きな地図で見る &rarr;
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
