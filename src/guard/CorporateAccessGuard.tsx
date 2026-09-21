type CorporateAccessGuardProps = {
    children: React.ReactNode;
};

// Login flow removed for this prototype: service-level access here was normally
// driven by `services.data`, which is only ever populated by the real
// getUserServices() API call made after login. Without a real login that call
// never fires, so this guard is bypassed entirely (always grants access) instead
// of showing "Access Denied" on every route.
export default function CorporateAccessGuard({ children }: CorporateAccessGuardProps) {
    return <>{children}</>;
}
