/**
 * Fetches top cryptocurrencies data from CoinGecko API
 * @param {number} limit - Number of coins to fetch
 * @returns {Promise<Array>} - Array of cryptocurrency data
 */
export const fetchTopCoins = async (limit = 100) => {
  try {
    // CoinGecko API has a max per_page of 250, so we're safe with 100
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=24h`,
    )

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`)
    }

    const data = await response.json()

    // Transform the data to match our component's expected format
    return data.map((coin, index) => ({
      id: coin.id,
      rank: index + 1,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      price: coin.current_price,
      marketCap: coin.market_cap / 1000000000000, // Convert to trillions
      volume: coin.total_volume / 1000000000, // Convert to billions
      change24h: coin.price_change_percentage_24h,
      image: coin.image,
    }))
  } catch (error) {
    console.error("Error fetching cryptocurrency data:", error)
    throw error
  }
}

/**
 * Loads watchlist from localStorage
 * @returns {Array} - Array of coin IDs in the watchlist
 */
export const loadWatchlist = () => {
  try {
    const savedWatchlist = localStorage.getItem("crypto-watchlist")
    return savedWatchlist ? JSON.parse(savedWatchlist) : []
  } catch (error) {
    console.error("Error loading watchlist from localStorage:", error)
    return []
  }
}

/**
 * Saves watchlist to localStorage
 * @param {Array} watchlist - Array of coin IDs to save
 */
export const saveWatchlist = (watchlist) => {
  try {
    localStorage.setItem("crypto-watchlist", JSON.stringify(watchlist))
  } catch (error) {
    console.error("Error saving watchlist to localStorage:", error)
  }
}
