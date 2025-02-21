import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import Select from "react-select";
import "./Features.css";

const Features = () => {
  const [selectedCoins, setSelectedCoins] = useState([]);
  const [selectedVolatilityCoin, setSelectedVolatilityCoin] = useState(null); // New state for the volatility chart
  const [coinOptions, setCoinOptions] = useState([]);
  const [coinData, setCoinData] = useState([]);
  const [volatilityData, setVolatilityData] = useState([]);

  useEffect(() => {
    // Fetch only the coins that are available on CoinGecko's market data API
    const fetchCoins = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: {
              vs_currency: "usd",
              order: "market_cap_desc",
              per_page: 100, // Fetch all relevant coins
              page: 1,
              sparkline: false,
            },
          }
        );

        // Format the data for react-select dropdown
        const options = response.data.map((coin) => ({
          value: coin.id,
          label: coin.name,
          market_cap: coin.market_cap,
          price_change_percentage_24h: coin.price_change_percentage_24h,
          symbol: coin.symbol,
        }));
        setCoinOptions(options);
        
      } catch (error) {
        console.error("Error fetching coins:", error);
      }
    };

    fetchCoins();
  }, []);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        if (selectedCoins.length !== 2) return; // Prevents unnecessary API calls if the user hasn't selected exactly two coins

        const [coin1, coin2] = selectedCoins.map((coin) => coin.value); // Extract coin IDs

        // Fetch historical data for both selected coins
        const responses = await Promise.all([
          axios.get(
            `https://api.coingecko.com/api/v3/coins/${coin1}/market_chart?vs_currency=usd&days=7`
          ),
          axios.get(
            `https://api.coingecko.com/api/v3/coins/${coin2}/market_chart?vs_currency=usd&days=7`
          ),
        ]);

        // Format the data for comparison
        const formattedData = responses[0].data.prices.map((_, index) => ({
          date: new Date(responses[0].data.prices[index][0]).toLocaleDateString(),
          [selectedCoins[0].label]: responses[0].data.prices[index][1],
          [selectedCoins[1].label]: responses[1].data.prices[index][1],
        }));

        setCoinData(formattedData);
      } catch (error) {
        console.error("Error fetching market data:", error);
      }
    };

    fetchChartData();
  }, [selectedCoins]);

  // Fetch and calculate volatility for the selected coin
  useEffect(() => {
    const fetchVolatilityData = async () => {
      if (!selectedVolatilityCoin) return;
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${selectedVolatilityCoin.value}/market_chart?vs_currency=usd&days=7`
        );
  
        const prices = response.data.prices;
  
        // Calculate daily percentage change
        const formattedVolatilityData = prices
          .map((_, index) => {
            if (index === 0) return null; // Skip the first day
            const previousPrice = prices[index - 1][1];
            const currentPrice = prices[index][1];
            const date = new Date(prices[index][0]).toISOString().split('T')[0]; // Format date as YYYY-MM-DD
            const percentageChange = ((currentPrice - previousPrice) / previousPrice) * 100;
  
            return { date, volatility: percentageChange.toFixed(2) };
          })
          .filter((data) => data); // Remove null values
  
        setVolatilityData(formattedVolatilityData);
      } catch (error) {
        console.error("Error fetching volatility data:", error);
      }
    };
  
    fetchVolatilityData();
  }, [selectedVolatilityCoin]);

  return (
    <div className="features-container">
      <motion.h1
        className="features-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Crypto Analytics Dashboard
      </motion.h1>

      <motion.div
        className="search-box-container"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 className="chart-title">Compare Two Cryptocurrencies</h2>
        <Select
          options={coinOptions}
          isMulti
          value={selectedCoins}
          onChange={(selected) => setSelectedCoins(selected.slice(0, 2))}
          className="coin-selector"
          placeholder="Select exactly 2 coins..."
          isClearable
          classNamePrefix="custom-search"
          styles={{
            control: (base) => ({
              ...base,
              backgroundColor: "#1c1f26", // Dark background for the search box
              color: "#ffffff", // Text color
              border: "1px solid #ff9a44", // Border color
            }),
            singleValue: (base) => ({
              ...base,
              color: "#ffcc00", // Selected text color
            }),
            input: (base) => ({
              ...base,
              color: "#00ffff", // Typing text color in the search box
            }),
            placeholder: (base) => ({
              ...base,
              color: "#888888", // Placeholder text color
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: "#1c1f26", // Dropdown background
            }),
            option: (base, { isFocused }) => ({
              ...base,
              backgroundColor: isFocused ? "#ff9a44" : "#1c1f26", // Highlight on hover
              color: isFocused ? "#000" : "#ffffff", // Hovered text color
            }),
          }}
        />
      </motion.div>

      {/* Area Chart for Comparison */}
      {selectedCoins.length === 2 ? (
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={coinData}>
            <defs>
              <linearGradient id="colorCoin1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(210, 100%, 50%)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(210, 100%, 50%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorCoin2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(120, 100%, 50%)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(120, 100%, 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey={selectedCoins[0].label}
              stroke="hsl(210, 100%, 50%)"
              fillOpacity={1}
              fill="url(#colorCoin1)"
            />
            <Area
              type="monotone"
              dataKey={selectedCoins[1].label}
              stroke="hsl(120, 100%, 50%)"
              fillOpacity={1}
              fill="url(#colorCoin2)"
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <p className="select-message">Please select exactly 2 coins to compare.</p>
      )}

      {/* Coin Selector for Volatility */}
      <motion.div
        className="search-box-container"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
      >
        <h2 className="chart-title">View Volatility of a Cryptocurrency</h2>
        <Select
          options={coinOptions}
          value={selectedVolatilityCoin}
          onChange={(selected) => setSelectedVolatilityCoin(selected)}
          className="coin-selector"
          placeholder="Select a coin to view its volatility..."
          isClearable
          classNamePrefix="custom-search"
          styles={{
            control: (base) => ({
              ...base,
              backgroundColor: "#1c1f26", // Dark background for the search box
              color: "#ffffff", // Text color
              border: "1px solid #ff9a44", // Border color
            }),
            singleValue: (base) => ({
              ...base,
              color: "violet", // Selected text color
            }),
            input: (base) => ({
              ...base,
              color: "#00ffff", // Typing text color in the search box
            }),
            placeholder: (base) => ({
              ...base,
              color: "#888888", // Placeholder text color
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: "#1c1f26", // Dropdown background
            }),
            option: (base, { isFocused }) => ({
              ...base,
              backgroundColor: isFocused ? "#ff9a44" : "#1c1f26", // Highlight on hover
              color: isFocused ? "#000" : "#ffffff", // Hovered text color
            }),
          }}
        />
      </motion.div>

      {/* Line Chart for Volatility */}
      {selectedVolatilityCoin ? (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={volatilityData} margin={{ top: 10, right: 10, left: 10, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              angle={-45}
              textAnchor="end"
              interval={4}
              tickFormatter={(date) =>
                new Date(date).toLocaleDateString()
              }
            />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="volatility"
              stroke="#dda0dd"
              strokeWidth={1.2}
              activeDot={{ fill: "#00ffff", r: 6, className: "sparkle-dot" }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p className="select-message">Please select a coin to view its volatility.</p>
      )}
    </div>
  );
};

export default Features;
