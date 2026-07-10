import { Head, Link, router, usePage } from '@inertiajs/react';
import { Search, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import ContactDetailModal from '@/components/layout/admin/ContactDetailModal';
import Pagination from '@/components/layout/admin/Pagination';

interface ContactItem {
    id: number;
    title: string;
    email: string;
    content: string;
    created_at: string;
    type: number;
    is_replied: number;
}

interface Props {
    contacts: {
        data: ContactItem[];
        links: any[];
        current_page: number;
        last_page: number;
        total: number;
        from: number | null;
        to: number | null;
    };
    filters?: {
        title?: string;
        email?: string;
    };
}

export default function AdminContactList({ contacts, filters = {} }: Props) {
    const { constants } = usePage().props as any;

    // 🔍 検索条件パネルの開閉ステート（デフォルトは開く）
    const [isSearchOpen, setIsSearchOpen] = useState(true);

    // 🔍 検索フィルターの状態管理
    const [values, setValues] = useState({
        title: filters?.title || '',
        email: filters?.email || '',
    });

    // 💡 詳細表示中のお問合せデータを保持するステート（null のときは閉じている状態）
    const [selectedContact, setSelectedContact] = useState<ContactItem | null>(null);

    // ページ切り替え時などにURLパラメータとフォームの状態を同期
    useEffect(() => {
        setValues({
            title: filters?.title || '',
            email: filters?.email || '',
        });
    }, [filters]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValues((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    // 検索実行
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/contacts', values, {
            preserveState: true,
            replace: true,
        });
    };

    // 検索リセット
    const handleReset = () => {
        const resetValues = { title: '', email: '' };
        setValues(resetValues);
        router.get('/admin/contacts', resetValues);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
            <Head title="【管理画面】お問合せ管理一覧" />

            {/* 管理画面共通ヘッダー */}
            <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="bg-emerald-600 text-xs px-2 py-0.5 rounded font-bold tracking-wider">ADMIN</span>
                        <h1 className="text-md font-bold tracking-tight">お問合せ管理</h1>
                    </div>
                    <Link href="/admin/dashboard" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                        ダッシュボードへ戻る &rarr;
                    </Link>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-8">
                {/* ページタイトル */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">受信お問合せ一覧</h2>
                    <p className="text-sm text-slate-500 mt-1">ユーザーから送信されたお問合せ内容の確認および管理を行います。</p>
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
                                <div className="grid grid-col gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">件名検索</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={values.title}
                                            onChange={handleChange}
                                            placeholder="キーワードを入力"
                                            className="w-full text-sm border border-slate-300 rounded-lg bg-white p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">メールアドレス検索</label>
                                        <input
                                            type="text"
                                            name="email"
                                            value={values.email}
                                            onChange={handleChange}
                                            placeholder="example@domain.com"
                                            className="w-full text-sm border border-slate-300 rounded-lg bg-white p-2"
                                        />
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

                {/* 📋 一覧テーブル */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-xs font-bold tracking-wider">
                                    <th className="px-6 py-3 w-16">ID</th>
                                    <th className="px-6 py-3 w-48">受信日時</th>
                                    <th className="px-6 py-3 w-52">メールアドレス</th>
                                    <th className="px-6 py-3 w-52">件名</th>
                                    <th className="px-6 py-3">お問合せ内容</th>
                                    <th className="px-6 py-3 w-30">登録種別</th>
                                    <th className="px-6 py-3 w-20">返信</th>
                                    <th className="px-6 py-3 w-20 text-center">操作</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {contacts.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-10 text-center text-slate-400 italic">
                                            該当するお問合せはありません。
                                        </td>
                                    </tr>
                                ) : (
                                    contacts.data.map((contact) => (
                                        <tr key={contact.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-400">{contact.id}</td>
                                            <td className="px-6 py-4 text-slate-500 text-xs">
                                                {new Date(contact.created_at).toLocaleString('ja-JP')}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-slate-900 select-all">{contact.email}</td>
                                            <td className="px-6 py-4 text-slate-900 font-semibold">{contact.title}</td>
                                            <td className="px-6 py-4 text-slate-600 max-w-xs">
                                                <p className="whitespace-pre-wrap line-clamp-3 text-xs leading-relaxed" title={contact.content}>
                                                    {contact.content}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 text-slate-900">{constants?.type?.[contact.type]}</td>
                                            <td className="px-6 py-4 text-slate-900">{constants?.is_repley?.[contact.is_replied]}</td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => { 
                                                        setSelectedContact(contact);
                                                    }}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-lg text-xs font-bold transition-colors"
                                                >
                                                    <Eye size={14} /> 詳細
                                                </button>
                                                {selectedContact && (
                                                    <ContactDetailModal
                                                        contact={selectedContact}
                                                        onClose={() => setSelectedContact(null)}
                                                    />
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* 💡 共通ページネーションコンポーネントの呼び出し */}
                    <Pagination meta={contacts} />
                </div>
            </main>
        </div>
    );
}
