import type { Player } from '@/types';

export type CardRarity = 'bronze' | 'silver' | 'gold' | 'legend';

/**
 * Rarity is derived from the player's current overall — it is never stored.
 * Changing a player's attributes re-derives the theme on the next render.
 */
export function cardRarity(overall: number): CardRarity {
    if (overall >= 96) {
        return 'legend';
    }

    if (overall >= 86) {
        return 'gold';
    }

    if (overall >= 71) {
        return 'silver';
    }

    return 'bronze';
}

/**
 * The squad has no dedicated pace attribute, so PAC is presented as the
 * average of physical and dribbling. Visual mapping only — nothing is stored.
 */
export function paceFrom(player: Pick<Player, 'phy' | 'dri'>): number {
    return Math.round((player.phy + player.dri) / 2);
}

export type CardStat = { label: string; value: number };

type CardStatSource = Pick<Player, 'sho' | 'pas' | 'dri' | 'def' | 'phy'>;

/**
 * The six stats shown on the card, arranged as the reference layout does:
 * one column of attacking traits, one of technical/defensive traits.
 */
export function cardStatColumns(
    player: CardStatSource,
): [CardStat[], CardStat[]] {
    return [
        [
            { label: 'PAC', value: paceFrom(player) },
            { label: 'SHO', value: player.sho },
            { label: 'PAS', value: player.pas },
        ],
        [
            { label: 'DRI', value: player.dri },
            { label: 'DEF', value: player.def },
            { label: 'PHY', value: player.phy },
        ],
    ];
}

export function initialsOf(name: string): string {
    return (
        name
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((word) => word.charAt(0).toUpperCase())
            .join('') || '?'
    );
}
