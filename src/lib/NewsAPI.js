/**
 * Fetches cryptocurrency news from CoinGecko API
 * @returns {Promise<Array>} Array of news articles
 */
export const fetchCryptoNews = async () => {
  try {
    // CoinGecko doesn't have a direct news API in their free tier
    // So we'll use their /coins endpoint and transform the data to simulate news

    // First, fetch top coins data
    const coinsResponse = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=25&page=1",
    )

    if (!coinsResponse.ok) {
      throw new Error(`CoinGecko API error: ${coinsResponse.status}`)
    }

    const coinsData = await coinsResponse.json()

    // Now fetch detailed data for each coin to get descriptions
    // Fetch more coins (20) to ensure we have enough for both home and full view
    const newsArticles = await Promise.all(
      coinsData.slice(0, 20).map(async (coin) => {
        try {
          const detailResponse = await fetch(
            `https://api.coingecko.com/api/v3/coins/${coin.id}?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false`,
          )

          if (!detailResponse.ok) {
            throw new Error(`Failed to fetch details for ${coin.id}`)
          }

          const detailData = await detailResponse.json()

          // Generate a news article from the coin data
          return {
            id: `${coin.id}-${Date.now()}`,
            title: generateNewsTitle(coin, detailData),
            description: detailData.description?.en || "No description available.",
            url: `https://www.coingecko.com/en/coins/${coin.id}`,
            thumb_image: coin.image,
            published_at: new Date().toISOString(),
            author: "CoinGecko",
            tags: [coin.name, "Cryptocurrency", getCategoryTag(coin)],
          }
        } catch (error) {
          console.error(`Error fetching details for ${coin.id}:`, error)
          return null
        }
      }),
    )

    // Filter out any null results and return
    return newsArticles.filter((article) => article !== null)
  } catch (error) {
    console.error("Error fetching cryptocurrency news:", error)
    throw error
  }
}

/**
 * Generates a news title based on coin data
 * @param {Object} coin - Basic coin data
 * @param {Object} detailData - Detailed coin data
 * @returns {string} - Generated news title
 */
const generateNewsTitle = (coin, detailData) => {
  const titles = [
    `${coin.name} (${coin.symbol.toUpperCase()}) Shows ${coin.price_change_percentage_24h > 0 ? "Positive" : "Negative"} Movement in Recent Trading`,
    `Market Analysis: What's Next for ${coin.name} After Recent Price ${coin.price_change_percentage_24h > 0 ? "Surge" : "Drop"}`,
    `${coin.name} Trends: Experts Weigh In on Future Prospects`,
    `${coin.name} Update: Key Developments and Market Position`,
    `Understanding ${coin.name}: Technology and Market Potential`,
  ]

  // Return a random title from the options
  return titles[Math.floor(Math.random() * titles.length)]
}

/**
 * Generates a category tag based on coin data
 * @param {Object} coin - Coin data
 * @returns {string} - Category tag
 */
const getCategoryTag = (coin) => {
  const categories = ["Market Analysis", "Price Movement", "Technology", "Investment", "Trends"]
  return categories[Math.floor(Math.random() * categories.length)]
}

























































// /**
//  * Fetches cryptocurrency news from CoinGecko API
//  * @returns {Promise<Array>} Array of news articles
//  */
// export const fetchCryptoNews = async () => {
//     try {
//       // CoinGecko doesn't have a direct news API in their free tier
//       // So we'll use their /coins endpoint and transform the data to simulate news
  
//       // First, fetch top coins data
//       const coinsResponse = await fetch(
//         "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=25&page=1",
//       )
  
//       if (!coinsResponse.ok) {
//         throw new Error(`CoinGecko API error: ${coinsResponse.status}`)
//       }
  
//       const coinsData = await coinsResponse.json()
  
//       // Now fetch detailed data for each coin to get descriptions
//       const newsArticles = await Promise.all(
//         coinsData.slice(0, 15).map(async (coin) => {
//           try {
//             const detailResponse = await fetch(
//               `https://api.coingecko.com/api/v3/coins/${coin.id}?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false`,
//             )
  
//             if (!detailResponse.ok) {
//               throw new Error(`Failed to fetch details for ${coin.id}`)
//             }
  
//             const detailData = await detailResponse.json()
  
//             // Generate a news article from the coin data
//             return {
//               id: `${coin.id}-${Date.now()}`,
//               title: generateNewsTitle(coin, detailData),
//               description: detailData.description?.en || "No description available.",
//               url: `https://www.coingecko.com/en/coins/${coin.id}`,
//               thumb_image: coin.image,
//               published_at: new Date().toISOString(),
//               author: "CoinGecko",
//               tags: [coin.name, "Cryptocurrency", getCategoryTag(coin)],
//             }
//           } catch (error) {
//             console.error(`Error fetching details for ${coin.id}:`, error)
//             return null
//           }
//         }),
//       )
  
//       // Filter out any null results and return
//       return newsArticles.filter((article) => article !== null)
//     } catch (error) {
//       console.error("Error fetching cryptocurrency news:", error)
//       throw error
//     }
//   }
  
//   /**
//    * Generates a news title based on coin data
//    * @param {Object} coin - Basic coin data
//    * @param {Object} detailData - Detailed coin data
//    * @returns {string} - Generated news title
//    */
//   const generateNewsTitle = (coin, detailData) => {
//     const titles = [
//       `${coin.name} (${coin.symbol.toUpperCase()}) Shows ${coin.price_change_percentage_24h > 0 ? "Positive" : "Negative"} Movement in Recent Trading`,
//       `Market Analysis: What's Next for ${coin.name} After Recent Price ${coin.price_change_percentage_24h > 0 ? "Surge" : "Drop"}`,
//       `${coin.name} Trends: Experts Weigh In on Future Prospects`,
//       `${coin.name} Update: Key Developments and Market Position`,
//       `Understanding ${coin.name}: Technology and Market Potential`,
//     ]
  
//     // Return a random title from the options
//     return titles[Math.floor(Math.random() * titles.length)]
//   }
  
//   /**
//    * Generates a category tag based on coin data
//    * @param {Object} coin - Coin data
//    * @returns {string} - Category tag
//    */
//   const getCategoryTag = (coin) => {
//     const categories = ["Market Analysis", "Price Movement", "Technology", "Investment", "Trends"]
//     return categories[Math.floor(Math.random() * categories.length)]
//   }
  