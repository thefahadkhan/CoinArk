// Map timeframes to CoinGecko API parameters
const timeframeMap = {
  "24h": 1,
  "7d": 7,
  "30d": 30,
  "90d": 90,
  "1y": 365,
  All: "max",
}

/**
 * Fetches Bitcoin price and historical data
 * @param {string} selectedTimeframe - The selected timeframe (24h, 7d, etc.)
 * @returns {Promise<Object>} - Bitcoin price data and chart data
 */
export const fetchBitcoinData = async (selectedTimeframe) => {
  try {
    // Get current price and 24h change
    const priceResponse = await fetch(
      "https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false",
    )
    const priceData = await priceResponse.json()

    // Get historical chart data based on selected timeframe
    const days = timeframeMap[selectedTimeframe]
    const chartResponse = await fetch(
      `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${days}`,
    )
    const chartData = await chartResponse.json()

    // Process chart data to match expected format
    const processedChartData = chartData.prices.map(([timestamp, price]) => {
      const date = new Date(timestamp)
      let name

      if (selectedTimeframe === "24h") {
        name = date.getHours() + "h"
      } else if (selectedTimeframe === "7d") {
        name = date.toLocaleDateString("en-US", { weekday: "short" })
      } else {
        name = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      }

      return {
        name,
        value: price,
        timestamp,
      }
    })

    // Sample the data to avoid overcrowding the chart
    const sampledData = sampleData(processedChartData, 24)

    return {
      price: priceData.market_data.current_price.usd,
      priceChange24h: priceData.market_data.price_change_percentage_24h,
      chartData: sampledData,
    }
  } catch (error) {
    console.error("Error fetching Bitcoin data:", error)
    throw error
  }
}

/**
 * Fetches global market data
 * @param {number} bitcoinPriceChange - Bitcoin's 24h price change percentage
 * @returns {Promise<Object>} - Market statistics data
 */
export const fetchMarketData = async (bitcoinPriceChange) => {
  try {
    // Get global market data
    const globalResponse = await fetch("https://api.coingecko.com/api/v3/global")
    const globalData = await globalResponse.json()

    // Get historical market cap data
    const days = timeframeMap["24h"] // Always use 24h for the mini charts
    const marketChartResponse = await fetch(
      `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${days}`,
    )
    const marketChartData = await marketChartResponse.json()

    // Process market cap chart data
    const marketCapChartData = marketChartData.market_caps.map(([timestamp, value]) => ({
      name: new Date(timestamp).getHours() + "h",
      value,
    }))

    // Process volume chart data
    const volumeChartData = marketChartData.total_volumes.map(([timestamp, value]) => ({
      name: new Date(timestamp).getHours() + "h",
      value,
    }))

    // Sample the data to avoid overcrowding the mini charts
    const sampledMarketCapData = sampleData(marketCapChartData, 12)
    const sampledVolumeData = sampleData(volumeChartData, 12)

    // Calculate market sentiment based on price change
    const sentiment = bitcoinPriceChange > 3 ? "Bullish" : bitcoinPriceChange < -3 ? "Bearish" : "Neutral"

    return {
      marketCap: {
        value: globalData.data.total_market_cap.usd,
        change: globalData.data.market_cap_change_percentage_24h_usd,
        chartData: sampledMarketCapData,
      },
      volume: {
        value: globalData.data.total_volume.usd,
        change: globalData.data.market_cap_change_percentage_24h_usd, // Using market cap change as proxy
        chartData: sampledVolumeData,
      },
      btcDominance: {
        value: globalData.data.market_cap_percentage.btc,
        change: 0, // CoinGecko doesn't provide this change directly
      },
      sentiment,
    }
  } catch (error) {
    console.error("Error fetching market data:", error)
    throw error
  }
}

/**
 * Sample data to reduce points for cleaner charts
 * @param {Array} data - The data array to sample
 * @param {number} sampleSize - The desired sample size
 * @returns {Array} - Sampled data array
 */
export const sampleData = (data, sampleSize) => {
  if (!data || data.length <= sampleSize) return data

  const result = []
  const step = Math.floor(data.length / sampleSize)

  for (let i = 0; i < sampleSize; i++) {
    const index = Math.min(i * step, data.length - 1)
    result.push(data[index])
  }

  return result
}

/**
 * Format large numbers with appropriate suffixes
 * @param {number} num - The number to format
 * @returns {string} - Formatted number string
 */
export const formatNumber = (num) => {
  if (num >= 1000000000000) {
    return `$${(num / 1000000000000).toFixed(2)}T`
  } else if (num >= 1000000000) {
    return `$${(num / 1000000000).toFixed(2)}B`
  } else if (num >= 1000000) {
    return `$${(num / 1000000).toFixed(2)}M`
  } else {
    return `$${num.toFixed(2)}`
  }
}

/**
 * Format price with commas
 * @param {number} price - The price to format
 * @returns {string} - Formatted price string
 */
export const formatPrice = (price) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price)
}
