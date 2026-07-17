import { Head, Link, router } from '@inertiajs/react';
import { Plus, Trash2, Edit3 } from 'lucide-react';
import React, { useState } from 'react';
import DeleteConfirmModal from '@/components/layout/admin/DeleteConfirmModal';
import Pagination from '@/components/layout/admin/Pagination'; 

interface LinkItem {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    plans: {
        data: any[];
        links: LinkItem[];
        current_page: number;
        last_page: number;
        total: number;
        from?: number; // 💡 何件目から
        to?: number;   // 💡 何件目まで
    };
    statusList: Record<string, string>;
}

export default function AdminPlanList({ plans, statusList = {} }: Props) {
    // 🛡️ モーダル用の管理ステート
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<{ id: number; name: string } | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // 🗑️ ゴミ箱ボタン押下時
    const openDeleteModal = (id: number, name: string) => {
        setSelectedPlan({ id, name });
        setIsModalOpen(true);
    };

    // 🔴 モーダル内での削除確定処理
    const handleConfirmDelete = () => {
        if (!selectedPlan) {
            return;
        }
        
        setIsProcessing(true);
        router.delete(`/admin/plans/${selectedPlan.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsModalOpen(false);
                setSelectedPlan(null);
                setIsProcessing(false);
            },
            onFinish: () => {
                setIsProcessing(false);
            }
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
            <Head title="【管理画面】プラン管理一覧" />

            {/* 管理画面専用ヘッダー */}
            <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10 text-white">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="bg-emerald-600 text-xs px-2 py-0.5 rounded font-bold tracking-wider">ADMIN</span>
                        <h1 className="text-md font-bold tracking-tight">プラン管理</h1>
                    </div>
                    <Link href="/admin/dashboard" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                        ダッシュボードへ戻る &rarr;
                    </Link>
                </div>
            </header>

            {/* メインコンテンツエリア */}
            <main className="max-w-6xl mx-auto px-4 py-8">
                {/* タイトルと新規作成ボタン */}
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <p className="text-sm text-slate-500 mt-1">
                            期間限定宿泊プランなどの作成・編集・掲載制御を行います。
                        </p>
                    </div>
                    <Link
                        href="/admin/plans/create"
                        className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold px-4 py-2.5 rounded-lg shadow-sm transition-colors self-start sm:self-auto"
                    >
                        <Plus className="w-4 h-4" />
                        <span>新しいプランを登録</span>
                    </Link>
                </div>

                {/* テーブルカード */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                                    <th className="py-4 px-6 w-28">作成日</th>
                                    <th className="py-4 px-6 min-w-[15rem]">プラン名</th>
                                    <th className="py-4 px-6 w-32">価格</th>
                                    <th className="py-4 px-6 w-32">公開状況</th>
                                    <th className="py-4 px-6 text-right w-36">操作</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {plans.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-slate-400">
                                            登録されているプランはありません。
                                        </td>
                                    </tr>
                                ) : (
                                    plans.data.map((plan) => {
                                        const formattedDate = new Date(plan.created_at)
                                            .toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' })
                                            .replace(/\//g, '/');

                                        // 🔍 2. 定数オブジェクト（statusList）からステータス名を動的に取得
                                        // 例: statusList = { "1": "下書き", "2": "公開中", "3": "非公開" }
                                        const statusText = statusList[plan.status] || '不明';
                                    
                                        // 🎨 ステータスIDごとの色定義
                                        const statusColors: Record<string, string> = {
                                            '1': 'bg-amber-50 text-amber-700 border-amber-200',      // 下書き
                                            '2': 'bg-emerald-50 text-emerald-700 border-emerald-200',  // 公開中
                                            '3': 'bg-slate-100 text-slate-500 border-slate-200',      // 非公開
                                        };
                                        const statusColor = statusColors[plan.status] || 'bg-slate-100 text-slate-500 border-slate-200';

                                        return (
                                            <tr key={plan.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="py-5 px-6 font-mono text-slate-500 whitespace-nowrap align-middle">
                                                    {formattedDate}
                                                </td>
                                                <td className="py-5 px-6 font-semibold text-slate-800 leading-relaxed align-middle">
                                                    {plan.name}
                                                </td>
                                                <td className="py-5 px-6 font-semibold text-slate-800 leading-relaxed align-middle">
                                                    {plan.price}
                                                </td>
                                                <td className="py-5 px-6 whitespace-nowrap align-middle">
                                                    <span className={`text-xs px-2.5 py-1 rounded-md font-semibold border ${statusColor}`}>
                                                        {statusText}
                                                    </span>
                                                </td>
                                                <td className="py-5 px-6 text-right whitespace-nowrap w-36 align-middle">
                                                    <div className="flex justify-end gap-2">
                                                        <Link
                                                            href={`/admin/plans/${plan.id}/edit`}
                                                            className="p-1.5 text-slate-500 hover:text-indigo-600 border border-slate-200 hover:border-indigo-200 rounded-md bg-white hover:bg-indigo-50/30 transition-all"
                                                            title="編集"
                                                        >
                                                            <Edit3 className="w-4 h-4" />
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            onClick={() => openDeleteModal(plan.id, plan.name)}
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
                        <Pagination meta={plans} />
                    </div>
                </div>
            </main>
            {/* 削除確認モーダル */}
            <DeleteConfirmModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={handleConfirmDelete}
                    title={selectedPlan?.name || ''}
                    processing={isProcessing}
                />
        </div>
    );
}