import { Head, Link, router } from '@inertiajs/react';
import React from 'react';

interface Room {
    id: number;
    name: string;
    description: string;
    price: number; // 1泊単価
    capacity: number;   // 定員
    reviews_avg_rating: number | null; // ⭕️ バックエンドから届く平均値
    image_url: string;
}

interface Props {
    rooms: Room[];
}

export default function RoomList({ rooms }: Props) {
    // カードクリック時に詳細画面へジャンプ
    const handleCardClick = (id: number) => {
        router.get(`/user/rooms/${id}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 antialiased">
            <Head title="お部屋のご案内" />

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
                <div className="mb-6">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">客室のご案内</h2>
                    <p className="text-sm text-gray-500 mt-1">当ホテルのこだわりのお部屋をお選びいただけます。</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rooms.length === 0 ? (
                        <div className="col-span-full py-16 text-center text-gray-500 text-sm bg-white border border-gray-200 rounded-xl">
                            現在、案内可能なお部屋の情報がありません。
                        </div>
                    ) : (
                        rooms.map((room) => {
                            // ⭕️ 評価の平均値を小数点第1位に整形
                            const avgRating = room.reviews_avg_rating 
                                ? Number(room.reviews_avg_rating).toFixed(1) 
                                : null;

                            return (
                                <div 
                                    key={room.id} 
                                    onClick={() => handleCardClick(room.id)}
                                    className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col cursor-pointer group"
                                >
                                    {/* 画像プレースホルダー */}
                                    <div className="h-48 bg-gray-100 flex items-center justify-center text-gray-400 text-sm group-hover:bg-gray-200/70 transition-colors">
                                        <img
                                            src={
                                                room.image_url ? `/storage/${room.image_url.replace(/^\//, '')}` : '/storage/img/default.png'
                                                }
                                            alt={room.name}
                                            className="w-full h-full object-cover object-center"
                                        />
                                    </div>
                                    
                                    <div className="p-5 flex-1 flex flex-col justify-between">
                                        <div>
                                            {/* ⭕️ 部屋名と評価値のエリアを綺麗に横並び化 */}
                                            <div className="flex items-baseline justify-between gap-2 mb-2">
                                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                    {room.name}
                                                </h3>
                                                
                                                {/* ⭐️ 口コミが存在する場合のみ星マークと評価値を出力 */}
                                                {avgRating ? (
                                                    <div className="flex items-center gap-0.5 text-xs font-bold text-slate-800 shrink-0">
                                                        <span className="text-amber-400 text-base">★</span>
                                                        <span>{avgRating}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-[10px] text-gray-400 shrink-0 font-medium">評価なし</span>
                                                )}
                                            </div>

                                            <p className="text-xs text-gray-500 mb-4 line-clamp-3 leading-relaxed">
                                                {room.description}
                                            </p>
                                        </div>
                                        
                                        <div className="border-t border-gray-100 pt-4 mt-auto">
                                            <div className="flex justify-between items-baseline mb-2">
                                                <span className="text-xs text-gray-400">定員: {room.capacity}名</span>
                                                <span className="text-lg font-bold text-emerald-600">
                                                    ¥{room.price.toLocaleString()} <span className="text-xs text-gray-500 font-normal">~/泊</span>
                                                </span>
                                            </div>
                                            <div className="text-xs text-right font-semibold text-indigo-600 group-hover:underline">
                                                詳細を見る &rarr;
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </main>
        </div>
    );
}
