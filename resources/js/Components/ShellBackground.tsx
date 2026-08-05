/**
 * The decorative backdrop shared by every full-page shell in the app: the
 * faint grid overlay and the LED strip along the top edge. Purely visual —
 * identical whether the visitor is authenticated or on the public portal.
 */
export default function ShellBackground() {
    return (
        <>
            <div className="app-grid-overlay" />

            <div className="app-led" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
            </div>
        </>
    );
}
