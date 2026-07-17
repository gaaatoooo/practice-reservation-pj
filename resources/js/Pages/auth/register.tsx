import { Form, Head } from '@inertiajs/react';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';

type Props = {
    passwordRules: string;
};

export default function Register({ passwordRules }: Props) {
    return (
        <>
            {/* ⭕️ タイトルを日本語化 */}
            <Head title="新規会員登録" />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            {/* お名前入力欄 */}
                            <div className="grid gap-2">
                                <Label htmlFor="name">お名前</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="山田 太郎"
                                />
                                {errors.name && <p className="text-xs text-rose-600 font-medium mt-1">{errors.name}</p>}
                            </div>

                            {/* メールアドレス入力欄 */}
                            <div className="grid gap-2">
                                <Label htmlFor="email">メールアドレス</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="example@email.com"
                                />
                                {errors.email && <p className="text-xs text-rose-600 font-medium mt-1">{errors.email}</p>}
                            </div>

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
                                />
                                {errors.password && <p className="text-xs text-rose-600 font-medium mt-1">{errors.password}</p>}
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
                                />
                                {errors.password_confirmation && <p className="text-xs text-rose-600 font-medium mt-1">{errors.password_confirmation}</p>}
                            </div>

                            {/* 1. 郵便番号入力欄 */}
                            <div className="grid gap-2">
                                <Label htmlFor="address">郵便番号</Label>
                                <Input
                                    id="zip"
                                    type="text"
                                    name="zip"
                                    placeholder="1000000"
                                />
                                {errors.zip && <p className="text-xs text-rose-600 font-medium mt-1">{errors.zip}</p>}
                            </div>

                            {/* 1. 住所入力欄 */}
                            <div className="grid gap-2">
                                <Label htmlFor="address">住所</Label>
                                <Input
                                    id="address"
                                    type="text"
                                    name="address"
                                    placeholder="東京都渋谷区神南1-2-3"
                                />
                                {errors.address && <p className="text-xs text-rose-600 font-medium mt-1">{errors.address}</p>}
                            </div>

                            {/* 2. 電話番号入力欄 */}
                            <div className="grid gap-2">
                                <Label htmlFor="tel">電話番号</Label>
                                <Input
                                    id="tel"
                                    type="tel"
                                    name="tel"
                                    placeholder="09012345678"
                                />
                                {errors.tel && <p className="text-xs text-rose-600 font-medium mt-1">{errors.tel}</p>}
                            </div>

                            {/* 3. 生年月日入力欄 */}
                            <div className="grid gap-2">
                                <Label htmlFor="birthday">生年月日</Label>
                                <Input
                                    id="birthday"
                                    type="date"
                                    name="birthday"
                                />
                                {errors.birthday && <p className="text-xs text-rose-600 font-medium mt-1">{errors.birthday}</p>}
                            </div>

                            {/* 4. 性別選択欄（セレクトボックスまたはラジオ形式。ここではシンプルなセレクト仕様） */}
                            <div className="grid gap-2">
                                <Label htmlFor="sex">性別</Label>
                                <select
                                    id="sex"
                                    name="sex"
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                >
                                    <option value="" disabled selected hidden>性別を選択してください</option>
                                    <option value="1">男性</option>
                                    <option value="2">女性</option>
                                    <option value="3">その他 / 回答しない</option>
                                </select>
                                {errors.sex && <p className="text-xs text-rose-600 font-medium mt-1">{errors.sex}</p>}
                            </div>

                            {/* アカウント作成ボタン */}
                            <Button
                                type="submit"
                                className="mt-2 w-full font-bold"
                                tabIndex={5}
                                data-test="register-user-button"
                            >
                                {processing && <Spinner />}
                                アカウントを作成する
                            </Button>
                        </div>

                        {/* 既存アカウントでのログイン導線 */}
                        <div className="text-center text-sm text-muted-foreground">
                            すでにアカウントをお持ちですか？{' '}
                            <TextLink href={login()} tabIndex={6}>
                                ログイン
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

// ⭕️ 最下部の共通レイアウト用メタデータも美しく日本語化
Register.layout = {
    title: 'アカウントの作成',
    description: '以下に必要事項を入力して、新しいアカウントを作成してください',
};
