import { useState, useEffect } from "react"
import { ArrowRight, ChevronLeft, ChevronRight, Loader, RefreshCw } from "lucide-react"
import { fetchCryptoNews } from "../lib/NewsAPI"
import "../styles/NewsSection.css"

// Cache duration in milliseconds (1 hour)
const CACHE_DURATION = 60 * 60 * 1000

const NewsSection = ({ fullView = false }) => {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const articlesPerPage = fullView ? 15 : 6

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true)

        // Check if we have cached news data
        const cacheKey = "cryptoNews"
        const cachedData = localStorage.getItem(cacheKey)

        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData)
          const now = Date.now()

          // Use cached data if it's less than 1 hour old
          if (now - timestamp < CACHE_DURATION) {
            console.log("Using cached news data")
            setArticles(data)
            setError(null)
            setLoading(false)
            return
          }
        }

        // Fetch fresh data if no cache or cache is expired
        console.log("Fetching fresh news data")
        const newsData = await fetchCryptoNews()
        setArticles(newsData)
        setError(null)

        // Cache the new data with current timestamp
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            data: newsData,
            timestamp: Date.now(),
          }),
        )
      } catch (err) {
        setError("Failed to load news. Please try again later.")
        console.error("Error fetching news:", err)
      } finally {
        setLoading(false)
      }
    }

    loadNews()
  }, [])

  // Force refresh news data
  const handleRefresh = async () => {
    try {
      setLoading(true)
      const newsData = await fetchCryptoNews()
      setArticles(newsData)
      setError(null)

      // Update cache with fresh data
      localStorage.setItem(
        "cryptoNews",
        JSON.stringify({
          data: newsData,
          timestamp: Date.now(),
        }),
      )
    } catch (err) {
      setError("Failed to refresh news. Please try again later.")
      console.error("Error refreshing news:", err)
    } finally {
      setLoading(false)
    }
  }

  const totalPages = Math.ceil(articles.length / articlesPerPage)
  const indexOfLastArticle = currentPage * articlesPerPage
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage
  const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle)

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber)
    if (fullView) {
      document.querySelector(".news-section")?.scrollIntoView({ behavior: "smooth" })
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1)
    }
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const getMainTag = (tags) => {
    return tags && tags.length > 0 ? tags[0] : "Crypto"
  }

  const createExcerpt = (description, maxLength = 120) => {
    if (!description) return "No description available."
    if (description.length <= maxLength) return description
    return `${description.substring(0, maxLength).trim()}...`
  }

  const renderPaginationItems = () => {
    const items = []
    const maxVisiblePages = 5
    let startPage = 1
    let endPage = totalPages

    if (totalPages > maxVisiblePages) {
      const halfVisible = Math.floor(maxVisiblePages / 2)
      if (currentPage <= halfVisible) {
        endPage = maxVisiblePages
      } else if (currentPage >= totalPages - halfVisible) {
        startPage = totalPages - maxVisiblePages + 1
      } else {
        startPage = currentPage - halfVisible
        endPage = currentPage + halfVisible
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <button
          key={i}
          className={`news-pagination-item ${currentPage === i ? "active" : ""}`}
          onClick={() => goToPage(i)}
          aria-label={`Page ${i}`}
        >
          {i}
        </button>,
      )
    }

    return items
  }

  return (
    <section className="news-section">
      <div className="container">
        {!fullView && (
          <div className="news-header">
            <div>
              <h2 className="news-title">
                Latest <span>News</span>
              </h2>
              <p className="news-subtitle">Stay updated with the latest developments in the crypto world</p>
            </div>
            <div className="news-header-actions">
              <a href="/news" className="news-view-all">
                View All News
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        )}

        {loading ? (
          <div className="news-loading">
            <Loader className="news-loading-spinner" />
            <p>Loading latest crypto news...</p>
          </div>
        ) : error ? (
          <div className="news-error">
            <p>{error}</p>
            <button onClick={handleRefresh} className="news-retry-button">
              Try Again
            </button>
          </div>
        ) : articles.length === 0 ? (
          <div className="news-empty">
            <p>No news articles available at the moment.</p>
          </div>
        ) : (
          <>
            <div className="news-grid">
              {currentArticles.map((article) => (
                <a key={article.id} href={article.url} target="_blank" rel="noopener noreferrer" className="news-card">
                  <div className="news-card-image-container">
                    <img
                      src={article.thumb_image || `/placeholder.svg?height=180&width=300`}
                      alt={article.title}
                      className="news-card-image"
                      onError={(e) => {
                        e.target.src = `/placeholder.svg?height=180&width=300`
                      }}
                    />
                  </div>
                  <div className="news-card-content">
                    <div className="news-card-tag">{getMainTag(article.tags)}</div>
                    <h3 className="news-card-title">{article.title}</h3>
                    <p className="news-card-excerpt">{createExcerpt(article.description)}</p>
                    <div className="news-card-footer">
                      <div className="news-card-date">{formatDate(article.published_at)}</div>
                      <div className="news-card-source">{article.author}</div>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {fullView && totalPages > 1 && (
              <div className="news-pagination">
                <button
                  className={`news-pagination-item ${currentPage === 1 ? "disabled" : ""}`}
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={16} />
                </button>
                {renderPaginationItems()}
                <button
                  className={`news-pagination-item ${currentPage === totalPages ? "disabled" : ""}`}
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}

export default NewsSection;