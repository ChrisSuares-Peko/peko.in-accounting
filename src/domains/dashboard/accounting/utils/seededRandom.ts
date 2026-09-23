const MODULUS = 4294967296; // 2^32
const MULTIPLIER = 1664525;
const INCREMENT = 1013904223;

// Deterministic PRNG (a linear congruential generator) so the generated
// posting history is stable across reloads — unlike Math.random(), the same
// seed always produces the same sequence, which is what lets this data
// "regenerate correctly whenever it's viewed" instead of reshuffling on every
// page load. Pure arithmetic (no bitwise ops) — every intermediate product
// stays well under Number.MAX_SAFE_INTEGER, so there's no precision loss.
export const createSeededRandom = (seed: number) => {
    let state = seed % MODULUS;

    // Returns a float in [0, 1).
    const next = (): number => {
        state = (state * MULTIPLIER + INCREMENT) % MODULUS;
        return state / MODULUS;
    };

    // Integer in [min, max], inclusive.
    const int = (min: number, max: number): number => min + Math.floor(next() * (max - min + 1));

    // Rounds to the nearest 100 so amounts look like realistic rupee figures
    // rather than arbitrary decimals.
    const amount = (min: number, max: number): number => Math.round(int(min, max) / 100) * 100;

    const pick = <T,>(items: T[]): T => items[int(0, items.length - 1)];

    const chance = (probability: number): boolean => next() < probability;

    return { next, int, amount, pick, chance };
};
