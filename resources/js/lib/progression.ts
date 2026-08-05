/**
 * Match day progression weights.
 *
 * Mirrors App\Services\MatchDayFinalizationService so the finalization screen
 * can preview the exact deltas the backend will persist. Keep both in step.
 */
export const PARTICIPATION_PENALTY = 7;
export const POINTS_PER_GOAL = 1;
export const POINTS_PER_ASSIST = 0.5;
export const POINTS_PER_DECISIVE_PASS = 0.5;
export const POINTS_PER_STAR = 0.5;

export type PerformanceEntry = {
    goals: number;
    assists: number;
    decisive_passes: number;
    stars: number;
};

export const EMPTY_PERFORMANCE: PerformanceEntry = {
    goals: 0,
    assists: 0,
    decisive_passes: 0,
    stars: 0,
};

/** Points earned from what the player produced in the match. */
export function performancePoints(entry: PerformanceEntry): number {
    return (
        entry.goals * POINTS_PER_GOAL +
        entry.assists * POINTS_PER_ASSIST +
        entry.decisive_passes * POINTS_PER_DECISIVE_PASS
    );
}

/** Stars award the same bonus on every tactical attribute. */
export function starBonus(entry: PerformanceEntry): number {
    return entry.stars * POINTS_PER_STAR;
}

/** Net change applied to passing (PAS) and finishing (SHO). */
export function passAttackDelta(entry: PerformanceEntry): number {
    return performancePoints(entry) + starBonus(entry) - PARTICIPATION_PENALTY;
}

/** Net change applied to the remaining attributes (stars only). */
export function otherAttributeDelta(entry: PerformanceEntry): number {
    return starBonus(entry);
}

export function formatDelta(value: number): string {
    const rounded = Math.round(value * 10) / 10;

    return rounded > 0 ? `+${rounded}` : `${rounded}`;
}
