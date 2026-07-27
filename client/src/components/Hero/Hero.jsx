function Hero({ setPage }) {
  return (
    <section className="hero">
      <h2>
        Share clipboard instantly
        <br />
        across your devices.
      </h2>
      <p>
        Secure temporary clipboard sharing with automatic expiration.
      </p>
      <div className="hero-buttons">
        <div
          className="hero-card"
          onClick={() => setPage("send")}
        >
          <div className="hero-icon">📤</div>
          <h3>Send Clipboard</h3>
          <p>Share text instantly</p>
        </div>

        <div
          className="hero-card"
          onClick={() => setPage("receive")}
        >
          <div className="hero-icon">📥</div>
          <h3>Receive Clipboard</h3>
          <p>Retrieve text using a code</p>
        </div>
      </div>
    </section>
  );
}

export default Hero;