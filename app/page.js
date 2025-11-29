export default function HomePage() {
  return (
    <main id="home">
      <section className="hero section">
        <div className="hero-inner container">
          <div className="hero-copy">
            <div className="eyebrow pill">Author &amp; speaker for real moms</div>
            <h1>Helping Moms find clarity, courage and peace in a noisy world.</h1>
            <p className="lead">
              Real stories. Biblical truth. A lighthearted look at the everyday moments that shape our lives.
            </p>
            <div className="cta-stack">
              <a className="btn primary" target="_blank" rel="noreferrer noopener" href="https://preview.mailerlite.io/forms/1931972/171530137383208676/share">
                Join the list
              </a>
              <div className="micro-note">
                Monthly notes for real moms who feel stretched thin and want steady, honest encouragement.
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-frame"></div>
            <img
              src="https://static.wixstatic.com/media/62a4af_453a8ebd073346b3b4dcde7560d8624c~mv2.jpg"
              alt="Lizi Shaw portrait"
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container content-stack">
          <div className="section-block">
            <p className="eyebrow">About</p>
            <h2 className="section-title">Walking closely with Jesus in the middle of real life.</h2>
            <p className="body-large">
              Hi, I’m Lizi. I’m a wife, a mom of three, and a woman who is learning every day what it means to walk closely with Jesus in the middle of real life.
            </p>
            <a className="btn secondary" href="/about">
              Read more about Lizi
            </a>
          </div>
          <div className="quote-block">
            <p className="pull-quote">Motherhood can feel loud. Let’s quiet the noise together and listen for His voice.</p>
            <p className="lead">A quiet moment of encouragement delivered to your inbox.</p>
            <a className="btn primary" target="_blank" rel="noreferrer noopener" href="https://preview.mailerlite.io/forms/1931972/171530137383208676/share">
              Join the list
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container content-stack">
          <div className="section-block">
            <h3>Speaking</h3>
            <p className="lead">Lizi loves sharing honest, biblical encouragement with moms at churches and gatherings.</p>
            <a className="btn secondary" href="/speaking">
              View speaking topics
            </a>
          </div>
          <div className="section-block">
            <h3>Contact</h3>
            <p className="lead">Interested in inviting Lizi or just want to say hi? Reach out anytime.</p>
            <a className="btn secondary" href="/contact">
              Get in touch
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
