import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';

// 💡 props で categories を受け取る
interface Props {
    statusList: Record<string, string>;
}

export default function AdminPlanForm({statusList = {}}: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        price: '',
        status: Object.keys(statusList).length > 0 ? Object.keys(statusList)[0] : '1',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // ⚠️ ファイルを含むマルチパート形式のPOST送信を実行
        post('/admin/plans', {
            forceFormData: true,
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
            <Head title="【管理画面】プラン新規作成" />

            <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10 text-white">
                <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="bg-emerald-600 text-xs px-2 py-0.5 rounded font-bold tracking-wider">ADMIN</span>
                        <h1 className="text-md font-bold tracking-tight">プラン登録</h1>
                    </div>
                    <Link href="/admin/plans" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                        &larr; 管理一覧へ戻る
                    </Link>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">新しいプランの作成</h2>
                    <p className="text-sm text-slate-500 mt-1">
                        期間限定プランの情報を入力して公開または下書き保存します。
                    </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* プラン名 */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">プラン名
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="【秋の味覚フェア】贅沢松茸御膳と源泉かけ流し温泉を満喫プラン"
                                className={`w-full text-sm border rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white placeholder-slate-400 py-2.5 px-3.5 transition-colors ${
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
                                placeholder="プランの具体的な内容や、特典、開催期間などを入力してください。"
                                className={`w-full text-sm border rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white placeholder-slate-400 h-64 p-3.5 transition-colors ${
                                    errors.description ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500' : 'border-slate-300'
                                }`}
                            />
                            {errors.description && <p className="text-xs text-rose-600 font-medium mt-1">{errors.description}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">価格</label>
                            <input
                                type="text"
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value)}
                                placeholder="1200"
                                className={`w-full text-sm border rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white placeholder-slate-400 py-2.5 px-3.5 transition-colors ${
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
                                {processing ? '登録処理中...' : 'プランを確定する'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
