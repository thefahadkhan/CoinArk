import { useState, useEffect } from "react"
import { ArrowUp, ArrowDown, Search, Eye, Loader } from "lucide-react"
import { fetchTopCoins, loadWatchlist, saveWatchlist } from "../lib/CoinAPI"
import "../styles/TopCoins.css"

const TopCoins = ({ fullView = false, limit = 100 }) => {
  const [coins, setCoins] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState("rank")
  const [sortDirection, setSortDirection] = useState("asc")
  const [watchlist, setWatchlist] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load coins data from API
  useEffect(() => {
    const loadCoins = async () => {
      try {
        setLoading(true)
        const data = await fetchTopCoins(limit)
        setCoins(data)
        setError(null)
      } catch (err) {
        setError("Failed to load cryptocurrency data. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadCoins()

    // Set up auto-refresh every 60 seconds
    const refreshInterval = setInterval(loadCoins, 60000)

    return () => clearInterval(refreshInterval)
  }, [limit])

  // Load watchlist from localStorage
  useEffect(() => {
    const savedWatchlist = loadWatchlist()
    setWatchlist(savedWatchlist)
  }, [])

  // Handle sorting
  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Filter and sort coins
  const filteredCoins = coins
    .filter(
      (coin) =>
        coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortDirection === "asc") {
        return a[sortField] > b[sortField] ? 1 : -1
      } else {
        return a[sortField] < b[sortField] ? 1 : -1
      }
    })

  // Toggle watchlist
  const toggleWatchlist = (id) => {
    let newWatchlist
    if (watchlist.includes(id)) {
      newWatchlist = watchlist.filter((coinId) => coinId !== id)
    } else {
      newWatchlist = [...watchlist, id]
    }

    setWatchlist(newWatchlist)
    saveWatchlist(newWatchlist)
  }

  // Format price based on value
  const formatPrice = (price) => {
    if (price < 0.01) return price.toFixed(8)
    if (price < 1) return price.toFixed(4)
    if (price < 10) return price.toFixed(2)
    return price.toLocaleString(undefined, { maximumFractionDigits: 2 })
  }

  // Format market cap
  const formatMarketCap = (marketCap) => {
    if (marketCap >= 1) return `$${marketCap.toFixed(2)}T`
    return `$${(marketCap * 1000).toFixed(2)}B`
  }

  return (
    <section className="top-coins">
      <div className="top-coins-container">
        <div className="top-coins-header">
          <h2 className="top-coins-title">
            Top <span>Cryptocurrencies</span>
          </h2>
          <p className="top-coins-description">Track prices and key stats for top coins by market cap</p>
        </div>

        <div className="search-wrapper">
          <div className="search-input-container">
            <input
              type="text"
              placeholder="Search coin name or symbol..."
              className="neon-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="search-icon" />
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <Loader className="loading-spinner" />
            <p>Loading cryptocurrency data...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button className="retry-button" onClick={() => fetchTopCoins(limit).then(setCoins)}>
              Retry
            </button>
          </div>
        ) : (
          <div className="table-container">
            <table className="coins-table">
              <thead className="table-head">
                <tr>
                  <th className="table-header" onClick={() => handleSort("rank")}>
                    <div className="header-content">
                      <span># Rank</span>
                      {sortField === "rank" && (
                        <span className="sort-icon">
                          {sortDirection === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="table-header" onClick={() => handleSort("name")}>
                    <div className="header-content">
                      <span>Name</span>
                      {sortField === "name" && (
                        <span className="sort-icon">
                          {sortDirection === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="table-header" onClick={() => handleSort("price")}>
                    <div className="header-content right">
                      <span>Price</span>
                      {sortField === "price" && (
                        <span className="sort-icon">
                          {sortDirection === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="table-header" onClick={() => handleSort("marketCap")}>
                    <div className="header-content right">
                      <span>Market Cap</span>
                      {sortField === "marketCap" && (
                        <span className="sort-icon">
                          {sortDirection === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="table-header" onClick={() => handleSort("volume")}>
                    <div className="header-content right">
                      <span>Volume (24h)</span>
                      {sortField === "volume" && (
                        <span className="sort-icon">
                          {sortDirection === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="table-header" onClick={() => handleSort("change24h")}>
                    <div className="header-content right">
                      <span>Change (24h)</span>
                      {sortField === "change24h" && (
                        <span className="sort-icon">
                          {sortDirection === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="table-header right">Watchlist</th>
                </tr>
              </thead>
              <tbody>
                {filteredCoins.length > 0 ? (
                  filteredCoins.map((coin) => (
                    <tr key={coin.id} className="table-row">
                      <td className="table-cell">{coin.rank}</td>
                      <td className="table-cell">
                        <div className="coin-info">
                          <div className="coin-icon">
                            {coin.image ? (
                              <img src={coin.image || "/placeholder.svg"} alt={coin.name} className="coin-image" />
                            ) : (
                              <span>{coin.symbol.charAt(0)}</span>
                            )}
                          </div>
                          <div className="coin-name-wrapper">
                            <span className="coin-name">{coin.name}</span>
                            <span className="coin-symbol">{coin.symbol}</span>
                          </div>
                        </div>
                      </td>
                      <td className="table-cell right price">${formatPrice(coin.price)}</td>
                      <td className="table-cell right market-cap">{formatMarketCap(coin.marketCap)}</td>
                      <td className="table-cell right volume">${coin.volume.toFixed(1)}B</td>
                      <td className={`table-cell right ${coin.change24h > 0 ? "change-positive" : "change-negative"}`}>
                        {coin.change24h > 0 ? "+" : ""}
                        {coin.change24h.toFixed(2)}%
                      </td>
                      <td className="table-cell right">
                        <button
                          onClick={() => toggleWatchlist(coin.id)}
                          className={`watchlist-button ${watchlist.includes(coin.id) ? "active" : ""}`}
                          aria-label={
                            watchlist.includes(coin.id)
                              ? `Remove ${coin.name} from watchlist`
                              : `Add ${coin.name} to watchlist`
                          }
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="no-results">
                      No cryptocurrencies found matching "{searchTerm}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}

export default TopCoins;