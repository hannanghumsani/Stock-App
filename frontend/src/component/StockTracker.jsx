import React, {useState, useEffect} from 'react';
import axios from 'axios';
// import './StockTracker.css';

const StockTracker = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [predefinedStocks, setPredefinedStocks] = useState([]);
  const [currentPrice, setCurrentPrice] = useState('Loading...');

  useEffect(() => {
    fetchPredefinedStocks();
  }, []);

  useEffect(() => {
    if (selectedSymbol) {
      updatePrice();
      const interval = setInterval(updatePrice, 10000);
      return () => clearInterval(interval);
    }
  }, [selectedSymbol]);

  const fetchPredefinedStocks = async () => {
    try {
      const response = await axios.get('http://localhost:9000/api/stocks');
      setPredefinedStocks(response.data);
      setSelectedSymbol(response.data[0]); // Select the first stock by default
    } catch (error) {
      console.error('Error fetching predefined stocks:', error);
    }
  };

  const updatePrice = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9000/api/stock/${selectedSymbol}`,
      );
      const data = response.data;
      setCurrentPrice(data.price);
    } catch (error) {
      console.error('Error fetching price:', error);
    }
  };

  const handleSymbolChange = event => {
    setSelectedSymbol(event.target.value);
  };

  return (
    <div className="container">
      <h1>Stock Selector</h1>
      <select value={selectedSymbol} onChange={handleSymbolChange}>
        {predefinedStocks.map(symbol => (
          <option key={symbol} value={symbol}>
            {symbol}
          </option>
        ))}
      </select>
      <div id="priceDisplay">
        Current Price: <span id="currentPrice">${currentPrice}</span>
      </div>
    </div>
  );
};

export default StockTracker;
