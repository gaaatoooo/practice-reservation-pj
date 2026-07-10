import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import { Plus, Trash2, Edit2, Check, X, Pencil, CheckCircle2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import DeleteConfirmModal from '@/components/layout/admin/DeleteConfirmModal';

interface CategoryItem {
    id: number;
    name: string;
}

interface Props {
    categories: CategoryItem[];
}

export default function AdminNoticeCategoryList({ categories }: Props) {
    const { flash } = usePage<PageProps>().props;
    const [flashMessage, setFlashMessage] = useState<string | null>(null);
    
    // ⭕️ フラッシュメッセージが届いたら画面にセットし、3秒後に自動消滅させる
    useEffect(() => {
        if (flash.success) {
            setFlashMessage(flash.success);
            const timer = setTimeout(() => {
                setFlashMessage(null);
            }, 3000);
    
            return () => clearTimeout(timer);
        }
    }, [flash.success, categories]);

    // ✏️ インライン編集モード管理ステート
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingName, setEditingName] = useState('');

    // 🛡️ 自作確認モーダル用ステート
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<{ id: number; name: string } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // ➕ クイック新規追加用フォーム
    const addForm = useForm({ name: '' });

    // 新規追加送信
    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addForm.post('/admin/notice-categories', {
            onSuccess: () => {
                addForm.reset();
                // ⭕️ 送信成功時にローカルステートに直接テキストを注入
                setFlashMessage('新しいフェアカテゴリを登録しました。');
                setTimeout(() => setFlashMessage(null), 3000);
            },
        });
    };

    // 編集モード開始
    const startEdit = (id: number, currentName: string) => {
        setEditingId(id);
        setEditingName(currentName);
    };

    // 編集キャンセル
    const cancelEdit = () => {
        setEditingId(null);
        setEditingName('');
    };

    // 編集上書き保存送信
    const handleUpdateSubmit = (id: number) => {
        if (!editingName.trim()) {
            return;
        }

        router.patch(`/admin/notice-categories/${id}`, { name: editingName }, {
            onSuccess: () => {
                setEditingId(null);
                // ⭕️ 更新成功時にローカルステートに直接テキストを注入
                setFlashMessage('お知らせカテゴリ名を変更しました。');
                setTimeout(() => setFlashMessage(null), 3000);
            },
        });
    };

    // 削除確認モーダル展開
    const openDeleteModal = (id: number, name: string) => {
        setSelectedCategory({ id, name });
        setIsDeleteModalOpen(true);
    };

    // 削除確定送信
    const handleConfirmDelete = () => {
        if (!selectedCategory) {
            return;
        }

        setIsDeleting(true);
        router.delete(`/admin/notice-categories/${selectedCategory.id}`, {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setSelectedCategory(null);
            },
            onFinish: () => setIsDeleting(false),
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
            <Head title="【管理画面】お知らせカテゴリ管理" />

            {/* 管理画面専用ヘッダー */}
            <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10 text-white">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="bg-emerald-600 text-xs px-2 py-0.5 rounded font-bold tracking-wider">ADMIN</span>
                        <h1 className="text-md font-bold tracking-tight">お知らせカテゴリ管理</h1>
                    </div>
                    <Link href="/admin/dashboard" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                        ダッシュボードへ戻る &rarr;
                    </Link>
                </div>
            </header>

            {/* メインコンテンツエリア */}
            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* ⭕️ ローカルステートで確実に制御・表示する通知バー */}
                {flashMessage && (
                    <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 mb-2 rounded-xl transition-all duration-300 animate-fade-in text-sm font-medium shadow-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{flashMessage}</span>
                    </div>
                )}

                <div className="mb-6">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">お知らせカテゴリマスタ</h2>
                    <p className="text-sm text-slate-500 mt-1">
                        インフォメーション機能（お知らせ一覧）の分類に使用するマスタデータの管理画面です。
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    {/* クイック追加カード */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 space-y-4">
                        <h3 className="text-sm font-bold text-slate-700">新しいカテゴリの追加</h3>
                        <form onSubmit={handleAddSubmit} className="space-y-3">
                            <div>
                                <input
                                    type="text"
                                    value={addForm.data.name}
                                    onChange={(e) => addForm.setData('name', e.target.value)}
                                    placeholder="例: 重要なお知らせ"
                                    className={`w-full text-sm border rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white placeholder-slate-400 py-2 px-3 transition-colors ${
                                        addForm.errors.name ? 'border-rose-400' : 'border-slate-300'
                                    }`}
                                />
                                {addForm.errors.name && (
                                    <p className="text-xs text-rose-600 font-medium mt-1">{addForm.errors.name}</p>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={addForm.processing}
                                className="w-full flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2.5 rounded-lg shadow-sm transition-colors disabled:opacity-50"
                            >
                                <Plus className="w-4 h-4" />
                                <span>マスタへ登録</span>
                            </button>
                        </form>
                    </div>

                    {/* テーブルリスト */}
                    <div className="md:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                                    <th className="py-3 px-5 w-20">ID</th>
                                    <th className="py-3 px-5">カテゴリ名</th>
                                    <th className="py-3 px-5 text-right w-28">操作</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {categories.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="py-10 text-center text-slate-400">
                                            登録されているお知らせカテゴリはありません。
                                        </td>
                                    </tr>
                                ) : (
                                    categories.map((cat) => (
                                        <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="py-3.5 px-5 font-mono text-slate-400 align-middle">
                                                #{cat.id}
                                            </td>
                                            <td className="py-3.5 px-5 align-middle">
                                                {editingId === cat.id ? (
                                                    <input
                                                        type="text"
                                                        value={editingName}
                                                        onChange={(e) => setEditingName(e.target.value)}
                                                        className="w-full text-sm border border-indigo-500 rounded-md bg-white py-1 px-2.5 focus:ring-1 focus:ring-indigo-500 font-medium"
                                                        autoFocus
                                                    />
                                                ) : (
                                                    <span className="font-semibold text-slate-800">{cat.name}</span>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-5 text-right align-middle w-28">
                                                {editingId === cat.id ? (
                                                    <div className="flex justify-end gap-1.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleUpdateSubmit(cat.id)}
                                                            className="p-1 text-emerald-600 hover:bg-emerald-50 border border-emerald-200 rounded-md transition-all"
                                                            title="確定"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={cancelEdit}
                                                            className="p-1 text-slate-400 hover:bg-slate-50 border border-slate-200 rounded-md transition-all"
                                                            title="閉じる"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex justify-end gap-1.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => startEdit(cat.id, cat.name)}
                                                            className="p-1.5 text-slate-500 hover:text-indigo-600 border border-slate-200 hover:border-indigo-200 rounded-md bg-white hover:bg-indigo-50/30 transition-all"
                                                            title="編集"
                                                        >
                                                            <Edit2 className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => openDeleteModal(cat.id, cat.name)}
                                                            className="p-1.5 text-slate-400 hover:text-rose-600 border border-slate-200 hover:border-rose-200 rounded-md bg-white hover:bg-rose-50/30 transition-all"
                                                            title="削除"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* 🛡️ 削除確認モーダル */}
            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                processing={isDeleting}
                title={selectedCategory?.name || ''}
            />
        </div>
    );
}
