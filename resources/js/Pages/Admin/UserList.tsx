import { Head, Link, router } from '@inertiajs/react';
import { Plus, Trash2, Edit } from 'lucide-react';
import React, { useState } from 'react';
import DeleteConfirmModal from '@/components/layout/admin/DeleteConfirmModal';
import { Button } from '@/components/ui/button';

type AdminUser = {
    id: number;
    name: string;
    email: string;
    created_at: string;
};

type Props = {
    admins: {
        data: AdminUser[];
        links: any[];
    };
    status?: string;
    error?: string;
};

export default function Index({ admins, status, error }: Props) {

    // 🛡️ 自作確認モーダル用ステート
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<{ id: number; name: string } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // 削除確認モーダル展開
        const openDeleteModal = (id: number, name: string) => {
            setSelectedUser({ id, name });
            setIsDeleteModalOpen(true);
        };
    
        // 削除確定送信
        const handleConfirmDelete = () => {
            if (!selectedUser) {
                return;
            }
    
            setIsDeleting(true);
            router.delete(`/admin/users/${selectedUser.id}`, {
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                    setSelectedUser(null);
                },
                onFinish: () => setIsDeleting(false),
            });
        };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
            <Head title="管理者管理" />

            {/* 管理画面専用ヘッダー */}
            <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10 text-white">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="bg-emerald-600 text-xs px-2 py-0.5 rounded font-bold tracking-wider">ADMIN</span>
                        <h1 className="text-md font-bold tracking-tight">管理者管理</h1>
                    </div>
                    <Link href="/admin/dashboard" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                        &larr; ダッシュボードへ戻る
                    </Link>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">

                <div className="flex flex-col gap-6 w-full">
                    {/* ⭕️ 画面タイトル・説明＆新規登録ボタン */}
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-slate-900">管理者一覧</h1>
                            <p className="text-xs text-slate-500 mt-1">管理ユーザーの作成・編集・アカウント制御を行います。</p>
                        </div>
                        <Link
                            href="/admin/users/create"
                            className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold px-4 py-2.5 rounded-lg shadow-sm transition-colors self-start sm:self-auto"
                        >
                            <Plus className="w-4 h-4" />
                            <span>新しい管理者を登録</span>
                        </Link>
                    </div>

                    {/* 通知メッセージ */}
                    {status && <div className="text-xs font-medium text-green-600 bg-green-50 border border-green-200 p-3 rounded-lg">{status}</div>}
                    {error && <div className="text-xs font-medium text-destructive bg-destructive/10 p-3 rounded-lg">{error}</div>}

                    {/* ⭕️ 同期デザインテーブル */}
                    <div className="w-full overflow-x-auto border border-slate-200 rounded-lg bg-white shadow-sm">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-500 font-medium">
                                    <th className="p-4 w-20">ID</th>
                                    <th className="p-4">管理者名</th>
                                    <th className="p-4">メールアドレス</th>
                                    <th className="p-4 text-right">操作</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {admins.data.map((admin) => (
                                    <tr key={admin.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4 font-mono text-slate-400">{admin.id}</td>
                                        <td className="p-4 font-bold text-slate-900">{admin.name}</td>
                                        <td className="p-4 text-slate-600">{admin.email}</td>
                                        <td className="p-4 text-right space-x-1">
                                            <Button asChild variant="outline" size="sm" className="h-8 px-2 text-slate-600 border-slate-200 hover:bg-slate-50">
                                                <Link href={`/admin/users/${admin.id}/edit`}>
                                                    <Edit className="h-3.5 w-3.5" />
                                                </Link>
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="h-8 px-2 text-slate-400 hover:text-destructive hover:bg-destructive/5 border-slate-200"
                                                onClick={() => openDeleteModal(admin.id, admin.name)}
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
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
                title={selectedUser?.name || ''}
            />
        </div>
    );
}
