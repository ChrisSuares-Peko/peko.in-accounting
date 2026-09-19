import { describe, it, expect } from 'vitest';

import { isAccountOwner } from '../../utils/activeRole';

describe('isAccountOwner', () => {
    it('is true for a corporate session with no cardholder identity', () => {
        expect(isAccountOwner('corporate', 0)).toBe(true);
        expect(isAccountOwner('corporate', null)).toBe(true);
        expect(isAccountOwner('corporate', undefined)).toBe(true);
    });

    // The whole reason this exists: a sub-corporate session keeps role 'corporate'.
    it('is false for a sub-corporate member, however senior', () => {
        expect(isAccountOwner('corporate', 99)).toBe(false);
        expect(isAccountOwner('corporate', '99')).toBe(false);
    });

    it('is false for any other role', () => {
        expect(isAccountOwner('user', 0)).toBe(false);
        expect(isAccountOwner('system_user', 0)).toBe(false);
        expect(isAccountOwner(undefined, 0)).toBe(false);
        expect(isAccountOwner(null, null)).toBe(false);
    });

    // The role reaches Redux lowercased by /user/login; the backend's own casing must not pass.
    it('does not accept the backend spelling of the role', () => {
        expect(isAccountOwner('CORPORATE', 0)).toBe(false);
    });
});
