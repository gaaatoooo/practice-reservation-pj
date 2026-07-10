import { Head, Link } from '@inertiajs/react';
import React from 'react';

interface Room {
    id: number;
    name: string;
    description: string;
    price: number;
    capacity: number;
    image_url: string;
}

interface Props {
    room: Room;
    averageRating: number;
}

export default function RoomDetail({ room, averageRating }: Props) {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 antialiased">
            <Head title={`${room.name} - お部屋詳細`} />

            {/* ヘッダー */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/user/rooms" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                        ← お部屋一覧へ戻る
                    </Link>
                </div>
            </header>

            {/* メインコンテンツエリア */}
            <main className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden p-6 md:p-8 shadow-sm">
                    {/* ⭕️ 部屋名と評価値を横並びに配置 */}
                    <div className="flex flex-wrap items-baseline gap-3 mb-4">
                        <h2 className="text-2xl font-bold text-gray-900">{room.name}</h2>
                        
                        {/* ⭐️ 星マークと平均値のインライン表示（フラットデザイン） */}
                        <div className="flex items-center gap-1 text-sm font-semibold">
                            <span className="text-amber-400 text-lg">★</span>
                            <span className="text-slate-800">
                                {averageRating > 0 ? averageRating.toFixed(1) : 'なし'}
                            </span>
                            <span className="text-gray-400 text-xs font-normal">
                                {averageRating > 0 ? '（総合評価）' : '（評価なし）'}
                            </span>
                        </div>
                    </div>

                    {/* アイキャッチ大画像 */}
                    <div className="w-full h-[250px] sm:h-[380px] overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-900/40 border border-neutral-100 dark:border-neutral-800 mb-2">
                        <img
                            src={
                                room.image_url ? `/storage/${room.image_url.replace(/^\//, '')}` : '/storage/img/default.png'
                                }
                            alt={room.name}
                            className="w-full h-full object-cover object-center"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* 左側：詳細説明 */}
                        <div className="md:col-span-2 space-y-6">
                            <div>
                                <h3 className="text-md font-bold border-b border-gray-200 pb-2 mb-3 text-gray-900">お部屋の説明</h3>
                                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-sm">
                                    {room.description}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-md font-bold border-b border-gray-200 pb-2 mb-3 text-gray-900">客室基本情報</h3>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li>• <strong>定員：</strong> 最大 {room.capacity} 名</li>
                                    <li>• <strong>チェックイン：</strong> 15:00 ~</li>
                                    <li>• <strong>チェックアウト：</strong> ~ 11:00</li>
                                    <li>• <strong>禁煙・喫煙：</strong> 全室禁煙（館内喫煙スペースあり）</li>
                                </ul>
                            </div>
                        </div>

                        {/* 右側：プライス・予約アクション */}
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 h-fit space-y-4">
                            <div>
                                <span className="text-xs text-gray-400 block">参考価格 (1泊1室)</span>
                                <span className="text-2xl font-bold text-emerald-600">
                                    ¥{room.price} <span className="text-xs text-gray-500 font-normal text-gray-600">（税込）~</span>
                                </span>
                            </div>

                            {/* 予約画面へパラメータ（room_id）を持って遷移 */}
                            <Link
                                href={`/user/reservation?room_id=${room.id}`}
                                className="block w-full text-center bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-lg tracking-wider transition-colors shadow-sm text-sm"
                            >
                                このお部屋で予約する
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
