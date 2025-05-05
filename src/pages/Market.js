import React from 'react';
import './Market.css'; 
import MarketSection from "../components/MarketSection";
import TopCoins from "../components/TopCoins";

export default function Market() {
  return (
    <div className="containerss animate-fade">
      <h1>Cryptocurrency Market</h1>
      <MarketSection fullView={true} />
      <TopCoins fullView={true} />
    </div>
  );
}