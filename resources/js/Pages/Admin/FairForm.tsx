import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';

// 💡 カテゴリの型定義を追加
interface Category {
    id: number;
    name: string;
}

// 💡 props で categories を受け取る
interface Props {
    categories: Category[];
    statusList: Record<string, string>;
}

export default function AdminFairForm({ categories, statusList = {} }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        category: categories.length > 0 ? String(categories[0].id) : '',
        status: Object.keys(statusList).length > 0 ? Object.keys(statusList)[0] : '1',
        description: '',
        image: null as File | null,
        public_start_date: '',
        public_end_date: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // ⚠️ ファイルを含むマルチパート形式のPOST送信を実行
        post('/admin/fairs', {
            forceFormData: true,
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
            <Head title="【管理画面】フェア新規作成" />

            <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10 text-white">
                <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="bg-emerald-600 text-xs px-2 py-0.5 rounded font-bold tracking-wider">ADMIN</span>
                        <h1 className="text-md font-bold tracking-tight">フェア登録</h1>
                    </div>
                    <Link href="/admin/fairs" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                        &larr; 管理一覧へ戻る
                    </Link>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-8">
                <div className="mb-6">
                    <p className="text-sm text-slate-500 mt-1">
                        特設フェアや期間限定プランの情報を保存します。
                    </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* フェアタイトル */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">タイトル</label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="【秋の味覚フェア】贅沢松茸御膳と源泉かけ流し温泉を満喫プラン"
                                className={`w-full text-sm border rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white placeholder-slate-400 py-2.5 px-3.5 transition-colors ${
                                    errors.title ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500' : 'border-slate-300'
                                }`}
                            />
                            {errors.title && <p className="text-xs text-rose-600 font-medium mt-1">{errors.title}</p>}
                        </div>

                        {/* カテゴリ ＆ ステータス */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">カテゴリ</label>
                                <select
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value)}
                                    className="w-full text-sm border border-slate-300 rounded-lg focus:border-indigo-500 bg-white py-2.5 px-3.5"
                                >
                                    {/* 💡 ループで動的にoptionタグを生成 */}
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

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

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="public_start_date" className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
                                    公開開始日
                                </label>
                                <input
                                    type="date"
                                    id="public_start_date"
                                    value={data.public_start_date}
                                    onChange={(e) => setData('public_start_date', e.target.value)}
                                    className="w-full bg-transparent border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors font-mono"
                                />
                                {errors.public_start_date && <p className="text-xs font-medium text-rose-600 mt-0.5">{errors.public_start_date}</p>}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="public_end_date" className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
                                    公開終了日
                                </label>
                                <input
                                    type="date"
                                    id="public_end_date"
                                    value={data.public_end_date}
                                    onChange={(e) => setData('public_end_date', e.target.value)}
                                    className="w-full bg-transparent border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors font-mono"
                                />
                                {errors.public_end_date && <p className="text-xs font-medium text-rose-600 mt-0.5">{errors.public_end_date}</p>}
                            </div>
                        </div>

                        {/* ⭕️ 画像アップロード項目 */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">フェア画像</label>
                            <input
                                type="file"
                                accept="image/*"
                                // e.target.files[0] を取得するように修正
                                onChange={(e) => setData('image', e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                                className={`w-full text-sm border rounded-lg bg-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-slate-800 py-1.5 px-3 transition-colors ${
                                    errors.image ? 'border-rose-400 focus:border-rose-500' : 'border-slate-300'
                                }`}
                            />
                            <p className="text-xs text-slate-400 mt-1">※ jpeg, png, jpg, webp 形式（20MB以内推奨）</p>
                            {errors.image && <p className="text-xs text-rose-600 font-medium mt-1">{errors.image}</p>}
                        </div>

                        {/* フェア内容 (description) */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">内容</label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="フェアの具体的な内容や、特典、開催期間などを入力してください。"
                                className={`w-full text-sm border rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white placeholder-slate-400 h-64 p-3.5 transition-colors ${
                                    errors.description ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500' : 'border-slate-300'
                                }`}
                            />
                            {errors.description && <p className="text-xs text-rose-600 font-medium mt-1">{errors.description}</p>}
                        </div>

                        {/* ボタン */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                            <Link
                                href="/admin/fairs"
                                className="px-5 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                            >
                                キャンセル
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold shadow-sm transition-colors disabled:opacity-50"
                            >
                                {processing ? '掲載処理中...' : 'フェアを確定する'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
