const STAR_PATH =
    'M12 2.6l2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 17.4l-5.8 3.06 1.1-6.46-4.69-4.58 6.49-.94z';

/**
 * Clickable 1–5 star rating. Clicking the active star clears the rating back
 * to zero, so a rating can be undone without a separate control.
 */
export default function StarRating({
    value,
    onChange,
    max = 5,
    label = 'Estrelas',
    disabled = false,
}: {
    value: number;
    onChange: (value: number) => void;
    max?: number;
    label?: string;
    disabled?: boolean;
}) {
    const stars = Array.from({ length: max }, (_, index) => index + 1);

    return (
        <div
            role="radiogroup"
            aria-label={label}
            className="inline-flex items-center gap-0.5"
        >
            {stars.map((star) => {
                const filled = star <= value;

                return (
                    <button
                        key={star}
                        type="button"
                        role="radio"
                        aria-checked={value === star}
                        aria-label={`${star} ${star === 1 ? 'estrela' : 'estrelas'}`}
                        disabled={disabled}
                        onClick={() => onChange(value === star ? 0 : star)}
                        className="p-0.5 leading-none transition-transform enabled:hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50"
                        style={{
                            color: filled
                                ? 'var(--color-accent-300)'
                                : 'var(--color-neutral-700)',
                        }}
                    >
                        <svg
                            viewBox="0 0 24 24"
                            width={18}
                            height={18}
                            fill={filled ? 'currentColor' : 'none'}
                            stroke="currentColor"
                            strokeWidth={1.6}
                            strokeLinejoin="round"
                            aria-hidden="true"
                            focusable="false"
                        >
                            <path d={STAR_PATH} />
                        </svg>
                    </button>
                );
            })}
        </div>
    );
}
