import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';

interface RoomItem {
    id: number;
    name: string;
    status: number;
    description: string; // ⭕️ description に修正
    image_url: string | null; // ⭕️ 追加
    price: string;
    capacity: string;
    url: string;
    total_rooms: string;
}

interface Props {
    room: RoomItem;
    statusList: Record<string, string>;
}

export default function AdminRoomEditForm({ room, statusList = {} }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: room.name,
        status: String(room.status),
        description: room.description, // ⭕️ description に修正
        image: null as File | null,    // ⭕️ 新しく選ぶ画像ファイル
        _method: 'PATCH',             // ⭕️ LaravelのマルチパートPATCHバグを回避するための擬似メソッド設定
        price: room.price,
        capacity: room.capacity,
        url: room.url,
        total_rooms: room.total_rooms,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // ⚠️ FormData を画像付きで送るため、PATCHではなく、POSTの引数として送信します
        post(`/admin/rooms/${room.id}`, {
            forceFormData: true,
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
            <Head title={`【管理画面】部屋編集 #${room.id}`} />

            <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10 text-white">
                <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="bg-emerald-600 text-xs px-2 py-0.5 rounded font-bold tracking-wider">ADMIN</span>
                        <h1 className="text-md font-bold tracking-tight">部屋編集</h1>
                    </div>
                    <Link href="/admin/rooms" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                        &larr; 管理一覧へ戻る
                    </Link>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-8">
                <div className="mb-6">
                    <p className="text-sm text-slate-500 mt-1">
                        部屋情報を修正し、上書き保存します。
                    </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* 部屋名 */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">部屋名</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className={`w-full text-sm border rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white py-2.5 px-3.5 transition-colors ${
                                    errors.name ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500' : 'border-slate-300'
                                }`}
                            />
                            {errors.name && <p className="text-xs text-rose-600 font-medium mt-1">{errors.name}</p>}
                        </div>

                        {/* ステータス */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">公開状況</label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="w-full text-sm border border-slate-300 rounded-lg focus:border-indigo-500 bg-white py-2.5 px-3.5"
                                >
                                    {/* 💡 ループで動的にoptionタグを生成 */}
                                    {Object.entries(statusList).map(([key, label]) => (
                                        <option key={key} value={key}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">価格</label>
                            <input
                                type="text"
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value)}
                                className={`w-full text-sm border rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white py-2.5 px-3.5 transition-colors ${
                                    errors.price ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500' : 'border-slate-300'
                                }`}
                            />
                            {errors.price && <p className="text-xs text-rose-600 font-medium mt-1">{errors.price}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">宿泊可能人数</label>
                            <input
                                type="text"
                                value={data.capacity}
                                onChange={(e) => setData('capacity', e.target.value)}
                                className={`w-full text-sm border rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white py-2.5 px-3.5 transition-colors ${
                                    errors.capacity ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500' : 'border-slate-300'
                                }`}
                            />
                            {errors.capacity && <p className="text-xs text-rose-600 font-medium mt-1">{errors.capacity}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">総部屋数</label>
                            <input
                                type="text"
                                value={data.total_rooms}
                                onChange={(e) => setData('total_rooms', e.target.value)}
                                className={`w-full text-sm border rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white py-2.5 px-3.5 transition-colors ${
                                    errors.total_rooms ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500' : 'border-slate-300'
                                }`}
                            />
                            {errors.total_rooms && <p className="text-xs text-rose-600 font-medium mt-1">{errors.total_rooms}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">URL</label>
                            <input
                                type="text"
                                value={data.url}
                                onChange={(e) => setData('url', e.target.value)}
                                placeholder="http://localhost:8000/"
                                className={`w-full text-sm border rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white py-2.5 px-3.5 transition-colors ${
                                    errors.url ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500' : 'border-slate-300'
                                }`}
                            />
                            {errors.url && <p className="text-xs text-rose-600 font-medium mt-1">{errors.url}</p>}
                        </div>

                        {/* ⭕️ 画像アップロード項目 ＆ 登録済みプレビュー */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">部屋のイメージ画像</label>
                            
                            {/* すでに画像が登録されている場合はプレビューを表示 */}
                            {room.image_url && (
                                <div className="mb-3">
                                    <span className="block text-xs font-semibold text-slate-400 mb-1">現在の登録画像：</span>
                                    <img 
                                        src={`/storage/${room.image_url}`} 
                                        alt="Current room Image" 
                                        className="h-28 object-cover rounded-lg border border-slate-200"
                                    />
                                </div>
                            )}

                            <input
                                type="file"
                                accept="image/*"
                                // e.target.files[0] を取得するように修正
                                onChange={(e) => setData('image', e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                                className={`w-full text-sm border rounded-lg bg-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-slate-800 py-1.5 px-3 transition-colors ${
                                    errors.image ? 'border-rose-400 focus:border-rose-500' : 'border-slate-300'
                                }`}
                            />
                            <p className="text-xs text-slate-400 mt-1">※ 新しい画像を選ぶと、古い画像は自動で上書き消去されます。</p>
                            {errors.image && <p className="text-xs text-rose-600 font-medium mt-1">{errors.image}</p>}
                        </div>

                        {/* 部屋内容 (description) */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">部屋詳細</label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className={`w-full text-sm border rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white h-64 p-3.5 transition-colors ${
                                    errors.description ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500' : 'border-slate-300'
                                }`}
                            />
                            {errors.description && <p className="text-xs text-rose-600 font-medium mt-1">{errors.description}</p>}
                        </div>

                        {/* ボタン */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                            <Link
                                href="/admin/rooms"
                                className="px-5 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                            >
                                キャンセル
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold shadow-sm transition-colors disabled:opacity-50"
                            >
                                {processing ? '変更保存中...' : '変更を保存する'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
