import type { ReactNode, SVGProps } from 'react';

/**
 * Inline icon set standing in for Phosphor, which the design references but
 * the project does not ship as a dependency. Stroke-based on a 24px grid so
 * every glyph keeps the same optical weight as the interface chrome.
 */
const PATHS = {
    house: (
        <>
            <path d="M3 10.5 12 3l9 7.5" />
            <path d="M5.5 9.8V20h13V9.8" />
        </>
    ),
    users: (
        <>
            <circle cx="9" cy="7.5" r="3.5" />
            <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
            <path d="M16.8 4.6a3 3 0 0 1 0 5.8" />
            <path d="M18.2 14.9A5.6 5.6 0 0 1 21.5 20H18" />
        </>
    ),
    ball: (
        <>
            <circle cx="12" cy="12" r="9" />
            <path d="m12 7.6 4.2 3-1.6 4.9H9.4l-1.6-4.9z" />
            <path d="M12 3v4.6M19.8 9.3l-3.6 1.3M16.6 20.2l-2-4.7M9.4 15.5l-2 4.7M4.2 9.3l3.6 1.3" />
        </>
    ),
    ranking: (
        <>
            <path d="M4 20h16" />
            <path d="M5.5 20v-5h4v5" />
            <path d="M10 20V8h4v12" />
            <path d="M14.5 20v-8h4v8" />
        </>
    ),
    user: (
        <>
            <circle cx="12" cy="8" r="4" />
            <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
        </>
    ),
    sliders: (
        <>
            <path d="M4 8h6M14 8h6M4 16h10M18 16h2" />
            <circle cx="12" cy="8" r="2" />
            <circle cx="16" cy="16" r="2" />
        </>
    ),
    signOut: (
        <>
            <path d="M15 12H4" />
            <path d="m8 8-4 4 4 4" />
            <path d="M10 4h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-8" />
        </>
    ),
    signIn: (
        <>
            <path d="M9 12h11" />
            <path d="m16 8 4 4-4 4" />
            <path d="M14 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8" />
        </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    search: (
        <>
            <circle cx="11" cy="11" r="6.5" />
            <path d="m16 16 4.5 4.5" />
        </>
    ),
    caretLeft: <path d="m15 5-7 7 7 7" />,
    caretRight: <path d="m9 5 7 7-7 7" />,
    pencil: (
        <>
            <path d="M4 20h4L20 8l-4-4L4 16z" />
            <path d="m14.5 5.5 4 4" />
        </>
    ),
    trash: (
        <>
            <path d="M4 7h16" />
            <path d="M9.5 7V4h5v3" />
            <path d="m6.5 7 1 13h9l1-13" />
        </>
    ),
    check: <path d="m5 12.5 4.5 4.5L19 7" />,
    arrowUp: (
        <>
            <path d="M12 19V5" />
            <path d="m6 11 6-6 6 6" />
        </>
    ),
    arrowDown: (
        <>
            <path d="M12 5v14" />
            <path d="m6 13 6 6 6-6" />
        </>
    ),
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof PATHS;

export default function Icon({
    name,
    size = 16,
    ...props
}: { name: IconName; size?: number } & Omit<SVGProps<SVGSVGElement>, 'name'>) {
    return (
        <svg
            viewBox="0 0 24 24"
            width={size}
            height={size}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
            {...props}
        >
            {PATHS[name]}
        </svg>
    );
}
