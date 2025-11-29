import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "Lizi Shaw",
  description: "Author and speaker for real moms",
};

function Nav() {
  return (
    <nav className="nav">
      <Link href="/" className="nav-link">
        Home
      </Link>
      <Link href="/about" className="nav-link">
        About Me
      </Link>
      <Link href="/speaking" className="nav-link">
        Speaking Topics
      </Link>
      <Link href="/contact" className="nav-link">
        Contact
      </Link>
    </nav>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Allura&family=Inter:wght@300;400;500;600&family=Playfair+Display:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <header className="top-bar">
          <div className="container header-inner">
            <Link href="/" className="brand">
              <img
                src="/images/peony-logo.png"
                alt="Lizi Shaw peony mark"
                className="brand-logo"
              />
              <div className="brand-text">
                <span className="brand-signature">Lizi Shaw</span>
                <span className="brand-tagline">Speaker | Writer Encourager</span>
              </div>
            </Link>
            <Nav />
          </div>
        </header>
        {children}
        <footer className="footer">
          <div className="container footer-content">
            <span>© 2025 by Lizi Shaw.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
