import * as Yup from 'yup';

// Every plan/package/catalog-level commission form (service-operator forms are excluded —
// those validate commission against the transaction amount at runtime, not a fixed price) needs
// the same rule: a Flat commission can't exceed the item's price, and a Percentage commission
// can't exceed 100. Shared here so each form only needs to say which field(s) hold its price.

const getRootValues = (context: Yup.TestContext) => {
    const { from } = context;
    return from && from.length > 0 ? from[from.length - 1].value : context.parent;
};

const getByPath = (source: unknown, path: string) =>
    path.split('.').reduce<unknown>((acc, key) => {
        if (acc == null || typeof acc !== 'object') return undefined;
        return (acc as Record<string, unknown>)[key];
    }, source);

const toNumber = (value: unknown): number => parseFloat(String(value));

/**
 * Adds the Flat-\<=-price / Percentage-\<=-100 cross-field rule to a commission schema.
 *
 * @param schema the base `commission` schema (string or number) to extend
 * @param resolvePrices either a list of sibling field paths (dot-notation for nested fields,
 *   e.g. `'packagePrices.monthly'`) whose smallest value becomes the Flat ceiling, or a resolver
 *   function for forms where the reference price isn't a simple field (e.g. gift card denominations)
 * @param commissionTypeField sibling field holding 'PERCENTAGE' | 'FLAT' (defaults to 'commissionType')
 */
export function withCommissionLimitTest<T extends Yup.AnySchema>(
    schema: T,
    resolvePrices: string[] | ((rootValues: any) => Array<number | string | null | undefined>),
    commissionTypeField = 'commissionType'
): T {
    return schema.test('commission-within-limit', 'Invalid commission value', function commissionWithinLimit(value) {
        if (value === undefined || value === null || value === '') return true;
        const numericValue = toNumber(value);
        if (Number.isNaN(numericValue)) return true; // a type/required test elsewhere reports this

        const commissionType = this.parent?.[commissionTypeField];
        if (commissionType === 'PERCENTAGE') {
            return numericValue <= 100
                ? true
                : this.createError({ message: 'Commission cannot exceed 100% when type is Percentage' });
        }
        if (commissionType === 'FLAT') {
            const root = getRootValues(this);
            const rawPrices = Array.isArray(resolvePrices)
                ? resolvePrices.map(field => getByPath(root, field))
                : resolvePrices(root);
            const prices = rawPrices.map(toNumber).filter(price => !Number.isNaN(price));
            if (prices.length === 0) return true; // no reference price available — nothing to check yet
            const maxAllowed = Math.min(...prices);
            return numericValue <= maxAllowed
                ? true
                : this.createError({ message: 'Commission cannot exceed the price amount when type is Flat' });
        }
        return true;
    }) as T;
}
