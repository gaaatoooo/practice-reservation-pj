import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Props = {
    passwordRules: string;
};

export default function Create({ passwordRules }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // ⚠️ ファイルを含むマルチパート形式のPOST送信を実行
        post('/admin/users');
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
            <Head title="管理者登録" />

            <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10 text-white">
                <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="bg-emerald-600 text-xs px-2 py-0.5 rounded font-bold tracking-wider">ADMIN</span>
                        <h1 className="text-md font-bold tracking-tight">管理者登録</h1>
                    </div>
                    <Link href="/admin/dashboard" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                        &larr; ダッシュボードへ戻る
                    </Link>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-8">
                <div className="flex flex-col gap-6 w-full max-w-2xl">
                    {/* 画面タイトルと戻る導線 */}
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900">管理者情報登録</h1>
                        <p className="text-xs text-slate-500 mt-1">管理者の名前やメールアドレスの登録を行います。</p>
                    </div>

                    {/* フォーム入力エリア（フラットな外枠） */}
                    <div className="w-full">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* 名前 */}
                            <div className="grid gap-1.5">
                                <Label htmlFor="name" className="text-xs text-slate-700 font-medium">名前</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    value={data.name || ''}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="管理者 太郎"
                                    className="h-9 text-xs rounded-md border-slate-200"
                                />
                                <InputError message={errors.name} />
                            </div>

                            {/* メールアドレス */}
                            <div className="grid gap-1.5">
                                <Label htmlFor="email" className="text-xs text-slate-700 font-medium">メールアドレス</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    value={data.email || ''}
                                    onChange={e => setData('email', e.target.value)}
                                    placeholder="admin@example.com"
                                    className="h-9 text-xs rounded-md border-slate-200"
                                />
                                <InputError message={errors.email} />
                            </div>
                            {/* パスワード入力欄 */}
                            <div className="grid gap-2">
                                <Label htmlFor="password">パスワード</Label>
                                    <PasswordInput
                                        id="password"
                                        required
                                        tabIndex={3}
                                        autoComplete="new-password"
                                        name="password"
                                        placeholder="パスワードを入力"
                                        passwordrules={passwordRules}
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                    />
                                <InputError message={errors.password} />
                            </div>
                            
                            {/* パスワード確認入力欄 */}
                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">
                                    パスワード（確認用）
                                </Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="パスワードを再入力"
                                    passwordrules={passwordRules}
                                    value={data.password_confirmation}
                                    onChange={e => setData('password_confirmation', e.target.value)}
                                    />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <Link
                                    href="/admin/users"
                                    className="px-5 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                                >
                                    キャンセル
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold shadow-sm transition-colors disabled:opacity-50"
                                >
                                    {processing ? '登録処理中...' : '管理者を登録する'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>  
            </main>
        </div>
    );
}
