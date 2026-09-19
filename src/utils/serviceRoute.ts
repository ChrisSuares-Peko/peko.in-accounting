export const MORE_SERVICES_PREFIX = '/more-services';

/**
 * Builds a corporate service's route from its `serviceAccess` entry.
 *
 * Services flagged `enableMoreService` live under the `/more-services` prefix; all
 * others are top-level. This is the single source of truth for label → route
 * derivation used by the sidebar, the More Services page and the access guard —
 * keep the registered routes in `paths.ts` in sync with what this produces.
 */
export const toServiceRoute = (label: string, enableMoreService?: boolean): string => {
    const slug = label.trim().toLowerCase().replace(/\s+/g, '-');
    return enableMoreService ? `${MORE_SERVICES_PREFIX}/${slug}` : `/${slug}`;
};
