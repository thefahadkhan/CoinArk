import React from "react";
import "../About/AboutSection.css"; 

export default function About() {
  return (
    <div className="container">
      <h1>About CoinArk</h1>

      <div className="card">
        <h2>Our Mission</h2>
        <p className="text-secondary">
          CoinArk is dedicated to providing a comprehensive platform for cryptocurrency enthusiasts, traders, and
          investors. Our mission is to simplify the complex world of digital assets and make it accessible to everyone.
        </p>
        <p className="text-secondary">
          We believe in the power of blockchain technology and its potential to revolutionize the financial landscape.
          Through our platform, we aim to educate, inform, and empower our users to make informed decisions in the
          crypto space.
        </p>
      </div>

      <div className="grid">
        <div className="card">
          <h3>Real-Time Data</h3>
          <p className="text-secondary">
            Access up-to-date information on thousands of cryptocurrencies, including prices, market caps, trading
            volumes, and historical data.
          </p>
        </div>
        <div className="card">
          <h3>Advanced Analytics</h3>
          <p className="text-secondary">
            Utilize our powerful analytical tools to track market trends, identify opportunities, and make data-driven
            investment decisions.
          </p>
        </div>
        <div className="card">
          <h3>Portfolio Management</h3>
          <p className="text-secondary">
            Track your crypto holdings, monitor performance, and analyze your investment strategy with our intuitive
            portfolio management tools.
          </p>
        </div>
        <div className="card">
          <h3>Latest News</h3>
          <p className="text-secondary">
            Stay informed with the latest developments in the crypto world through our curated news feed from trusted
            sources.
          </p>
        </div>
      </div>

      <div className="card">
        <h2>Our Team</h2>
        <p className="text-secondary">
          CoinArk is built by a team of passionate blockchain enthusiasts, financial experts, and software engineers who
          share a common vision of making cryptocurrency accessible to all.
        </p>
        <p className="text-secondary">
          Founded in 2023, our team has grown to include professionals from diverse backgrounds, all united by our
          commitment to innovation, transparency, and user-centric design.
        </p>
      </div>
    </div>
  );
}
