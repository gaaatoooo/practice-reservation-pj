// resources/js/Pages/Settings/Profile.tsx (または現在の配置パス)
import { Form, Head, usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import type { Auth } from '@/types';

// auth.user の型拡張（追加したカラムを認識させる）
type ExtendedUser = Auth['user'] & {
    tel: string | null;
    zip: string | null;
    address: string | null;
    sex: number | null; // 1: 男性, 2: 女性, 3: その他 など
    birthday: string | null;
};

type PageProps = {
    auth: Omit<Auth, 'user'> & { user: ExtendedUser };
};

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<PageProps>().props;

    return (
        <>
            {/* ⭕️ 日本語表記へ変更 */}
            <Head title="会員情報設定" />

            <h1 className="sr-only">会員情報設定</h1>

            <div className="space-y-6">
                {/* ⭕️ 日本語表記へ変更 */}
                <Heading
                    variant="small"
                    title="会員情報プロフィール"
                    description="ご登録いただいているお名前、メールアドレス、宿泊用連絡先を変更・更新できます。"
                />

                <Form
                    {...ProfileController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            {/* お名前 */}
                            <div className="grid gap-2">
                                <Label htmlFor="name">お名前（フルネーム）</Label>
                                <Input
                                    id="name"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.name}
                                    name="name"
                                    autoComplete="name"
                                    placeholder="山田 太郎"
                                />
                                {errors.name && <p className="text-xs font-medium text-rose-600 mt-0.5">{errors.name}</p>}
                            </div>

                            {/* メールアドレス */}
                            <div className="grid gap-2">
                                <Label htmlFor="email">メールアドレス</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.email}
                                    name="email"
                                    autoComplete="username"
                                    placeholder="example@example.com"
                                />
                                {errors.email && <p className="text-xs font-medium text-rose-600 mt-0.5">{errors.email}</p>}
                            </div>

                            {/* ⭕️ 追加：電話番号 */}
                            <div className="grid gap-2">
                                <Label htmlFor="tel">電話番号</Label>
                                <Input
                                    id="tel"
                                    type="tel"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.tel || ''}
                                    name="tel"
                                    placeholder="09012345678"
                                />
                                {errors.tel && <p className="text-xs font-medium text-rose-600 mt-0.5">{errors.tel}</p>}
                            </div>

                            {/* ⭕️ 追加：郵便番号 */}
                            <div className="grid gap-2">
                                <Label htmlFor="zip">郵便番号</Label>
                                <Input
                                    id="zip"
                                    type="text"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.zip || ''}
                                    name="zip"
                                    placeholder="1000001"
                                />
                                {errors.zip && <p className="text-xs font-medium text-rose-600 mt-0.5">{errors.zip}</p>}
                            </div>

                            {/* ⭕️ 追加：住所 */}
                            <div className="grid gap-2">
                                <Label htmlFor="address">ご住所</Label>
                                <Input
                                    id="address"
                                    type="text"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.address || ''}
                                    name="address"
                                    placeholder="東京都千代田区大手町1-1-1"
                                />
                                {errors.address && <p className="text-xs font-medium text-rose-600 mt-0.5">{errors.address}</p>}
                            </div>

                            {/* ⭕️ 追加：性別 */}
                            <div className="grid gap-2">
                                <Label htmlFor="sex">性別</Label>
                                <select
                                    id="sex"
                                    name="sex"
                                    defaultValue={auth.user.sex || ''}
                                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="" disabled>選択してください</option>
                                    <option value="1">男性</option>
                                    <option value="2">女性</option>
                                    <option value="3">その他 / 回答しない</option>
                                </select>
                                {errors.sex && <p className="text-xs font-medium text-rose-600 mt-0.5">{errors.sex}</p>}
                            </div>

                            {/* ⭕️ 追加：生年月日 */}
                            <div className="grid gap-2">
                                <Label htmlFor="birthday">生年月日</Label>
                                <Input
                                    id="birthday"
                                    type="date"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.birthday || ''}
                                    name="birthday"
                                />
                                {errors.birthday && <p className="text-xs font-medium text-rose-600 mt-0.5">{errors.birthday}</p>}
                            </div>

                            {/* メールアドレスの未検証警告テキスト（日本語化） */}
                            {mustVerifyEmail && auth.user.email_verified_at === null && (
                                <div>
                                    <p className="-mt-4 text-sm text-muted-foreground">
                                        メールアドレスがまだ認証されていません。{' '}
                                        <Link
                                            href={send()}
                                            as="button"
                                            className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                        >
                                            ここをクリックして認証メールを再送信する。
                                        </Link>
                                    </p>

                                    {status === 'verification-link-sent' && (
                                        <div className="mt-2 text-sm font-medium text-green-600">
                                            新しい認証リンクがご登録のメールアドレスに送信されました。
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex items-center gap-4">
                                <Button disabled={processing} data-test="update-profile-button">
                                    変更を保存
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>

            {/* アカウント削除コンポーネント（※こちらも中のテキストを日本語化する必要があれば別途お伝えください） */}
            <DeleteUser />
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: '会員情報設定',
            href: edit(),
        },
    ],
};
