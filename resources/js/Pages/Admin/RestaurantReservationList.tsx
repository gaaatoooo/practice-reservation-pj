import { Head, Link, router, usePage } from '@inertiajs/react';
import { Plus, ChevronDown, ChevronUp, Search, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import DeleteConfirmModal from '@/components/layout/admin/DeleteConfirmModal';
import Pagination from '@/components/layout/admin/Pagination';

interface LinkItem {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    stocks: {
        data: any[];
        links: LinkItem[];
        current_page: number;
        last_page: number;
        total: number;
        from?: number;
        to?: number;
    };
    filters: {
        date_from?: string;
        date_to?: string;
    };
}

interface PageProps extends Record<string, any> {
    flash: {
        success: string | null;
        error: string | null;
    };
}

export default function AdminRestaurantReservationList({ stocks, filters }: Props) {
    const [isSearchOpen, setIsSearchOpen] = useState(true);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedStock, setSelectedStock] = useState<{ id: number; label: string; updatedAt: string } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [values, setValues] = useState({
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
    });

    // ⭕️ フラッシュメッセージ用ステート・ロジックを追加
    const { flash } = usePage<PageProps>().props;
    const [flashMessage, setFlashMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        if (flash.success) {
            setFlashMessage({ type: 'success', text: flash.success });
            const timer = setTimeout(() => setFlashMessage(null), 3000);
            
            return () => clearTimeout(timer);
        }

        if (flash.error) {
            setFlashMessage({ type: 'error', text: flash.error });
            const timer = setTimeout(() => setFlashMessage(null), 3000);
            
            return () => clearTimeout(timer);
        }
    }, [flash.success, flash.error]);

    const openDeleteModal = (id: number, label: string, updatedAt: string) => {
        setSelectedStock({ id, label, updatedAt });
        setIsDeleteModalOpen(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setValues((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleConfirmDelete = () => {
        if (!selectedStock) {
            return;
        }

        setIsDeleting(true);
        router.delete(`/admin/restaurant_reservations/${selectedStock.id}`, {
            data: { updated_at: selectedStock.updatedAt },
            preserveScroll: true,
            onFinish: () => {
                setIsDeleting(false);
                setIsDeleteModalOpen(false);
                setSelectedStock(null);
            },
        });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/restaurant_reservations', values, {
            preserveState: true,
            replace: true,
        });
    };

    const handleReset = () => {
        const resetValues = {
            date_from: '',
            date_to: '',
        };
        setValues(resetValues);
        router.get('/admin/restaurant_reservations', resetValues);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
            <Head title="【管理画面】レストラン予約管理一覧" />

            <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10 text-white">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="bg-emerald-600 text-xs px-2 py-0.5 rounded font-bold tracking-wider">ADMIN</span>
                        <h1 className="text-md font-bold tracking-tight">レストラン予約管理</h1>
                    </div>
                    <Link href="/admin/dashboard" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                        ダッシュボードへ戻る &rarr;
                    </Link>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* ⭕️ フラッシュメッセージ表示エリアを追加 */}
                {flashMessage && (
                    <div className={`flex items-center gap-2 px-4 py-3 mb-4 rounded-xl text-sm font-medium shadow-sm ${
                        flashMessage.type === 'success'
                            ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                            : 'bg-rose-50 border border-rose-200 text-rose-800'
                    }`}>
                        {flashMessage.type === 'success' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                        <span>{flashMessage.text}</span>
                    </div>
                )}

                <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <p className="text-sm text-slate-500 mt-1">
                            登録されているすべてのレストラン予約・キャンセル履歴の検索および管理を行います。
                            <span className="ml-2 text-slate-700 font-semibold">
                                （該当件数: <span className="text-indigo-600 font-bold">{stocks.data.length}</span> 件）
                            </span>
                        </p>
                    </div>
                    <Link
                        href="/admin/restaurant_reservations/create"
                        className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold px-4 py-2.5 rounded-lg shadow-sm transition-colors self-start sm:self-auto"
                    >
                        <Plus className="w-4 h-4" />
                        <span>新しい予約枠を登録</span>
                    </Link>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-6">
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

                    {isSearchOpen && (
                        <div className="p-5 animate-in fade-in duration-200">
                            <form onSubmit={handleSearch} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold text-slate-500 mb-1">レストラン予約期間</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="date"
                                                name="date_from"
                                                value={values.date_from}
                                                onChange={handleChange}
                                                className="w-full text-sm border border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white"
                                            />
                                            <span className="text-slate-400 text-sm">～</span>
                                            <input
                                                type="date"
                                                name="date_to"
                                                value={values.date_to}
                                                onChange={handleChange}
                                                className="w-full text-sm border border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white"
                                            />
                                        </div>
                                    </div>
                                </div>

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

                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                                    <th className="py-4 px-6 w-20">予約ID</th>
                                    <th className="py-4 px-6">日付</th>
                                    <th className="py-4 px-6">時刻</th>
                                    <th className="py-4 px-6">最大人数</th>
                                    <th className="py-4 px-6 w-24">操作</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {stocks.data.length === 0 ? (
                                    <tr>
                                        {/* ⭕️ colSpanを実際の列数(5)に修正 */}
                                        <td colSpan={5} className="py-12 text-center text-slate-400">
                                            検索条件に一致する予約データは見つかりませんでした。
                                        </td>
                                    </tr>
                                ) : (
                                    stocks.data.map((res) => {
                                        const formattedDate = new Date(res.date)
                                            .toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' })
                                            .replace(/\//g, '/');

                                        return (
                                            <tr key={res.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="py-4 px-6 font-mono font-medium text-slate-400">
                                                    #{res.id}
                                                </td>

                                                <td className="py-4 px-6">
                                                    <div className="font-semibold text-slate-800">
                                                        {formattedDate}
                                                    </div>
                                                </td>

                                                <td className="py-4 px-6 font-medium text-slate-700">
                                                    {res.time}
                                                </td>

                                                <td className="py-4 px-6 font-bold text-slate-800">
                                                    {res.capacity}
                                                </td>

                                                {/* ⭕️ 操作ボタンをflexで横並びに整理 */}
                                                <td className="py-4 px-6 text-right w-24">
                                                    <div className="flex justify-end items-center gap-1.5">
                                                        <Link
                                                            href={`/admin/restaurant_reservations/${res.id}/edit`}
                                                            className="inline-flex items-center justify-center whitespace-nowrap text-xs font-bold bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 px-3 py-1.5 rounded-lg shadow-sm transition-colors h-8"
                                                        >
                                                            編集
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            onClick={() => openDeleteModal(res.id, `${res.date} ${res.time}`)}
                                                            className="inline-flex items-center justify-center text-slate-400 hover:text-rose-600 border border-slate-200 hover:border-rose-200 rounded-lg bg-white hover:bg-rose-50/30 transition-all h-8 w-8"
                                                            title="削除"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                        <Pagination meta={stocks} />
                    </div>
                </div>
            </main>
            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                processing={isDeleting}
                title={selectedStock?.label || ''}
            />
        </div>
    );
}