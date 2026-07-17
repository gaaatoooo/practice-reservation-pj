import { Head, Link, router } from '@inertiajs/react';
import { Edit, Search, FileDown, ChevronUp, ChevronDown, UserX } from 'lucide-react';
import React, { useState } from 'react';
import DeleteMemberConfirmModal from '@/components/layout/admin/DeleteMemberConfirmModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Member = { 
    id: number; 
    name: string; 
    email: string; 
    tel: string; 
    status: number; // ⭕️ ステータスを追加
    created_at: string; 
};

type Props = { 
    members: { data: Member[]; links: any[]; }; 
    filters?: { name?: string; tel?: string; status?: string; }; // ⭕️ statusを追加
    status?: string; 
    error?: string; 
};

export default function Index({ members, filters, status, error }: Props) {
    const [isSearchOpen, setIsSearchOpen] = useState(true);
    const [searchName, setSearchName] = useState(filters?.name || '');
    const [searchTel, setSearchTel] = useState(filters?.tel || '');
    const [searchStatus, setSearchStatus] = useState(filters?.status || ''); // ⭕️ ステータス用ステート

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<{ id: number; name: string } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // 検索処理
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/members', { name: searchName, tel: searchTel, status: searchStatus }, { preserveState: true, replace: true });
    };

    // クリア処理
    const handleReset = () => {
        setSearchName(''); setSearchTel(''); setSearchStatus('');
        router.get('/admin/members', {}, { preserveState: true, replace: true });
    };

    // CSV出力処理
    const handleCsvExport = () => {
        const queryParams = new URLSearchParams({ name: searchName, tel: searchTel, status: searchStatus, export: 'csv' }).toString();
        window.location.href = `/admin/members?${queryParams}`;
    };

    const openDeleteModal = (id: number, name: string) => { 
        setSelectedMember({ id, name }); setIsDeleteModalOpen(true); 
    };

    const handleConfirmDelete = () => {
        if (!selectedMember) {
            return;
        }

        setIsDeleting(true);
        router.delete(`/admin/members/${selectedMember.id}`, {
            onSuccess: () => { 
                setIsDeleteModalOpen(false); setSelectedMember(null); 
            },
            onFinish: () => setIsDeleting(false),
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
            <Head title="会員管理" />

            <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10 text-white">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="bg-emerald-600 text-xs px-2 py-0.5 rounded font-bold tracking-wider">ADMIN</span>
                        <h1 className="text-md font-bold tracking-tight">会員管理</h1>
                    </div>
                    <Link href="/admin/dashboard" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                        ダッシュボードへ戻る &rarr;
                    </Link>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col gap-6 w-full">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs text-slate-500 mt-1">会員ユーザーの検索、詳細編集、および強制退会処理を行います。</p>
                        </div>
                    </div>

                    {status && <div className="text-xs font-medium text-green-600 bg-green-50 border border-green-200 p-3 rounded-lg">{status}</div>}
                    {error && <div className="text-xs font-medium text-destructive bg-destructive/10 p-3 rounded-lg">{error}</div>}

                    {/* 🔍 検索条件エリア */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                        <button type="button" onClick={() => setIsSearchOpen(!isSearchOpen)} className="w-full flex items-center justify-between px-5 py-4 bg-slate-50 hover:bg-slate-100/70 border-b border-slate-200 transition-colors">
                            <div className="flex items-center gap-2 font-bold text-sm text-slate-700"><Search className="w-4 h-4 text-slate-500" /><span>検索条件を指定する</span></div>
                            {isSearchOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                        </button>
                        {isSearchOpen && (
                            <div className="p-5 animate-in fade-in duration-200">
                                <form onSubmit={handleSearch} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-1">氏名</label>
                                            <Input type="text" placeholder="山田 太郎" className="h-9 text-xs" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-1">電話番号</label>
                                            <Input type="text" placeholder="09012345678" className="h-9 text-xs" value={searchTel} onChange={(e) => setSearchTel(e.target.value)} />
                                        </div>
                                        {/* ⭕️ ステータス検索項目を追加 */}
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-1">ステータス</label>
                                            <select
                                                value={searchStatus}
                                                onChange={(e) => setSearchStatus(e.target.value)}
                                                className="w-full h-9 text-xs border border-slate-200 rounded-md focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white px-3"
                                            >
                                                <option value="">すべて</option>
                                                <option value="1">有効</option>
                                                <option value="3">退会済み</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                                        <button type="button" onClick={handleReset} className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">クリア</button>
                                        <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold shadow-sm transition-colors">この条件で検索</button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end items-center mt-2">
                        <Button type="button" variant="outline" size="sm" className="h-9 border-slate-200 text-slate-600 hover:bg-slate-50 gap-1.5" onClick={handleCsvExport}>
                            <FileDown className="w-4 h-4 text-emerald-600" /><span>CSV出力</span>
                        </Button>
                    </div>

                    {/* テーブル */}
                    <div className="w-full overflow-x-auto border border-slate-200 rounded-lg bg-white shadow-sm">
                    <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-500 font-medium">
                                    <th className="p-4 w-20">ID</th>
                                    <th className="p-4">会員名</th>
                                    <th className="p-4">メールアドレス</th>
                                    <th className="p-4">電話番号</th>
                                    <th className="p-4 w-28">ステータス</th>
                                    <th className="p-4 text-right">操作</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {members.data.length > 0 ? (
                                    members.data.map((member) => (
                                        <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="p-4 font-mono text-slate-400">{member.id}</td>
                                            <td className="p-4 font-bold text-slate-900">{member.name}</td>
                                            <td className="p-4 text-slate-600">{member.email}</td>
                                            <td className="p-4 text-slate-600">{member.tel}</td>
                                            <td className="p-4">
                                                {member.status === 3 ? (
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500 border border-slate-200">退会済み</span>
                                                ) : (
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">有効</span>
                                                )}
                                            </td>
                                            <td className="p-4 text-right space-x-1">
                                                <Button asChild variant="outline" size="sm" className="h-8 px-2 text-slate-600 border-slate-200 hover:bg-slate-50" title="会員編集">
                                                    <Link href={`/admin/members/${member.id}/edit`}>
                                                        <Edit className="h-3.5 w-3.5" />
                                                    </Link>
                                                </Button>
                                                {member.status !== 3 ? (
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm" 
                                                        className="h-8 px-2 text-rose-500 hover:text-white hover:bg-rose-600 border-slate-200 hover:border-rose-600 transition-colors" 
                                                        title="強制退会" 
                                                        onClick={() => openDeleteModal(member.id, member.name)}
                                                    >
                                                        <UserX className="h-3.5 w-3.5" />
                                                    </Button>
                                                ) : (
                                                    <div className="w-[31.5px] h-8 inline-block"></div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-slate-400 bg-slate-50/20">
                                            該当する会員が見つかりませんでした。
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* 🛡️ 強制退会確認モーダル */}
            <DeleteMemberConfirmModal 
                isOpen={isDeleteModalOpen} 
                onClose={() => setIsDeleteModalOpen(false)} 
                onConfirm={handleConfirmDelete} 
                processing={isDeleting} 
                title={`${selectedMember?.name || ''} (ID: ${selectedMember?.id || ''})`} 
            />
        </div>
    );
}
