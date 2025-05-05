
export const fetchTrendingCoins = async () => {
    try {
      const response = await fetch("https://api.coingecko.com/api/v3/search/trending")
  
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`)
      }
  
      const data = await response.json()
  
      // Transform the data to match our component's expected format
      return data.coins.map((item) => ({
        id: item.item.id,
        name: item.item.name,
        symbol: item.item.symbol.toUpperCase(),
        price: "Loading...", // We'll fetch prices separately
        change: "Loading...",
        isPositive: true,
        image: item.item.large,
        market_cap_rank: item.item.market_cap_rank,
      }))
    } catch (error) {
      console.error("Error fetching trending coins:", error)
      throw error
    }
  }
  
  /**
   * Fetches top cryptocurrencies by market cap from CoinGecko API
   * @param {number} limit - Number of coins to fetch
   * @returns {Promise<Array>} Array of top coins
   */
  export const fetchTopCoins = async (limit = 10) => {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=24h`,
      )
  
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`)
      }
  
      const data = await response.json()
  
      // Transform the data to match our component's expected format
      return data.map((coin) => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        price: formatPrice(coin.current_price),
        change: `${coin.price_change_percentage_24h > 0 ? "+" : ""}${coin.price_change_percentage_24h.toFixed(2)}%`,
        isPositive: coin.price_change_percentage_24h > 0,
        image: coin.image,
        market_cap_rank: coin.market_cap_rank,
      }))
    } catch (error) {
      console.error("Error fetching top coins:", error)
      throw error
    }
  }
  
  /**
   * Fetches price data for specific coins
   * @param {Array} coinIds - Array of coin IDs to fetch prices for
   * @returns {Promise<Object>} Object with coin prices and 24h changes
   */
  export const fetchCoinPrices = async (coinIds) => {
    try {
      if (!coinIds.length) return {}
  
      const idsParam = coinIds.join(",")
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${idsParam}&vs_currencies=usd&include_24hr_change=true`,
      )
  
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`)
      }
  
      return await response.json()
    } catch (error) {
      console.error("Error fetching coin prices:", error)
      throw error
    }
  }
  
  /**
   * Searches for cryptocurrencies by name or symbol
   * @param {string} query - Search query
   * @returns {Promise<Array>} Array of search results
   */
  export const searchCoins = async (query) => {
    try {
      if (!query || query.trim() === "") return []
  
      const response = await fetch(`https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(query)}`)
  
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`)
      }
  
      const data = await response.json()
  
      // Return only the coins from the search results
      return data.coins.slice(0, 10).map((coin) => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        image: coin.large,
        market_cap_rank: coin.market_cap_rank || "N/A",
      }))
    } catch (error) {
      console.error("Error searching coins:", error)
      return []
    }
  }
  
  /**
   * Format price with appropriate formatting based on value
   * @param {number} price - Price to format
   * @returns {string} - Formatted price string
   */
  export const formatPrice = (price) => {
    if (price === undefined || price === null) return "N/A"
  
    if (price >= 1000) {
      return `$${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
    } else if (price >= 1) {
      return `$${price.toFixed(2)}`
    } else if (price >= 0.01) {
      return `$${price.toFixed(4)}`
    } else if (price >= 0.0001) {
      return `$${price.toFixed(6)}`
    } else {
      return `$${price.toFixed(8)}`
    }
  }
  