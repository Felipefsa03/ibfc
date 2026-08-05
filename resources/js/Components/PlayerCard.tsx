import { cardRarity, cardStatColumns, initialsOf } from '@/lib/cards';
import { flagEmoji } from '@/lib/countries';
import type { Player } from '@/types';

export type PlayerCardSize = 'sm' | 'lg';

/**
 * Player card in the style of a collectible football card: overall, position
 * and portrait on top, name in the middle, the six stats below.
 *
 * The card fills its slot and is capped by the slot's max-width, so it can
 * never spill over a neighbouring grid cell.
 */
export default function PlayerCard({
    player,
    size = 'sm',
    className = '',
}: {
    player: Player;
    size?: PlayerCardSize;
    className?: string;
}) {
    const rarity = cardRarity(player.current_overall);
    const [leftColumn, rightColumn] = cardStatColumns(player);
    const displayName = player.nickname || player.name;

    const slotClasses = [
        'pcard-slot',
        size === 'lg' ? 'pcard-slot--lg' : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    const cardClasses = [
        'pcard',
        `pcard--${rarity}`,
        player.active ? '' : 'pcard--inactive',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={slotClasses}>
            <div
                className={cardClasses}
                title={`${displayName} · overall ${player.current_overall}`}
            >
                <div className="pcard__top">
                    <div className="pcard__id">
                        <span className="pcard__ovr">
                            {player.current_overall}
                        </span>
                        <span className="pcard__pos">
                            {player.position || '--'}
                        </span>
                        <span className="pcard__divider" />
                        <span className="pcard__flag">
                            {flagEmoji(player.nationality)}
                        </span>
                    </div>

                    <div className="pcard__portrait">
                        <span className="pcard__initials">
                            {initialsOf(player.name)}
                        </span>
                    </div>
                </div>

                <div className="pcard__name">{displayName}</div>

                <div className="pcard__stats">
                    <span className="pcard__rule" aria-hidden="true" />

                    {leftColumn.map((stat, index) => (
                        <div
                            key={stat.label}
                            className="pcard__stat"
                            style={{ gridColumn: 1, gridRow: index + 1 }}
                        >
                            <b>{stat.value}</b>
                            <span>{stat.label}</span>
                        </div>
                    ))}

                    {rightColumn.map((stat, index) => (
                        <div
                            key={stat.label}
                            className="pcard__stat"
                            style={{ gridColumn: 3, gridRow: index + 1 }}
                        >
                            <b>{stat.value}</b>
                            <span>{stat.label}</span>
                        </div>
                    ))}
                </div>

                <div className="pcard__foot">
                    <span>IBFC</span>
                    <span>{player.club || 'Sem clube'}</span>
                </div>
            </div>
        </div>
    );
}
