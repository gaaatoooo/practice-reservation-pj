// resources/js/components/delete-user.tsx（または現在の配置パス）
import { Form } from '@inertiajs/react';
import { useRef } from 'react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export default function DeleteUser() {
    const passwordInput = useRef<HTMLInputElement>(null);

    return (
        <div className="space-y-6">
            {/* ⭕️ タイトルと説明文を日本語化 */}
            <Heading
                variant="small"
                title="アカウントの削除（退会）"
                description="会員アカウントの完全な削除および退会手続きを行います。"
            />
            <div className="space-y-4 rounded-lg border border-red-100 bg-red-50 p-4 dark:border-red-200/10 dark:bg-red-700/10">
                {/* ⭕️ 警告メッセージを日本語化 */}
                <div className="relative space-y-0.5 text-red-600 dark:text-red-100">
                    <p className="font-medium">⚠️ ご注意ください</p>
                    <p className="text-sm">
                        アカウントを削除すると、これまでの宿泊履歴や会員特典データはすべて消失し、元に戻せません。
                    </p>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        {/* ⭕️ ボタンテキストを日本語化 */}
                        <Button
                            variant="destructive"
                            data-test="delete-user-button"
                        >
                            アカウントを削除する
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        {/* ⭕️ ダイアログ内の確認文言を丁寧に日本語化 */}
                        <DialogTitle>
                            本当にアカウントを削除してもよろしいですか？
                        </DialogTitle>
                        <DialogDescription>
                            アカウントを削除すると、お客様のすべてのデータが永久にシステムから削除されます。
                            確認のため、現在のパスワードを入力してください。
                        </DialogDescription>

                        <Form
                            {...ProfileController.destroy.form()}
                            options={{
                                preserveScroll: true,
                            }}
                            onError={() => passwordInput.current?.focus()}
                            resetOnSuccess
                            className="space-y-6"
                        >
                            {({ resetAndClearErrors, processing, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="password"
                                            className="sr-only"
                                        >
                                            パスワード
                                        </Label>

                                        {/* ⭕️ プレースホルダーを日本語化 */}
                                        <PasswordInput
                                            id="password"
                                            name="password"
                                            ref={passwordInput}
                                            placeholder="パスワードを入力してください"
                                            autoComplete="current-password"
                                        />

                                        <InputError message={errors.password} />
                                    </div>

                                    {/* ⭕️ フッターの各種アクションボタンを日本語化 */}
                                    <DialogFooter className="gap-2">
                                        <DialogClose asChild>
                                            <Button
                                                variant="secondary"
                                                onClick={() =>
                                                    resetAndClearErrors()
                                                }
                                            >
                                                キャンセル
                                            </Button>
                                        </DialogClose>

                                        <Button
                                            variant="destructive"
                                            disabled={processing}
                                            asChild
                                        >
                                            <button
                                                type="submit"
                                                data-test="confirm-delete-user-button"
                                            >
                                                完全に削除する
                                            </button>
                                        </Button>
                                    </DialogFooter>
                                </>
                            )}
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
