import React from 'react'
import HeroSection from '../components/HeroSection';
import MarketSection from '../components/MarketSection';
import TopCoins from '../components/TopCoins';
import NewsSection from '../components/NewsSection';
import PortfolioTracker from '../components/PortfolioTracker';

const Home = () => {
  return (
    <div>
      <HeroSection />
      <MarketSection />
      <TopCoins />
      <NewsSection />
      <PortfolioTracker />
    </div>
  )
}

export default Home;
