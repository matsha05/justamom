export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[var(--color-cream-light)] border-t border-[var(--color-gray-light)]/30 py-8">
            <div className="container-main">
                <p className="text-center text-sm text-[var(--color-gray-medium)]">
                    © {currentYear} by Lizi Shaw.
                </p>
            </div>
        </footer>
    );
}
