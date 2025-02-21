import React, { useContext, useEffect, useState } from 'react'
import './Coin.css'
import { useParams } from 'react-router-dom' // By using useParams we can find the coinID from url
import { CoinContext } from '../../Context/CoinContext'
import LineChart from '../../Components/LineChart/LineChart'

const Coin = () => {

  const {coinId} = useParams() // here coinId name is must be same as route path name which we give in app.jsx
  const [coinData, setCoinData] = useState()
  const [historicalData, setHistoricalData] = useState()
  const {currency} = useContext(CoinContext)

  const fetchCoinData = async () => {
    const options = {method: 'GET', headers: {accept: 'application/json'}};

    fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`, options)
      .then(res => res.json())
      .then(res => setCoinData(res))
      .catch(err => console.error(err));
  }

  const fetchHistoricalData = async () => {
    const options = {method: 'GET', headers: {accept: 'application/json'}};

   fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency.name}&days=10&interval=daily`, options) // here days=10 means chart shows past 10 days data and interval=daily means it will give one data for one day so total 10 responses generated
     .then(res => res.json())
     .then(res => setHistoricalData(res))
     .catch(err => console.error(err));
  }

  useEffect(() => {
    fetchCoinData();
    fetchHistoricalData();
  },[currency])

 if(coinData && historicalData) {  // if there is coindata available then only displaying coin details elase loading icon (spinner) will be shown to screen
   return (
    <div className='coin'>
      <div className="coin-name">
        <img src={coinData.image.large} alt="" />
        <p><b>{coinData.name} ({coinData.symbol.toUpperCase()})</b></p>
      </div>
      <div className="coin-chart">
        <LineChart historicalData={historicalData} />  {/* pass historicalData which we get through API to LineChart.jsx using props */}
      </div>

    <div className="coin-info">
      <ul>
        <li>Crypto Market Rank</li>
        <li>{coinData.market_cap_rank}</li>
      </ul>
      <ul>
        <li>Current Price</li>
        <li>{currency.symbol} {coinData.market_data.current_price
          [currency.name].toLocaleString()}</li>
      </ul>
      <ul>
        <li>Market Cap</li>
        <li>{currency.symbol} {coinData.market_data.market_cap
          [currency.name].toLocaleString()}</li>
      </ul>
      <ul>
        <li>24 Hour High</li>
        <li>{currency.symbol} {coinData.market_data.high_24h
          [currency.name].toLocaleString()}</li>
      </ul>
      <ul>
        <li>24 Hour Low</li>
        <li>{currency.symbol} {coinData.market_data.low_24h
          [currency.name].toLocaleString()}</li>
      </ul>
    </div>

    </div>
  )
 }else{
   return (
    <div className='spinner'>
      <div className="spin"></div>
    </div>
  )
 }
}

export default Coin