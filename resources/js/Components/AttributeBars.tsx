import type { Player } from '@/types';

const ATTRIBUTES: { key: keyof Player; label: string }[] = [
    { key: 'gol', label: 'GOL' },
    { key: 'sho', label: 'CHU' },
    { key: 'pas', label: 'PAS' },
    { key: 'dri', label: 'DRI' },
    { key: 'def', label: 'DEF' },
    { key: 'phy', label: 'FIS' },
];

function barColor(value: number): string {
    if (value >= 85) {
        return 'var(--color-accent-300)';
    }

    if (value >= 70) {
        return 'var(--color-accent-400)';
    }

    return 'var(--color-accent-2-600)';
}

/**
 * The six tactical attributes as animated bars — the same raw fields
 * App\Services\OverallCalculatorService averages into the overall. Shared by
 * the staff player profile and the public card detail so both show the
 * calculation's actual inputs, not just the card's display stats.
 */
export default function AttributeBars({
    player,
}: {
    player: Pick<Player, 'gol' | 'sho' | 'pas' | 'dri' | 'def' | 'phy'>;
}) {
    return (
        <div className="flex flex-col gap-2">
            {ATTRIBUTES.map((attribute, index) => {
                const value = player[
                    attribute.key as keyof typeof player
                ] as number;

                return (
                    <div
                        key={attribute.label}
                        className="flex items-center gap-2.5"
                    >
                        <span
                            className="w-7 text-[10px] font-bold tracking-[0.1em]"
                            style={{ color: 'var(--color-neutral-400)' }}
                        >
                            {attribute.label}
                        </span>
                        <span className="u-display w-6 text-base">{value}</span>
                        <div className="nc-bar">
                            <div
                                className="nc-bar__fill"
                                style={{
                                    width: `${value}%`,
                                    animationDelay: `${(0.1 + index * 0.07).toFixed(2)}s`,
                                    ['--bar-color' as string]: barColor(value),
                                }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
