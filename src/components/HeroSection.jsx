import React, { useState, useEffect, useRef } from "react";
import { Search, Loader } from "lucide-react";
import { fetchTrendingCoins, fetchTopCoins, fetchCoinPrices, searchCoins } from "../lib/HeroAPI";
import "../styles/HeroSection.css";

function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [trendingCoins, setTrendingCoins] = useState([]);
  const [topCoins, setTopCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [trending, top] = await Promise.all([fetchTrendingCoins(), fetchTopCoins(6)]);

        if (trending.length > 0) {
          const trendingIds = trending.map((coin) => coin.id);
          const priceData = await fetchCoinPrices(trendingIds);

          const updatedTrending = trending.map((coin) => {
            const coinData = priceData[coin.id];
            if (coinData) {
              return {
                ...coin,
                price: `$${coinData.usd.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
                change: `${coinData.usd_24h_change > 0 ? "+" : ""}${coinData.usd_24h_change.toFixed(2)}%`,
                isPositive: coinData.usd_24h_change > 0,
              };
            }
            return coin;
          });

          setTrendingCoins(updatedTrending);
        }

        setTopCoins(top);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load cryptocurrency data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const refreshInterval = setInterval(fetchData, 60000);
    return () => clearInterval(refreshInterval);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim()) {
        const results = await searchCoins(searchQuery);
        setSearchResults(results);
        setShowSearchResults(true);
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section className="hero-section">
      <div className="hero-background"></div>
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Discover the Future of <span className="gradient-text">Digital Finance</span>
          </h1>
          <p className="hero-subtitle">
            Track real-time cryptocurrency prices, manage your portfolio, and stay updated with the latest market trends.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary btn-lg neon-glow">Get Started</button>
            <button className="btn btn-secondary btn-lg">Learn More</button>
          </div>

          <div className="hero-search" ref={searchRef}>
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search for cryptocurrencies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {showSearchResults && searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map((coin) => (
                  <div key={coin.id} className="search-result-item">
                    <div className="search-result-icon">
                      {coin.image ? (
                        <img src={coin.image || "/placeholder.svg"} alt={coin.name} />
                      ) : (
                        <span>{coin.symbol.charAt(0)}</span>
                      )}
                    </div>
                    <div className="search-result-info">
                      <div className="search-result-name">{coin.name}</div>
                      <div className="search-result-symbol">{coin.symbol}</div>
                    </div>
                    <div className="search-result-rank">#{coin.market_cap_rank}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="hero-stats">
          <h3 className="hero-stats-title">Live Prices</h3>
          {loading ? (
            <div className="hero-stats-loading">
              <Loader className="loading-spinner" />
              <p>Loading prices...</p>
            </div>
          ) : error ? (
            <div className="hero-stats-error">
              <p>{error}</p>
              <button onClick={() => fetchTopCoins(4).then(setTopCoins)} className="retry-button">
                Try Again
              </button>
            </div>
          ) : (
            topCoins.slice(0, 4).map((coin) => (
              <div key={coin.id} className="hero-stat-item">
                <div className="hero-stat-coin">
                  <div className="hero-stat-icon">
                    {coin.image ? (
                      <img src={coin.image || "/placeholder.svg"} alt={coin.name} />
                    ) : (
                      <span>{coin.symbol.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <div className="hero-stat-name">{coin.name}</div>
                    <div className="hero-stat-symbol">{coin.symbol}</div>
                  </div>
                </div>
                <div>
                  <div className="hero-stat-price">{coin.price}</div>
                  <div className={`hero-stat-change ${coin.isPositive ? "positive" : "negative"}`}>
                    {coin.change}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="container trending-coins">
        <h3 className="trending-title">Trending Coins</h3>
        {loading ? (
          <div className="trending-loading">
            <Loader className="loading-spinner" />
            <p>Loading trending coins...</p>
          </div>
        ) : error ? (
          <div className="trending-error">
            <p>{error}</p>
            <button onClick={() => fetchTrendingCoins().then(setTrendingCoins)} className="retry-button">
              Try Again
            </button>
          </div>
        ) : (
          <div className="trending-grid">
            {trendingCoins.slice(0, 6).map((coin) => (
              <div key={coin.id} className="trending-item">
                <div className="trending-icon">
                  {coin.image ? (
                    <img src={coin.image || "/placeholder.svg"} alt={coin.name} />
                  ) : (
                    <span>{coin.symbol.charAt(0)}</span>
                  )}
                </div>
                <div className="trending-name">{coin.name}</div>
                <div className="trending-price">{coin.price}</div>
                <div className={`trending-change ${coin.isPositive ? "positive" : "negative"}`}>
                  {coin.change}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default HeroSection;