import { Link } from '@inertiajs/react';
import Icon from '@/Components/Icon';

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

/**
 * Renders Laravel's default paginator link set (prev, page numbers, next).
 * Previous/Next arrive as HTML-entity labels ("&laquo; Previous") — matched
 * by substring and swapped for icons rather than rendered as raw text.
 */
export default function Pagination({
    links,
    only,
}: {
    links: PaginationLink[];
    /** Inertia partial-reload props to refresh; keeps the rest of the page as-is. */
    only?: string[];
}) {
    if (links.length <= 3) {
        return null;
    }

    return (
        <nav
            className="flex flex-wrap items-center gap-1.5"
            aria-label="Paginação do histórico"
        >
            {links.map((link, index) => {
                const isPrev = link.label.includes('Previous');
                const isNext = link.label.includes('Next');
                const content = isPrev ? (
                    <Icon name="caretLeft" size={12} />
                ) : isNext ? (
                    <Icon name="caretRight" size={12} />
                ) : (
                    link.label
                );
                const label = isPrev
                    ? 'Página anterior'
                    : isNext
                      ? 'Próxima página'
                      : `Página ${link.label}`;

                if (!link.url) {
                    return (
                        <span
                            key={`${link.label}-${index}`}
                            aria-hidden="true"
                            className="nc-btn nc-btn--sm nc-btn--quiet"
                            style={{ opacity: 0.35, cursor: 'not-allowed' }}
                        >
                            {content}
                        </span>
                    );
                }

                return (
                    <Link
                        key={`${link.label}-${index}`}
                        href={link.url}
                        preserveScroll
                        preserveState
                        only={only}
                        aria-label={label}
                        aria-current={link.active ? 'page' : undefined}
                        className={
                            link.active
                                ? 'nc-btn nc-btn--sm'
                                : 'nc-btn nc-btn--sm nc-btn--quiet'
                        }
                    >
                        {content}
                    </Link>
                );
            })}
        </nav>
    );
}
