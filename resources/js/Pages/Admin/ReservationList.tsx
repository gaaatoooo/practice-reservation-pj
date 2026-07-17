import { Head, Link, router } from '@inertiajs/react';
import { Plus, ChevronDown, ChevronUp, Search, FileDown, FileText } from 'lucide-react';
import React, { useState } from 'react';
import Pagination from '@/components/layout/admin/Pagination'; 
import { Button } from '@/components/ui/button';

interface LinkItem {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    reservations: {
        data: any[];
        links: LinkItem[];
        current_page: number;
        last_page: number;
        total: number;
        from?: number; // 💡 何件目から
        to?: number;   // 💡 何件目まで
    };
    filters: {
        reservation_id?: string;
        user_name?: string;
        user_tel?: string;
        status?: string;
        date_from?: string;
        date_to?: string;
    };
}

export default function AdminReservationList({ reservations, filters }: Props) {
    // 🔍 検索条件パネルの開閉ステート（デフォルトは開く）
    const [isSearchOpen, setIsSearchOpen] = useState(true);

    const [values, setValues] = useState({
        reservation_id: filters.reservation_id || '',
        user_name: filters.user_name || '',
        user_tel: filters.user_tel || '',
        status: filters.status || '',
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setValues((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/reservations', values, {
            preserveState: true,
            replace: true,
        });
    };

    const handleReset = () => {
        const resetValues = {
            reservation_id: '',
            user_name: '',
            user_tel: '',
            status: '',
            date_from: '',
            date_to: '',
        };
        setValues(resetValues);
        router.get('/admin/reservations', resetValues);
    };

    // ⭕️ CSV出力ハンドラ（現在の検索条件を引き継ぐ）
    const handleCsvExport = () => {
        const queryParams = new URLSearchParams();
        
        // values内の空ではない検索条件をループでパラメータにセット
        Object.entries(values).forEach(([key, value]) => {
            if (value) {
                queryParams.append(key, String(value));
            }
        });
        
        // CSV出力用の識別フラグを追加
        queryParams.append('export', 'csv');
        
        // ファイルダウンロードを実行
        window.location.href = `/admin/reservations?${queryParams.toString()}`;
    };

    // ⭕️ PDF出力ハンドラ（現在の検索条件を引き継ぎ、別タブで開く）
    const handlePdfExport = () => {
        const queryParams = new URLSearchParams();
        
        // values内の空ではない検索条件をループでパラメータにセット
        Object.entries(values).forEach(([key, value]) => {
            if (value) {
                queryParams.append(key, String(value));
            }
        });
        
        // PDF出力用の識別フラグを追加
        queryParams.append('export', 'pdf');
        
        // PDFはブラウザの別タブで綺麗にプレビュー表示させるのが一般的なため、_blank で開きます
        window.open(`/admin/reservations?${queryParams.toString()}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
            <Head title="【管理画面】予約管理一覧" />

            {/* 管理画面専用ヘッダー */}
            <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10 text-white">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="bg-emerald-600 text-xs px-2 py-0.5 rounded font-bold tracking-wider">ADMIN</span>
                        <h1 className="text-md font-bold tracking-tight">予約管理</h1>
                    </div>
                    <Link href="/admin/dashboard" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                        ダッシュボードへ戻る &rarr;
                    </Link>
                </div>
            </header>

            {/* メインコンテンツエリア */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* タイトルと件数表示 */}
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <p className="text-sm text-slate-500 mt-1">
                            登録されているすべての予約・キャンセル履歴の検索および管理を行います。
                            <span className="ml-2 text-slate-700 font-semibold">
                                （該当件数: <span className="text-indigo-600 font-bold">{reservations.data.length}</span> 件）
                            </span>
                        </p>
                    </div>
                    <Link
                        href="/admin/reservations/create"
                        className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold px-4 py-2.5 rounded-lg shadow-sm transition-colors self-start sm:self-auto"
                    >
                        <Plus className="w-4 h-4" />
                        <span>新しい予約を登録</span>
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
                                    {/* 予約ID */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">予約ID</label>
                                        <input
                                            type="text"
                                            name="reservation_id"
                                            value={values.reservation_id}
                                            onChange={handleChange}
                                            placeholder="例: 12"
                                            className="w-full text-sm border border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white placeholder-slate-400"
                                        />
                                    </div>

                                    {/* 宿泊者名 */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">宿泊者名</label>
                                        <input
                                            type="text"
                                            name="user_name"
                                            value={values.user_name}
                                            onChange={handleChange}
                                            placeholder="氏名を入力"
                                            className="w-full text-sm border border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white placeholder-slate-400"
                                        />
                                    </div>

                                    {/* 電話番号 */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">電話番号</label>
                                        <input
                                            type="text"
                                            name="user_tel"
                                            value={values.user_tel}
                                            onChange={handleChange}
                                            placeholder="ハイフンなし"
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
                                            <option value="">すべて</option>
                                            <option value="1">確定（予約中）</option>
                                            <option value="2">キャンセル済</option>
                                        </select>
                                    </div>

                                    {/* 期間指定 */}
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold text-slate-500 mb-1">宿泊期間指定</label>
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

                {/* ⭕️ 一覧行の上の操作エリア（CSV出力 ＆ PDF出力を横並びで配置） */}
                <div className="flex justify-end items-center gap-2 mb-3">
                    {/* CSV出力ボタン */}
                    <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        className="h-9 border-slate-200 text-slate-600 hover:bg-slate-50 gap-1.5"
                        onClick={handleCsvExport}
                    >
                        <FileDown className="w-4 h-4 text-emerald-600" />
                        <span>CSV出力</span>
                    </Button>

                    {/* PDF出力ボタン */}
                    <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        className="h-9 border-slate-200 text-slate-600 hover:bg-slate-50 gap-1.5"
                        onClick={handlePdfExport}
                    >
                        <FileText className="w-4 h-4 text-rose-600" />
                        <span>PDF出力</span>
                    </Button>
                </div>

                {/* テーブルカード */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                                    <th className="py-4 px-6 w-20">予約ID</th>
                                    <th className="py-4 px-6 min-w-[12rem]">宿泊者名</th>
                                    <th className="py-4 px-6">お部屋</th>
                                    <th className="py-4 px-6">宿泊期間</th>
                                    <th className="py-4 px-6">合計金額</th>
                                    {/* ⭕️ ステータス列の横幅を固定して折り返しを防止 */}
                                    <th className="py-4 px-6 w-40 min-w-[10rem]">ステータス</th>
                                    <th className="py-4 px-6 w-24">操作</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {reservations.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center text-slate-400">
                                            検索条件に一致する予約データは見つかりませんでした。
                                        </td>
                                    </tr>
                                ) : (
                                    reservations.data.map((res) => {
                                        let statusText = '確定（予約中）';
                                        let statusColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                                        
                                        if (res.status === 2) {
                                            statusText = 'キャンセル済';
                                            statusColor = 'bg-rose-50 text-rose-700 border-rose-200';
                                        }
                                        
                                        return (
                                            <tr key={res.id} className="hover:bg-slate-50/50 transition-colors">
                                                {/* 予約ID */}
                                                <td className="py-4 px-6 font-mono font-medium text-slate-400">
                                                    #{res.id}
                                                </td>
                                                
                                                {/* 宿泊者名 */}
                                                <td className="py-4 px-6">
                                                    <div className="font-semibold text-slate-800">
                                                        {res.user?.name || '不明なユーザー'}
                                                    </div>
                                                    <div className="text-xs text-slate-400 font-mono">
                                                        {res.user?.email}
                                                    </div>
                                                </td>
                                                
                                                {/* お部屋 */}
                                                <td className="py-4 px-6 font-medium text-slate-700">
                                                    {res.room?.name || '削除された部屋'}
                                                </td>
                                                
                                                {/* 宿泊期間 */}
                                                <td className="py-4 px-6 text-slate-600">
                                                    <div className="font-medium">{res.reservation_start_date.replace(/-/g, '/')} ～</div>
                                                    <div className="text-xs text-slate-400">{res.reservation_end_date.replace(/-/g, '/')} まで</div>
                                                </td>
                                                
                                                {/* 合計金額 */}
                                                <td className="py-4 px-6 font-bold text-slate-800">
                                                    ¥{res.total_price.toLocaleString()}
                                                </td>
                                                
                                                {/* ステータス（絶対に折り返さないよう固定幅とインラインブロック化） */}
                                                <td className="py-4 px-6 w-40 min-w-[10rem] whitespace-nowrap">
                                                    <span className={`inline-block text-center text-xs px-2.5 py-1 rounded-md font-semibold border w-full ${statusColor}`}>
                                                        {statusText}
                                                    </span>
                                                </td>
                                                
                                                {/* 操作ボタン */}
                                                <td className="py-4 px-6 text-right w-24">
                                                    <Link 
                                                        href={`/admin/reservations/${res.id}`}
                                                        className="inline-block text-xs font-bold bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 px-3 py-1.5 rounded-lg shadow-sm transition-colors text-center"
                                                    >
                                                        詳細
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                        <Pagination meta={reservations} />
                    </div>
                </div>
            </main>
        </div>
    );
}
