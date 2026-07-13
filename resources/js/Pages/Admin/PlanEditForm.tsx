import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';

interface PlanItem {
    id: number;
    name: string;
    status: number;
    description: string; // ⭕️ description に修正
    price: string;
}

interface Props {
    plan: PlanItem;
    statusList: Record<string, string>;
}

export default function AdminPlanEditForm({ plan, statusList = {} }: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        name: plan.name,
        status: String(plan.status),
        description: plan.description, // ⭕️ description に修正
        price: plan.price,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // ⚠️ FormData を画像付きで送るため、PATCHではなく、POSTの引数として送信します
        patch(`/admin/plans/${plan.id}`);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
            <Head title={`【管理画面】プラン編集 #${plan.id}`} />

            <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10 text-white">
                <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="bg-emerald-600 text-xs px-2 py-0.5 rounded font-bold tracking-wider">ADMIN</span>
                        <h1 className="text-md font-bold tracking-tight">プラン編集</h1>
                    </div>
                    <Link href="/admin/plans" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                        &larr; 管理一覧へ戻る
                    </Link>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">フェア・プランの編集</h2>
                    <p className="text-sm text-slate-500 mt-1">
                        プラン内容を修正し、上書き保存します。
                    </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* プラン名 */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">フェアタイトル</label>
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

                        {/* プラン内容 (description) */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">プラン内容</label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className={`w-full text-sm border rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white h-64 p-3.5 transition-colors ${
                                    errors.description ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500' : 'border-slate-300'
                                }`}
                            />
                            {errors.description && <p className="text-xs text-rose-600 font-medium mt-1">{errors.description}</p>}
                        </div>

                        {/* 価格 */}
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

                        {/* ボタン */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                            <Link
                                href="/admin/plans"
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
