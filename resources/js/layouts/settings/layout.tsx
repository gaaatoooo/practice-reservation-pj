import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';
import { edit } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';
import type { NavItem } from '@/types';

// ⭕️ タブメニューのタイトルを日本語に変更
const sidebarNavItems: NavItem[] = [
    {
        title: 'プロフィール設定',
        href: edit(),
        icon: null,
    },
    {
        title: 'セキュリティ',
        href: editSecurity(),
        icon: null,
    },
    {
        title: '外観デザイン',
        href: editAppearance(),
        icon: null,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <div className="px-4 py-6">
            {/* ⭕️ タイトルと説明文を日本語に変更 */}
            <Heading
                title="アカウント設定"
                description="会員情報の編集、パスワード変更、画面表示のデザイン設定（ライト・ダークモードなど）を行えます。"
            />

            <div className="flex flex-col lg:flex-row lg:space-x-12">
                <aside className="w-full max-w-xl lg:w-48">
                    {/* aria-label もスクリーンリーダー向けに日本語化 */}
                    <nav
                        className="flex flex-col space-y-1 space-x-0"
                        aria-label="アカウント設定メニュー"
                    >
                        {sidebarNavItems.map((item, index) => (
                            <Button
                                key={`${toUrl(item.href)}-${index}`}
                                size="sm"
                                variant="ghost"
                                asChild
                                className={cn('w-full justify-start', {
                                    'bg-muted': isCurrentOrParentUrl(item.href),
                                })}
                            >
                                <Link href={item.href}>
                                    {item.icon && (
                                        <item.icon className="h-4 w-4" />
                                    )}
                                    {item.title}
                                </Link>
                            </Button>
                        ))}
                    </nav>
                </aside>

                <Separator className="my-6 lg:hidden" />

                <div className="flex-1 md:max-w-2xl">
                    <section className="max-w-xl space-y-12">
                        {children}
                    </section>
                </div>
            </div>
        </div>
    );
}
