import React, { useState, useEffect } from 'react';
import '../styles/PortfolioTracker.css';

function App() {
  const initialPortfolio = [
    { coin: "Bitcoin", symbol: "BTC", allocation: 45, color: "var(--accent-primary)" },
    { coin: "Ethereum", symbol: "ETH", allocation: 20, color: "var(--accent-secondary)" },
    { coin: "Solana", symbol: "SOL", allocation: 15, color: "var(--accent-tertiary)" },
    { coin: "Cardano", symbol: "ADA", allocation: 10, color: "var(--positive)" },
    { coin: "Polkadot", symbol: "DOT", allocation: 10, color: "var(--negative)" },
  ];

  const [portfolioData, setPortfolioData] = useState(() => {
    const saved = localStorage.getItem("portfolioData");
    return saved ? JSON.parse(saved) : initialPortfolio;
  });

  const [activeTimeframe, setActiveTimeframe] = useState("1W");
  const [chartData, setChartData] = useState([]);
  const [formData, setFormData] = useState({
    coin: "bitcoin",
    amount: "",
    price: "",
  });

  const timeframePoints = {
    "1D": 24,
    "1W": 7,
    "1M": 30,
    "3M": 90,
    "YTD": 365,
    "1Y": 12,
    "ALL": 60,
  };

  useEffect(() => {
    generateChartData();
  }, [activeTimeframe]);

  useEffect(() => {
    localStorage.setItem("portfolioData", JSON.stringify(portfolioData));
  }, [portfolioData]);

  const generateChartData = () => {
    const dataPoints = timeframePoints[activeTimeframe] || 30;
    const data = [];
    let lastValue = 50;
    for (let i = 0; i < dataPoints; i++) {
      const change = Math.random() * 10 - 4;
      lastValue = Math.max(10, Math.min(90, lastValue + change));
      data.push(lastValue);
    }
    setChartData(data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { coin, amount, price } = formData;
    if (!amount || !price) {
      alert("Please fill in all fields");
      return;
    }

    const symbol = coin.slice(0, 3).toUpperCase();
    const newAsset = {
      coin: coin.charAt(0).toUpperCase() + coin.slice(1),
      symbol,
      allocation: 0, // For now static, can calculate later
      color: "var(--accent-primary)",
    };

    setPortfolioData([...portfolioData, newAsset]);

    alert(`Added ${amount} of ${coin} at $${price} per coin`);
    setFormData({ coin: "bitcoin", amount: "", price: "" });
  };

  const generateConicGradient = () => {
    let gradient = "conic-gradient(";
    let startPercentage = 0;
    portfolioData.forEach((asset, index) => {
      const endPercentage = startPercentage + asset.allocation;
      gradient += `${asset.color} ${startPercentage}% ${endPercentage}%`;
      if (index < portfolioData.length - 1) gradient += ", ";
      startPercentage = endPercentage;
    });
    gradient += ")";
    return gradient;
  };

  const timeframes = Object.keys(timeframePoints);

  return (
    <section className="portfolio-section">
      <div className="container">
        <div className="portfolio-header">
          <h2 className="portfolio-title">Portfolio <span>Tracker</span></h2>
          <p className="portfolio-subtitle">Monitor your cryptocurrency investments in one place</p>
        </div>

        <div className="portfolio-grid">
          {/* Portfolio Summary */}
          <div className="portfolio-summary">
            <div className="portfolio-summary-header">
              <h3 className="portfolio-summary-title">Portfolio Summary</h3>
            </div>

            <div className="portfolio-total">$12,345.67</div>
            <div className="portfolio-change positive">+$567.89 (4.82%)</div>

            <div className="portfolio-chart">
              <div className="portfolio-chart-line">
                {chartData.map((height, index) => (
                  <div key={index} className="portfolio-chart-bar" style={{ height: `${height}%` }} />
                ))}
              </div>
            </div>

            <div className="portfolio-timeframes">
              {timeframes.map((timeframe) => (
                <button
                  key={timeframe}
                  className={`portfolio-timeframe ${activeTimeframe === timeframe ? "active" : ""}`}
                  onClick={() => setActiveTimeframe(timeframe)}
                >
                  {timeframe}
                </button>
              ))}
            </div>
          </div>

          {/* Portfolio Allocation */}
          <div className="portfolio-allocation">
            <div className="portfolio-allocation-header">
              <h3 className="portfolio-allocation-title">Asset Allocation</h3>
            </div>

            <div className="portfolio-pie">
              <div className="portfolio-pie-chart" style={{ background: generateConicGradient() }} />
              <div className="portfolio-pie-center">{portfolioData.length} Assets</div>
            </div>

            <div className="portfolio-legend">
              {portfolioData.map((item) => (
                <div key={item.coin} className="portfolio-legend-item">
                  <div className="portfolio-legend-color" style={{ backgroundColor: item.color }} />
                  <div className="portfolio-legend-label">{item.coin} ({item.symbol})</div>
                  <div className="portfolio-legend-value">{item.allocation}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Asset Form */}
          <div className="portfolio-add">
            <div className="portfolio-add-header">
              <h3 className="portfolio-add-title">Add New Asset</h3>
            </div>

            <form className="portfolio-form" onSubmit={handleSubmit}>
              <div className="portfolio-form-group">
                <label className="portfolio-form-label">Select Coin</label>
                <select
                  className="portfolio-form-select"
                  name="coin"
                  value={formData.coin}
                  onChange={handleInputChange}
                >
                  <option value="bitcoin">Bitcoin (BTC)</option>
                  <option value="ethereum">Ethereum (ETH)</option>
                  <option value="solana">Solana (SOL)</option>
                  <option value="cardano">Cardano (ADA)</option>
                  <option value="polkadot">Polkadot (DOT)</option>
                  <option value="avalanche">Avalanche (AVAX)</option>
                </select>
              </div>

              <div className="portfolio-form-group">
                <label className="portfolio-form-label">Amount</label>
                <input
                  type="number"
                  className="portfolio-form-input"
                  placeholder="0.00"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  min="0"
                  step="any"
                />
              </div>

              <div className="portfolio-form-group">
                <label className="portfolio-form-label">Purchase Price (USD)</label>
                <input
                  type="number"
                  className="portfolio-form-input"
                  placeholder="0.00"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="any"
                />
              </div>

              <button type="submit" className="portfolio-form-submit neon-glow">
                Add to Portfolio
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default App;