import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowIcon } from "@/components/icons";

export default function NotFound() {
    return (
        <main className="min-h-[80vh] grid place-items-center bg-[var(--color-paper)] p-6">
            <section className="max-w-md text-center animate-fade-in">
                <p className="text-label tracking-widest text-[var(--color-ink-muted)] mb-4">404</p>
                <h1 className="text-h2 mb-4">Oops. This page wandered off.</h1>
                <p className="text-body text-[var(--color-ink-soft)] mb-8">
                    Probably looking for a snack. Let&apos;s get you back on track.
                </p>

                {/* Primary CTA */}
                <Link href="/">
                    <Button size="lg" className="mb-8">
                        Go Home
                        <ArrowIcon />
                    </Button>
                </Link>

                {/* Secondary Links */}
                <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-caption">
                    <Link href="/about" className="text-[var(--color-ink-soft)] hover:text-[var(--color-accent)] transition-colors">
                        About
                    </Link>
                    <Link href="/notes" className="text-[var(--color-ink-soft)] hover:text-[var(--color-accent)] transition-colors">
                        Notes
                    </Link>
                    <Link href="/speaking" className="text-[var(--color-ink-soft)] hover:text-[var(--color-accent)] transition-colors">
                        Speaking
                    </Link>
                </nav>
            </section>
        </main>
    );
}
