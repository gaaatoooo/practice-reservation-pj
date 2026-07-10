import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Props = {
    admin: {
        id: number;
        name: string;
        email: string;
    };
    is_self: boolean;
    passwordRules: string;
};

export default function Edit({ admin, is_self, passwordRules }: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        id: admin.id,
        name: admin.name,
        email: admin.email,
        is_self: is_self,
        password: '',
        password_confirmation: '',
    });
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/admin/users/${admin.id}`);
    };
    
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
            <Head title={`【管理画面】管理者編集 #${admin.id}`} />

            <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10 text-white">
                <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="bg-emerald-600 text-xs px-2 py-0.5 rounded font-bold tracking-wider">ADMIN</span>
                        <h1 className="text-md font-bold tracking-tight">管理者編集</h1>
                    </div>
                    <Link href="/admin/users" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                        &larr; 一覧へ戻る
                    </Link>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-8">
                <div className="flex flex-col gap-6 w-full max-w-2xl">
                    {/* 画面タイトルと戻る導線 */}
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900">管理者情報編集</h1>
                        <p className="text-xs text-slate-500 mt-1">登録されている管理者の名前やメールアドレスの変更、パスワードの再設定を行います。</p>
                    </div>

                    {/* フォーム入力エリア（フラットな外枠） */}
                    <div className="w-full">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <input type="hidden" name="isSelf" value={data.is_self ? '1' : '0'} />
                            {/* 名前 */}
                            <div className="grid gap-1.5">
                                <Label htmlFor="name" className="text-xs text-slate-700 font-medium">名前</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
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
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    className="h-9 text-xs rounded-md border-slate-200"
                                />
                                <InputError message={errors.email} />
                            </div>
                            {data.is_self && (
                                <>
                                    {/* パスワード入力欄 */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="password">パスワード</Label>
                                        <PasswordInput
                                            id="password"
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
                                </>
                            )}

                            {/* ボタン */}
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
                                    {processing ? '変更保存中...' : '変更を保存する'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
