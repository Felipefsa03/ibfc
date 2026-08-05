import { Link } from '@inertiajs/react';
import type { PropsWithChildren, ReactNode } from 'react';
import BottomNav from '@/Components/BottomNav';
import type { BottomNavItem } from '@/Components/BottomNav';
import Icon from '@/Components/Icon';
import type { IconName } from '@/Components/Icon';
import ShellBackground from '@/Components/ShellBackground';

type NavItem = {
    label: string;
    icon: IconName;
    routeName: string;
    activePattern?: string;
};

const NAV_ITEMS: NavItem[] = [
    {
        label: 'Cartas',
        icon: 'users',
        routeName: 'cards.index',
        activePattern: 'cards.*',
    },
    { label: 'Rankings', icon: 'ranking', routeName: 'rankings.index' },
];

function isCurrent(item: NavItem): boolean {
    return route().current(item.activePattern ?? item.routeName);
}

/**
 * The public portal's shell: no session, no user menu — just the two
 * read-only areas (Cartas, Rankings) and a link back to the staff login.
 * Shares the decorative chrome (ShellBackground, BottomNav) with AppLayout
 * so the two feel like one product, not a bolted-on public site.
 */
export default function PublicLayout({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const bottomNavItems: BottomNavItem[] = [
        ...NAV_ITEMS.map((item) => ({
            label: item.label,
            icon: item.icon,
            href: route(item.routeName),
            active: isCurrent(item),
        })),
        { label: 'Entrar', icon: 'signIn' as IconName, href: route('login') },
    ];

    return (
        <div className="app-shell">
            <ShellBackground />

            <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pt-6 sm:px-6">
                <header className="flex items-center justify-between gap-4">
                    <Link
                        href={route('cards.index')}
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
                            <span className="u-kicker block">
                                Portal do Jogador
                            </span>
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
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.label}
                                href={route(item.routeName)}
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
                        ))}
                    </nav>

                    <Link
                        href={route('login')}
                        className="nc-btn nc-btn--sm hidden sm:inline-flex"
                    >
                        <Icon name="signIn" size={13} /> Área da comissão
                    </Link>
                </header>

                {header && <div className="mt-6">{header}</div>}

                <main className="flex-1 pt-6 pb-28 md:pb-12">{children}</main>

                <footer
                    className="hidden pb-6 text-center text-[10px] tracking-[0.14em] uppercase md:block"
                    style={{ color: 'var(--color-neutral-700)' }}
                >
                    IBFC Team Builder · FC 26 · Portal público
                </footer>
            </div>

            <BottomNav items={bottomNavItems} />
        </div>
    );
}
