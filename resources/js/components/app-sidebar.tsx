
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, FolderGit2, LayoutGrid, CalendarDays, Megaphone, Sparkles, Hotel, BedDouble, Mail, Tags, Ticket, ShieldCheck, Star, Flag } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem, Auth } from '@/types';

// user.role の型を安全に認識させるための型拡張
type ExtendedUser = Auth['user'] & {
    role: number | string;
};

interface PageProps {
    auth: Omit<Auth, 'user'> & { user: ExtendedUser };
    [key: string]: any;
}

export function AppSidebar() {
    // ⭕️ 1. Inertiaの共通Propsからログインユーザー情報を取得
    const { auth } = usePage<PageProps>().props;

    // 管理者かどうかの判定（role が 2 の場合を管理者と定義。環境に合わせて適宜調整してください）
    const isAdmin = Number(auth.user?.role) === 2;

    // ⭕️ 2. 権限カラム（role）が 1（ユーザー）またはない場合は '/user/dashboard'、それ以外はデフォルトの '/dashboard' を適用
    const dashboardUrl = auth.user?.role === 1 || auth.user?.role == null ? '/user/dashboard' : '/dashboard';

    // ⭕️ 3. ユーザー用メニュー定義
    const userNavItems: NavItem[] = [
        {
            title: 'トップ画面',
            href: dashboardUrl,
            icon: LayoutGrid,
        },
        {
            title: 'ご宿泊予約',
            href: '/user/reservation',
            icon: CalendarDays,
        },
        {
            title: '施設のご案内',
            href: '/user/hotel-info',
            icon: Hotel,
        },
        {
            title: "お部屋のご案内",
            href: "/user/rooms",
            icon: BedDouble,
        },
        {
            title: 'お知らせ一覧',
            href: '/user/notices',
            icon: Megaphone,
        },
        {
            title: 'フェア・プラン告知',
            href: '/user/fairs',
            icon: Sparkles,
        },
        {
            title: 'お問合せ',
            href: '/user/contact',
            icon: Mail,
        },
        {
            title: '口コミ投稿',
            href: '/user/review/create',
            icon: Star,
        },
    ];

    // ⭕️ 4. 管理者用メニュー定義（引き継ぎメモの内容に準拠）
    const adminNavItems: NavItem[] = [
        {
            title: 'ダッシュボード',
            href: '/admin/dashboard',
            icon: LayoutGrid,
        },
        {
            title: '予約管理',
            href: '/admin/reservations',
            icon: CalendarDays,
        },
        {
            title: "部屋管理",
            href: "/admin/rooms",
            icon: BedDouble,
        },
        {
            title: 'お知らせ管理',
            href: '/admin/notices',
            icon: Megaphone,
        },
        {
            title: 'お知らせカテゴリ管理',
            href: '/admin/notice-categories',
            icon: Tags,
        },
        {
            title: 'フェア管理',
            href: '/admin/fairs',
            icon: Sparkles,
        },
        {
            title: 'フェアカテゴリ管理',
            href: '/admin/fair-categories',
            icon: Ticket,
        },
        {
            title: 'プラン管理',
            href: '/admin/plans',
            icon: Flag,
        },
        {
            title: 'お問合せ管理',
            href: '/admin/contacts',
            icon: Mail,
        },
        {
            title: '管理者管理',
            href: '/admin/users',
            icon: ShieldCheck,
        },
        {
            title: '口コミ一覧',
            href: '/admin/reviews',
            icon: Star,
        },
    ];

    // ⭕️ 5. ログイン権限に基づいて表示するメニュー項目を動的に選択
    const mainNavItems = isAdmin ? adminNavItems : userNavItems;

    const footerNavItems: NavItem[] = [
        {
            title: 'Repository',
            href: 'https://github.com/laravel/react-starter-kit',
            icon: FolderGit2,
        },
        {
            title: 'Documentation',
            href: 'https://laravel.com/docs/starter-kits#react',
            icon: BookOpen,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            {/* ⭕️ ロゴをクリックした際のリンク先も動的URLへ変更 */}
                            <Link href={dashboardUrl} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
