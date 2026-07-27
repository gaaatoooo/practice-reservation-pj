import { Head, Link, router } from '@inertiajs/react';
import { Plus, Trash2, Edit3, ChevronDown, ChevronUp, Search } from 'lucide-react';
import React, { useState } from 'react';
import DeleteConfirmModal from '@/components/layout/admin/DeleteConfirmModal';
import FlashMessage from '@/components/layout/admin/FlashMessage';
import Pagination from '@/components/layout/admin/Pagination'; 

interface LinkItem {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    rooms: {
        data: any[];
        links: LinkItem[];
        current_page: number;
        last_page: number;
        total: number;
        from?: number; // 💡 何件目から
        to?: number;   // 💡 何件目まで
    };
    filters: {
        name?: string;
        status?: number;
    };
    statusList: Record<string, string>;
}

export default function AdminRoomList({ rooms, filters = {}, statusList = {} }: Props) {
    // 🛡️ モーダル用の管理ステート
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<{ id: number; name: string } | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // 🔍 検索条件パネルの開閉ステート（デフォルトは開く）
    const [isSearchOpen, setIsSearchOpen] = useState(true);
        
    const [values, setValues] = useState({
        name: filters.name || '',
        status: filters.status || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setValues((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };
        
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/rooms', values, {
            preserveState: true,
            replace: true,
        });
    };
        
    const handleReset = () => {
        const resetValues = {
            name: '',
            status: '',
        };
        setValues(resetValues);
        router.get('/admin/rooms', resetValues);
    };

    // 🗑️ ゴミ箱ボタン押下時
    const openDeleteModal = (id: number, name: string) => {
        setSelectedRoom({ id, name });
        setIsModalOpen(true);
    };

    // 🔴 モーダル内での削除確定処理
    const handleConfirmDelete = () => {
        if (!selectedRoom) {
            return;
        }
        
        setIsProcessing(true);
        router.delete(`/admin/rooms/${selectedRoom.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsModalOpen(false);
                setSelectedRoom(null);
                setIsProcessing(false);
            },
            onFinish: () => {
                setIsProcessing(false);
            }
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
            <Head title="【管理画面】部屋管理一覧" />

            {/* 管理画面専用ヘッダー */}
            <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10 text-white">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="bg-emerald-600 text-xs px-2 py-0.5 rounded font-bold tracking-wider">ADMIN</span>
                        <h1 className="text-md font-bold tracking-tight">部屋管理</h1>
                    </div>
                    <Link href="/admin/dashboard" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                        ダッシュボードへ戻る &rarr;
                    </Link>
                </div>
            </header>

            {/* メインコンテンツエリア */}
            <main className="max-w-6xl mx-auto px-4 py-8">
                <FlashMessage />
                {/* タイトルと新規作成ボタン */}
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <p className="text-sm text-slate-500 mt-1">
                            部屋の作成・編集を行います。
                        </p>
                    </div>
                    <Link
                        href="/admin/rooms/create"
                        className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold px-4 py-2.5 rounded-lg shadow-sm transition-colors self-start sm:self-auto"
                    >
                        <Plus className="w-4 h-4" />
                        <span>新しい部屋を登録</span>
                    </Link>
                </div>

                {/* 🔍 検索条件エリア（開閉可能パネル） */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-6">
                    {/* アコーディオンヘッダー */}
                    <button
                        type="button"
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                        className="w-full flex items-center justify-between px-5 py-4 bg-slate-50 hover:bg-slate-100/70 border-b border-slate-200 transition-colors"
                    >
                        <div className="flex items-center gap-2 font-bold text-sm text-slate-700">
                            <Search className="w-4 h-4 text-slate-500" />
                            <span>検索条件を指定する</span>
                        </div>
                        {isSearchOpen ? (
                            <ChevronUp className="w-4 h-4 text-slate-500" />
                        ) : (
                            <ChevronDown className="w-4 h-4 text-slate-500" />
                        )}
                    </button>
                
                    {/* アコーディオンボディ */}
                    {isSearchOpen && (
                        <div className="p-5 animate-in fade-in duration-200">
                            <form onSubmit={handleSearch} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {/* 部屋名 */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">部屋名</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={values.name}
                                            onChange={handleChange}
                                            placeholder="部屋名を入力"
                                            className="w-full text-sm border border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white placeholder-slate-400"
                                        />
                                    </div>
                
                                    {/* ステータス */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">ステータス</label>
                                        <select
                                            name="status"
                                            value={values.status}
                                            onChange={handleChange}
                                            className="w-full text-sm border border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white"
                                        >
                                            <option value="">すべて選択</option>
                                            {Object.entries(statusList).map(([key, label]) => (
                                                <option key={key} value={key}>
                                                    {label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* アクションボタン */}
                                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                                    >
                                        クリア
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold shadow-sm transition-colors"
                                    >
                                        この条件で検索
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>

                {/* テーブルカード */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                                    <th className="py-4 px-6 w-28">作成日</th>
                                    <th className="py-4 px-6 min-w-[15rem]">部屋名</th>
                                    <th className="py-4 px-6 w-32">価格</th>
                                    <th className="py-4 px-6 w-32">ステータス</th>
                                    <th className="py-4 px-6 text-right w-36">操作</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {rooms.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-slate-400">
                                            登録されているフェア・プランはありません。
                                        </td>
                                    </tr>
                                ) : (
                                    rooms.data.map((room) => {
                                        const formattedDate = new Date(room.created_at)
                                            .toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' })
                                            .replace(/\//g, '/');

                                        // 🔍 2. 定数オブジェクト（statusList）からステータス名を動的に取得
                                        // 例: statusList = { "1": "公開", "2": "非公開" }
                                        
                                        const statusText = statusList[room.status] || '不明';
                                    
                                        // 🎨 ステータスIDごとの色定義
                                        const statusColors: Record<string, string> = {
                                            '1': 'bg-emerald-50 text-emerald-700 border-emerald-200',  // 公開中
                                            '2': 'bg-slate-100 text-slate-500 border-slate-200',      // 非公開
                                        };
                                        const statusColor = statusColors[room.status] || 'bg-slate-100 text-slate-500 border-slate-200';

                                        return (
                                            <tr key={room.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="py-5 px-6 font-mono text-slate-500 whitespace-nowrap align-middle">
                                                    {formattedDate}
                                                </td>
                                                <td className="py-5 px-6 font-semibold text-slate-800 leading-relaxed align-middle">
                                                    {room.name}
                                                </td>
                                                <td className="py-5 px-6 font-semibold text-slate-800 leading-relaxed align-middle">
                                                    {room.price}
                                                </td>
                                                <td className="py-5 px-6 whitespace-nowrap align-middle">
                                                    <span className={`text-xs px-2.5 py-1 rounded-md font-semibold border ${statusColor}`}>
                                                        {statusText}
                                                    </span>
                                                </td>
                                                <td className="py-5 px-6 text-right whitespace-nowrap w-36 align-middle">
                                                    <div className="flex justify-end gap-2">
                                                        <Link
                                                            href={`/admin/rooms/${room.id}/edit`}
                                                            className="p-1.5 text-slate-500 hover:text-indigo-600 border border-slate-200 hover:border-indigo-200 rounded-md bg-white hover:bg-indigo-50/30 transition-all"
                                                            title="編集"
                                                        >
                                                            <Edit3 className="w-4 h-4" />
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            onClick={() => openDeleteModal(room.id, room.name)}
                                                            className="p-1.5 text-slate-400 hover:text-rose-600 border border-slate-200 hover:border-rose-200 rounded-md bg-white hover:bg-rose-50/30 transition-all"
                                                            title="削除"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                        <Pagination meta={rooms} />
                    </div>
                </div>
            </main>
            {/* 削除確認モーダル */}
            <DeleteConfirmModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={handleConfirmDelete}
                    title={selectedRoom?.name || ''}
                    processing={isProcessing}
                />
        </div>
    );
}