import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Member = {
    id: number;
    name: string;
    email: string;
    tel: string | null;
    zip: string | null;
    address: string | null;
    sex: string | null;
    birthday: string | null;
};

type Props = {
    member: Member;
};

export default function Edit({ member }: Props) {
    // ⭕️ 既存の会員データを初期値として設定
    const { data, setData, patch, processing, errors } = useForm({
        name: member.name || '',
        email: member.email || '',
        tel: member.tel || '',
        zip: member.zip || '',
        address: member.address || '',
        sex: member.sex || '',
        birthday: member.birthday || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // ⭕️ 統一URLルール `/admin/members/{id}` へのPATCH送信
        patch(`/admin/members/${member.id}`);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
            <Head title="会員編集" />

            <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10 text-white">
                <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="bg-emerald-600 text-xs px-2 py-0.5 rounded font-bold tracking-wider">ADMIN</span>
                        <h1 className="text-md font-bold tracking-tight">会員管理</h1>
                    </div>
                    <Link href="/admin/members" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                        &larr; 一覧画面へ戻る
                    </Link>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-8">
                <div className="flex flex-col gap-6 w-full max-w-2xl">
                    {/* タイトルエリアに編集対象の会員名とIDを表示 */}
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900">会員情報編集</h1>
                        <p className="text-xs text-slate-500 mt-1">
                            会員「{member.name} (ID: {member.id})」の登録情報を変更します。
                        </p>
                    </div>

                    <div className="w-full">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* 会員名（必須） */}
                            <div className="grid gap-1.5">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="name" className="text-xs text-slate-700 font-medium">会員名</Label>
                                    <span className="text-[10px] text-white bg-rose-500 px-1 rounded-sm font-bold">必須</span>
                                </div>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    tabIndex={1}
                                    value={data.name || ''}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="山田 太郎"
                                    className="h-9 text-xs rounded-md border-slate-200"
                                />
                                <InputError message={errors.name} />
                            </div>

                            {/* メールアドレス（必須） */}
                            <div className="grid gap-1.5">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="email" className="text-xs text-slate-700 font-medium">メールアドレス</Label>
                                    <span className="text-[10px] text-white bg-rose-500 px-1 rounded-sm font-bold">必須</span>
                                </div>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    value={data.email || ''}
                                    onChange={e => setData('email', e.target.value)}
                                    placeholder="yamada@example.com"
                                    className="h-9 text-xs rounded-md border-slate-200"
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* 電話番号（任意） */}
                            <div className="grid gap-1.5">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="tel" className="text-xs text-slate-700 font-medium">電話番号</Label>
                                    <span className="text-[10px] text-slate-400 bg-slate-200 px-1 rounded-sm font-medium">任意</span>
                                </div>
                                <Input
                                    id="tel"
                                    type="tel"
                                    tabIndex={3}
                                    value={data.tel || ''}
                                    onChange={e => setData('tel', e.target.value)}
                                    placeholder="09012345678"
                                    className="h-9 text-xs rounded-md border-slate-200"
                                />
                                <InputError message={errors.tel} />
                            </div>

                            {/* 郵便番号（任意） */}
                            <div className="grid gap-1.5">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="zip" className="text-xs text-slate-700 font-medium">郵便番号</Label>
                                    <span className="text-[10px] text-slate-400 bg-slate-200 px-1 rounded-sm font-medium">任意</span>
                                </div>
                                <Input
                                    id="zip"
                                    type="text"
                                    tabIndex={4}
                                    value={data.zip || ''}
                                    onChange={e => setData('zip', e.target.value)}
                                    placeholder="1000005"
                                    className="h-9 text-xs rounded-md border-slate-200"
                                />
                                <InputError message={errors.zip} />
                            </div>

                            {/* 住所（任意） */}
                            <div className="grid gap-1.5">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="address" className="text-xs text-slate-700 font-medium">住所</Label>
                                    <span className="text-[10px] text-slate-400 bg-slate-200 px-1 rounded-sm font-medium">任意</span>
                                </div>
                                <Input
                                    id="address"
                                    type="text"
                                    tabIndex={5}
                                    value={data.address || ''}
                                    onChange={e => setData('address', e.target.value)}
                                    placeholder="東京都千代田区丸の内1-1-1"
                                    className="h-9 text-xs rounded-md border-slate-200"
                                />
                                <InputError message={errors.address} />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* 性別（任意） */}
                                <div className="grid gap-1.5">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="sex" className="text-xs text-slate-700 font-medium">性別</Label>
                                        <span className="text-[10px] text-slate-400 bg-slate-200 px-1 rounded-sm font-medium">任意</span>
                                    </div>
                                    <select
                                        id="sex"
                                        tabIndex={6}
                                        value={data.sex || ''}
                                        onChange={e => setData('sex', e.target.value)}
                                        className="h-9 text-xs border border-slate-200 rounded-md focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white px-3"
                                    >
                                        <option value="">選択してください</option>
                                        <option value="1">男性</option>
                                        <option value="2">女性</option>
                                        <option value="3">その他</option>
                                    </select>
                                    <InputError message={errors.sex} />
                                </div>

                                                                {/* 生年月日（任意） */}
                                                                <div className="grid gap-1.5">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="birthday" className="text-xs text-slate-700 font-medium">生年月日</Label>
                                        <span className="text-[10px] text-slate-400 bg-slate-200 px-1 rounded-sm font-medium">任意</span>
                                    </div>
                                    <Input
                                        id="birthday"
                                        type="date"
                                        tabIndex={7}
                                        value={data.birthday || ''}
                                        onChange={e => setData('birthday', e.target.value)}
                                        className="h-9 text-xs rounded-md border-slate-200"
                                    />
                                    <InputError message={errors.birthday} />
                                </div>
                            </div>

                            {/* アクションボタン */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <Link
                                    href="/admin/members"
                                    className="px-5 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                                >
                                    キャンセル
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold shadow-sm transition-colors disabled:opacity-50"
                                >
                                    {processing ? '更新処理中...' : '変更を保存する'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>  
            </main>
        </div>
    );
}
