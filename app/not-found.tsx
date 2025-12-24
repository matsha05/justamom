import Link from "next/link";

export default function NotFound() {
    return (
        <main className="min-h-[80vh] grid place-items-center bg-[var(--color-paper)] p-6">
            <section className="max-w-md text-center">
                <p className="text-label tracking-widest text-[var(--color-ink-muted)] mb-4">404</p>
                <h1 className="text-h2 mb-4">Can&apos;t find that page</h1>
                <p className="text-body text-[var(--color-ink-soft)] mb-8">
                    It seems you&apos;ve wandered a bit too far. Let&apos;s get you back to where you meant to go.
                </p>

                <nav className="grid gap-3 text-body-lg">
                    <Link href="/" className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] underline underline-offset-4 decoration-1">
                        Home
                    </Link>
                    <Link href="/about" className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] underline underline-offset-4 decoration-1">
                        About Lizi
                    </Link>
                    <Link href="/notes" className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] underline underline-offset-4 decoration-1">
                        Read the Notes
                    </Link>
                    <Link href="/speaking" className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] underline underline-offset-4 decoration-1">
                        Speaking
                    </Link>
                </nav>
            </section>
        </main>
    );
}
