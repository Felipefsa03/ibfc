import { Link } from '@inertiajs/react';
import Icon from '@/Components/Icon';
import type { IconName } from '@/Components/Icon';

export type BottomNavItem = {
    label: string;
    icon: IconName;
    /** Omit to render a disabled placeholder instead of a link. */
    href?: string;
    active?: boolean;
};

/**
 * The mobile tab bar shared by the authenticated shell and the public
 * portal. Desktop navigation differs enough between the two (user menu vs.
 * a plain "Entrar" link) that only this bottom bar is worth sharing.
 */
export default function BottomNav({ items }: { items: BottomNavItem[] }) {
    return (
        <nav className="nc-nav md:hidden">
            {items.map((item) =>
                item.href ? (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={
                            item.active ? 'nc-nav__item is-on' : 'nc-nav__item'
                        }
                    >
                        <Icon name={item.icon} size={19} />
                        {item.label}
                    </Link>
                ) : (
                    <span
                        key={item.label}
                        className="nc-nav__item opacity-40"
                        aria-disabled="true"
                    >
                        <Icon name={item.icon} size={19} />
                        {item.label}
                    </span>
                ),
            )}
        </nav>
    );
}
