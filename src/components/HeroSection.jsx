import { useState, useEffect, useRef, useCallback } from "react"
import { Search, Loader } from "lucide-react"
import { fetchTrendingCoins, fetchTopCoins, fetchCoinPrices, searchCoins, fetchGlobalData } from "../lib/HeroAPI"
import "../styles/HeroSection.css"

// Cache duration in milliseconds (4 hour)
const CACHE_DURATION = 4 * 60 * 60 * 1000

function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [trendingCoins, setTrendingCoins] = useState([])
  const [topCoins, setTopCoins] = useState([])
  const [globalData, setGlobalData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const searchRef = useRef(null)
  const refreshIntervalRef = useRef(null)

  // Format large numbers with commas and specified decimal places
  const formatNumber = (num, decimals = 0) => {
    if (!num) return "N/A"
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: decimals,
    }).format(num)
  }

  // Format currency with $ symbol and commas
  const formatCurrency = (num, decimals = 0) => {
    if (!num) return "N/A"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: decimals,
    }).format(num)
  }

  // Check localStorage for cached data
  const getFromCache = (key) => {
    try {
      const cachedData = localStorage.getItem(key)
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData)
        const currentTime = new Date().getTime()

        // Check if the cached data is less than 1 hour old
        if (currentTime - timestamp < CACHE_DURATION) {
          console.log(`Using cached ${key} data`)
          return data
        }
        console.log(`Cached ${key} data expired, fetching fresh data`)
      }
    } catch (err) {
      console.error(`Error reading ${key} from cache:`, err)
    }
    return null
  }

  // Save data to localStorage with timestamp
  const saveToCache = (key, data) => {
    try {
      localStorage.setItem(
        key,
        JSON.stringify({
          data,
          timestamp: new Date().getTime(),
        }),
      )
    } catch (err) {
      console.error(`Error saving ${key} to cache:`, err)
    }
  }

  // Single function to fetch all necessary data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      console.log("📡 Fetching data from API...")

      // Check cache for trending coins
      let trending = getFromCache("trendingCoins")
      let top = getFromCache("topCoins")
      let global = getFromCache("globalData")

      // Fetch data that's not in cache
      const fetchPromises = []

      if (!trending) {
        fetchPromises.push(
          fetchTrendingCoins().then((data) => {
            trending = data
            saveToCache("trendingCoins", data)
          }),
        )
      }

      if (!top) {
        fetchPromises.push(
          fetchTopCoins(6).then((data) => {
            top = data
            saveToCache("topCoins", data)
          }),
        )
      }

      if (!global) {
        fetchPromises.push(
          fetchGlobalData().then((data) => {
            global = data
            saveToCache("globalData", data)
          }),
        )
      }

      // Wait for all non-cached data to be fetched
      if (fetchPromises.length > 0) {
        await Promise.all(fetchPromises)
      }

      // console.log("🔥 Trending Coins:", trending)
      // console.log("💎 Top Coins:", top)
      // console.log("🌎 Global Data:", global)

      // Set top coins immediately
      setTopCoins(top || [])
      setGlobalData(global || null)

      // If we have trending coins, check cache for prices or fetch them
      if (trending && trending.length > 0) {
        const trendingIds = trending.map((coin) => coin.id)

        // Check cache for price data
        let priceData = getFromCache(`prices_${trendingIds.join("_")}`)

        if (!priceData) {
          priceData = await fetchCoinPrices(trendingIds)
          saveToCache(`prices_${trendingIds.join("_")}`, priceData)
        }

        // Update trending coins with price data
        const updatedTrending = trending.map((coin) => {
          const coinData = priceData[coin.id]
          if (coinData) {
            return {
              ...coin,
              price: `$${coinData.usd.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}`,
              change: `${coinData.usd_24h_change > 0 ? "+" : ""}${coinData.usd_24h_change.toFixed(2)}%`,
              isPositive: coinData.usd_24h_change > 0,
            }
          }
          return coin
        })

        setTrendingCoins(updatedTrending)
      } else {
        setTrendingCoins(trending || [])
      }

      setError(null)
    } catch (err) {
      console.error("❌ Error in fetchData:", err)
      setError("Failed to load cryptocurrency data. Please try again later.")

      // Try to use cached data even if there was an error
      const cachedTrending = getFromCache("trendingCoins")
      const cachedTop = getFromCache("topCoins")
      const cachedGlobal = getFromCache("globalData")

      if (cachedTrending) setTrendingCoins(cachedTrending)
      if (cachedTop) setTopCoins(cachedTop)
      if (cachedGlobal) setGlobalData(cachedGlobal)
    } finally {
      setLoading(false)
    }
  }, [])

  // Initialize data on component mount and set up refresh interval
  useEffect(() => {
    // Fetch data on mount
    fetchData()

    // Set up auto-refresh every 60 seconds
    refreshIntervalRef.current = setInterval(fetchData, 60000)

    // Clean up interval on unmount
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
    }
  }, [fetchData])

  // Handle search with debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim()) {
        // Check cache for search results
        const cacheKey = `search_${searchQuery}`
        let results = getFromCache(cacheKey)

        if (!results) {
          results = await searchCoins(searchQuery)
          saveToCache(cacheKey, results)
        }

        setSearchResults(results)
        setShowSearchResults(true)
      } else {
        setSearchResults([])
        setShowSearchResults(false)
      }
    }, 300) // 500ms debounce

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  // Handle click outside search results
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <section className="hero-section">
      <div className="hero-background"></div>
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Discover the Future of <span className="gradient-text">Digital Finance</span>
          </h1>
          <p className="hero-subtitle">
            Track real-time cryptocurrency prices, manage your portfolio, and stay updated with the latest market
            trends.
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
              <button onClick={fetchData} className="retry-button">
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
                  <div className={`hero-stat-change ${coin.isPositive ? "positive" : "negative"}`}>{coin.change}</div>
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
            <button onClick={fetchData} className="retry-button">
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
                <div className={`trending-change ${coin.isPositive ? "positive" : "negative"}`}>{coin.change}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default HeroSection;