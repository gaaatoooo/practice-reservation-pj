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

export default function AdminNoticeForm({ categories, statusList = {} }: Props) {
    // InertiaのuseFormフックを初期化
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        category: categories.length > 0 ? String(categories[0].id) : '',
        status: Object.keys(statusList).length > 0 ? Object.keys(statusList)[0] : '1',
        content: '',
        public_start_date: '',
        public_end_date: '',
    });

    // フォーム送信ハンドラ
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/notices');
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
            <Head title="【管理画面】お知らせ新規作成" />

            {/* 管理画面専用ヘッダー */}
            <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10 text-white">
                <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="bg-emerald-600 text-xs px-2 py-0.5 rounded font-bold tracking-wider">ADMIN</span>
                        <h1 className="text-md font-bold tracking-tight">お知らせ登録</h1>
                    </div>
                    <Link href="/admin/notices" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                        &larr; 管理一覧へ戻る
                    </Link>
                </div>
            </header>

            {/* メインコンテンツエリア */}
            <main className="max-w-3xl mx-auto px-4 py-8">
                <div className="mb-6">
                    <p className="text-sm text-slate-500 mt-1">
                        館内案内やイベント情報などを保存します。
                    </p>
                </div>

                {/* 入力フォーム本体 */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* タイトル */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">タイトル</label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="全館停電を伴う法定設備点検のお知らせ（10月15日）"
                                className={`w-full text-sm border rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white placeholder-slate-400 py-2.5 px-3.5 transition-colors ${
                                    errors.title ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500' : 'border-slate-300'
                                }`}
                            />
                            {errors.title && <p className="text-xs text-rose-600 font-medium mt-1">{errors.title}</p>}
                        </div>

                        {/* カテゴリ ＆ ステータス (2カラム) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* カテゴリ */}
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

                            {/* 公開ステータス */}
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

                        {/* 本文 */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">本文</label>
                            <textarea
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                placeholder="お知らせの具体的な内容を入力してください。改行はそのまま反映されます。"
                                className={`w-full text-sm border rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white placeholder-slate-400 h-64 p-3.5 transition-colors ${
                                    errors.content ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500' : 'border-slate-300'
                                }`}
                            />
                            {errors.content && <p className="text-xs text-rose-600 font-medium mt-1">{errors.content}</p>}
                        </div>

                        {/* 操作ボタンエリア */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                            <Link
                                href="/admin/notices"
                                className="px-5 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                            >
                                キャンセル
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold shadow-sm transition-colors disabled:opacity-50"
                            >
                                {processing ? '掲載処理中...' : 'お知らせを確定する'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
