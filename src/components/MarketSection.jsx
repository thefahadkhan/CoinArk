import { useState, useEffect } from "react"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line } from "recharts"
import { fetchBitcoinData, fetchMarketData, formatNumber, formatPrice } from "../lib/MarketAPI"
import "../styles/MarketSection.css"

// Chart type options
const chartTypes = ["area", "bar", "line"]
const timeframes = ["24h", "7d", "30d", "90d", "1y", "All"]

// Cache duration in milliseconds (4 hour)
const CACHE_DURATION = 4 * 60 * 60 * 1000

const MarketSection = ({ fullView = false }) => {
  const [selectedChart, setSelectedChart] = useState("area")
  const [selectedTimeframe, setSelectedTimeframe] = useState("24h")
  const [bitcoinData, setBitcoinData] = useState({
    price: 0,
    priceChange24h: 0,
    chartData: [],
  })
  const [marketStats, setMarketStats] = useState({
    marketCap: { value: 0, change: 0, chartData: [] },
    volume: { value: 0, change: 0, chartData: [] },
    btcDominance: { value: 0, change: 0 },
    sentiment: "Neutral",
  })
  const [loading, setLoading] = useState(true)

  // Load Bitcoin data when component mounts or timeframe changes
  useEffect(() => {
    const loadBitcoinData = async () => {
      try {
        // Check if we have cached data for this timeframe
        const cacheKey = `bitcoinData_${selectedTimeframe}`
        const cachedData = localStorage.getItem(cacheKey)

        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData)
          const now = Date.now()

          // Use cached data if it's less than 1 hour old
          if (now - timestamp < CACHE_DURATION) {
            console.log(`Using cached Bitcoin data for ${selectedTimeframe}`)
            setBitcoinData(data)
            return
          }
        }

        // Fetch fresh data if no cache or cache is expired
        console.log(`Fetching fresh Bitcoin data for ${selectedTimeframe}`)
        const data = await fetchBitcoinData(selectedTimeframe)
        setBitcoinData(data)

        // Cache the new data with current timestamp
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            data,
            timestamp: Date.now(),
          }),
        )
      } catch (error) {
        console.error("Failed to load Bitcoin data:", error)
      }
    }

    loadBitcoinData()
  }, [selectedTimeframe])

  // Load market data after bitcoin data is loaded
  useEffect(() => {
    const loadMarketData = async () => {
      if (bitcoinData.price > 0) {
        try {
          // Check if we have cached market data
          const cacheKey = "marketData"
          const cachedData = localStorage.getItem(cacheKey)

          if (cachedData) {
            const { data, timestamp } = JSON.parse(cachedData)
            const now = Date.now()

            // Use cached data if it's less than 1 hour old
            if (now - timestamp < CACHE_DURATION) {
              console.log("Using cached market data")
              setMarketStats(data)
              setLoading(false)
              return
            }
          }

          // Fetch fresh data if no cache or cache is expired
          console.log("Fetching fresh market data")
          const data = await fetchMarketData(bitcoinData.priceChange24h)
          setMarketStats(data)

          // Cache the new data with current timestamp
          localStorage.setItem(
            cacheKey,
            JSON.stringify({
              data,
              timestamp: Date.now(),
            }),
          )

          setLoading(false)
        } catch (error) {
          console.error("Failed to load market data:", error)
          setLoading(false)
        }
      }
    }

    loadMarketData()
  }, [bitcoinData.price, bitcoinData.priceChange24h])

  // Render the appropriate chart based on selected type
  const renderChart = () => {
    if (loading || !bitcoinData.chartData.length) {
      return <div className="loading-chart">Loading chart data...</div>
    }

    switch (selectedChart) {
      case "area":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={bitcoinData.chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#9b87f5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" />
              <YAxis domain={["auto", "auto"]} />
              <Tooltip
                formatter={(value) => [formatPrice(value), "Price"]}
                contentStyle={{
                  backgroundColor: "#2A2D3A",
                  border: "1px solid #9b87f5",
                  borderRadius: "8px",
                  color: "white",
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#9b87f5"
                fillOpacity={1}
                fill="url(#colorValue)"
                isAnimationActive={true}
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        )
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bitcoinData.chartData}>
              <XAxis dataKey="name" />
              <YAxis domain={["auto", "auto"]} />
              <Tooltip
                formatter={(value) => [formatPrice(value), "Price"]}
                contentStyle={{
                  backgroundColor: "#2A2D3A",
                  border: "1px solid #9b87f5",
                  borderRadius: "8px",
                  color: "white",
                }}
              />
              <Bar dataKey="value" fill="#9b87f5" isAnimationActive={true} animationDuration={1000} />
            </BarChart>
          </ResponsiveContainer>
        )
      case "line":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={bitcoinData.chartData}>
              <XAxis dataKey="name" />
              <YAxis domain={["auto", "auto"]} />
              <Tooltip
                formatter={(value) => [formatPrice(value), "Price"]}
                contentStyle={{
                  backgroundColor: "#2A2D3A",
                  border: "1px solid #9b87f5",
                  borderRadius: "8px",
                  color: "white",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#9b87f5"
                strokeWidth={2}
                isAnimationActive={true}
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
        )
      default:
        return null
    }
  }

  return (
    <section className="market-section">
      <div className="market-container">
        <div className="market-header">
          <h2 className="market-title">
            Market <span>Overview</span>
          </h2>
          <p className="market-description">Track real-time cryptocurrency market data</p>
        </div>

        <div className="crypto-card">
          <div className="chart-header">
            <div className="coin-info">
              <h3 className="coin-name">Bitcoin</h3>
              <div className="coin-price">
                <span className="price-value">{loading ? "Loading..." : formatPrice(bitcoinData.price)}</span>
                <span className={`price-change ${bitcoinData.priceChange24h >= 0 ? "positive" : "negative"}`}>
                  {loading
                    ? "..."
                    : `${bitcoinData.priceChange24h >= 0 ? "+" : ""}${bitcoinData.priceChange24h.toFixed(2)}%`}
                </span>
              </div>
            </div>

            <div className="chart-controls">
              {chartTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedChart(type)}
                  className={`chart-type-button ${selectedChart === type ? "active" : ""}`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="chart-container">{renderChart()}</div>

          <div className="timeframe-controls">
            {timeframes.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTimeframe(time)}
                className={`timeframe-button ${selectedTimeframe === time ? "active" : ""}`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        <div className="market-stats">
          <div className="crypto-card stat-card">
            <h4 className="stat-title">Market Cap</h4>
            <div className="stat-value">
              <span className="stat-number">{loading ? "Loading..." : formatNumber(marketStats.marketCap.value)}</span>
              <span className={`stat-change ${marketStats.marketCap.change >= 0 ? "positive" : "negative"}`}>
                {loading
                  ? "..."
                  : `${marketStats.marketCap.change >= 0 ? "+" : ""}${marketStats.marketCap.change.toFixed(2)}%`}
              </span>
            </div>
            <div className="stat-chart">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={marketStats.marketCap.chartData}>
                  <defs>
                    <linearGradient id="colorMarketCap" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#9b87f5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#9b87f5"
                    fillOpacity={1}
                    fill="url(#colorMarketCap)"
                    isAnimationActive={true}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="crypto-card stat-card">
            <h4 className="stat-title">24h Volume</h4>
            <div className="stat-value">
              <span className="stat-number">{loading ? "Loading..." : formatNumber(marketStats.volume.value)}</span>
              <span className={`stat-change ${marketStats.volume.change >= 0 ? "positive" : "negative"}`}>
                {loading
                  ? "..."
                  : `${marketStats.volume.change >= 0 ? "+" : ""}${marketStats.volume.change.toFixed(2)}%`}
              </span>
            </div>
            <div className="stat-chart">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={marketStats.volume.chartData}>
                  <defs>
                    <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D946EF" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#D946EF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#D946EF"
                    fillOpacity={1}
                    fill="url(#colorVolume)"
                    isAnimationActive={true}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="crypto-card stat-card">
            <h4 className="stat-title">BTC Dominance</h4>
            <div className="stat-value">
              <span className="stat-number">
                {loading ? "Loading..." : `${marketStats.btcDominance.value.toFixed(1)}%`}
              </span>
              <span className={`stat-change ${marketStats.btcDominance.change >= 0 ? "positive" : "negative"}`}>
                {loading
                  ? "..."
                  : `${marketStats.btcDominance.change >= 0 ? "+" : ""}${marketStats.btcDominance.change.toFixed(2)}%`}
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-value"
                style={{ width: loading ? "0%" : `${marketStats.btcDominance.value}%` }}
              ></div>
            </div>
          </div>

          <div className="crypto-card stat-card">
            <h4 className="stat-title">Market Sentiment</h4>
            <div className="stat-value">
              <span
                className="stat-number"
                style={{
                  color:
                    marketStats.sentiment === "Bullish"
                      ? "var(--crypto-neon-green)"
                      : marketStats.sentiment === "Bearish"
                        ? "var(--crypto-neon-red)"
                        : "var(--crypto-neon-yellow)",
                }}
              >
                {loading ? "Loading..." : marketStats.sentiment}
              </span>
            </div>
            <div className="sentiment-scale">
              <div className="scale-labels">
                <span className="scale-label">Fear</span>
                <span className="scale-label">Greed</span>
              </div>
              <div className="sentiment-bar">
                <div
                  className="sentiment-indicator"
                  style={{
                    left: loading
                      ? "50%"
                      : marketStats.sentiment === "Bullish"
                        ? "70%"
                        : marketStats.sentiment === "Bearish"
                          ? "30%"
                          : "50%",
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MarketSection;