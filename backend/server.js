const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 9000;

app.use(express.json());
app.use(cors());
mongoose.connect('mongodb://localhost/stocktracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const stockSchema = new mongoose.Schema({
  symbol: String,
  price: Number,
});

const Stock = mongoose.model('Stock', stockSchema);

const predefinedStocks = ['AAPL', 'GOOGL', 'AMZN', 'MSFT'];

const fetchNewPrices = async () => {
  for (const symbol of predefinedStocks) {
    const newPrice = (Math.random() * 1000).toFixed(2);

    await Stock.findOneAndUpdate({symbol}, {price: newPrice});
  }
};

const startPriceUpdates = async () => {
  const existingStocks = await Stock.find({});

  if (existingStocks.length === 0) {
    for (const symbol of predefinedStocks) {
      const initialPrice = (Math.random() * 1000).toFixed(2);
      const stock = new Stock({
        symbol,
        price: initialPrice,
      });
      await stock.save();
    }
  }
  setInterval(fetchNewPrices, 10000);
};

startPriceUpdates();

app.get('/api/stock/:symbol', async (req, res) => {
  console.log('hello');
  const symbol = req.params.symbol;
  const stock = await Stock.findOne({symbol});
  if (stock) {
    res.json({symbol, price: stock.price});
  } else {
    res.status(404).json({error: 'Stock not found'});
  }
});

app.get('/api/stocks', async (req, res) => {
  console.log('hello');
  const stocks = await Stock.find({}, 'symbol');
  res.json(stocks.map(stock => stock.symbol));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
