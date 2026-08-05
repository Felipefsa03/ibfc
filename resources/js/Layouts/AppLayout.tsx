import { Link, usePage } from '@inertiajs/react';
import type { PropsWithChildren, ReactNode } from 'react';
import BottomNav from '@/Components/BottomNav';
import type { BottomNavItem } from '@/Components/BottomNav';
import Icon from '@/Components/Icon';
import type { IconName } from '@/Components/Icon';
import ShellBackground from '@/Components/ShellBackground';

type NavItem = {
    label: string;
    icon: IconName;
    routeName?: string;
    activePattern?: string;
    /** Screens the design specifies but the backend has not shipped yet. */
    soon?: boolean;
};

const NAV_ITEMS: NavItem[] = [
    { label: 'Início', icon: 'house', routeName: 'dashboard' },
    {
        label: 'Elenco',
        icon: 'users',
        routeName: 'players.index',
        activePattern: 'players.*',
    },
    {
        label: 'Match Day',
        icon: 'ball',
        routeName: 'matchDays.index',
        activePattern: 'matchDays.*',
    },
    { label: 'Rankings', icon: 'ranking', routeName: 'rankings.index' },
];

function isCurrent(item: NavItem): boolean {
    if (!item.routeName) {
        return false;
    }

    return route().current(item.activePattern ?? item.routeName);
}

function initialsOf(name: string): string {
    return (
        name
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((word) => word.charAt(0).toUpperCase())
            .join('') || '?'
    );
}

export default function AppLayout({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;

    const bottomNavItems: BottomNavItem[] = NAV_ITEMS.map((item) => ({
        label: item.label,
        icon: item.icon,
        href: item.soon || !item.routeName ? undefined : route(item.routeName),
        active: isCurrent(item),
    }));

    return (
        <div className="app-shell">
            <ShellBackground />

            <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pt-6 sm:px-6">
                <header className="flex items-center justify-between gap-4">
                    <Link
                        href={route('dashboard')}
                        className="flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4"
                        style={{ outlineColor: 'var(--color-accent)' }}
                    >
                        <span
                            className="nc-hex shrink-0"
                            style={{
                                width: 42,
                                height: 46,
                                fontSize: 13,
                                letterSpacing: '0.02em',
                                boxShadow: '0 0 26px -8px rgba(145,132,217,.8)',
                            }}
                        >
                            IBFC
                        </span>
                        <span className="hidden sm:block">
                            <span className="u-kicker block">Team Builder</span>
                            <span
                                className="u-display block text-[15px]"
                                style={{
                                    color: 'var(--color-neutral-400)',
                                    letterSpacing: '0.14em',
                                }}
                            >
                                Futsal · Temporada 26
                            </span>
                        </span>
                    </Link>

                    <nav className="hidden items-center gap-1 md:flex">
                        {NAV_ITEMS.map((item) =>
                            item.soon ? (
                                <span
                                    key={item.label}
                                    title="Disponível em uma próxima sprint"
                                    className="flex cursor-not-allowed items-center gap-2 px-3 py-2 text-[10px] font-bold tracking-[0.16em] uppercase opacity-40"
                                    style={{
                                        color: 'var(--color-neutral-500)',
                                    }}
                                >
                                    <Icon name={item.icon} size={16} />
                                    {item.label}
                                </span>
                            ) : (
                                <Link
                                    key={item.label}
                                    href={route(item.routeName!)}
                                    className="flex items-center gap-2 px-3 py-2 text-[10px] font-bold tracking-[0.16em] uppercase transition-colors"
                                    style={{
                                        color: isCurrent(item)
                                            ? 'var(--color-accent-200)'
                                            : 'var(--color-neutral-500)',
                                        borderBottom: `2px solid ${isCurrent(item) ? 'var(--color-accent)' : 'transparent'}`,
                                    }}
                                >
                                    <Icon name={item.icon} size={16} />
                                    {item.label}
                                </Link>
                            ),
                        )}
                    </nav>

                    <div className="flex items-center gap-2">
                        <Link
                            href={route('settings.index')}
                            aria-label="Configurações"
                            className="hidden p-2 transition-colors sm:block"
                            style={{ color: 'var(--color-neutral-500)' }}
                        >
                            <Icon name="sliders" size={18} />
                        </Link>

                        <Link
                            href={route('profile.edit')}
                            className="flex items-center gap-2"
                            title={user.name}
                        >
                            <span
                                className="nc-hex shrink-0"
                                style={{ width: 34, height: 38, fontSize: 12 }}
                            >
                                {initialsOf(user.name)}
                            </span>
                        </Link>

                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            aria-label="Sair"
                            className="p-2 transition-colors"
                            style={{ color: 'var(--color-neutral-500)' }}
                        >
                            <Icon name="signOut" size={18} />
                        </Link>
                    </div>
                </header>

                {header && <div className="mt-6">{header}</div>}

                <main className="flex-1 pt-6 pb-28 md:pb-12">{children}</main>

                <footer
                    className="hidden pb-6 text-center text-[10px] tracking-[0.14em] uppercase md:block"
                    style={{ color: 'var(--color-neutral-700)' }}
                >
                    IBFC Team Builder · FC 26
                </footer>
            </div>

            <BottomNav items={bottomNavItems} />
        </div>
    );
}
