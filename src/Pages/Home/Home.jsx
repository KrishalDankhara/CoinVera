import React, { useContext, useEffect, useState } from 'react'
import './Home.css'
import { CoinContext } from '../../Context/CoinContext'
import { Link } from 'react-router-dom' // This Link is used when user click on this link then go to another page

const Home = () => {

const { allCoin, currency } = useContext(CoinContext)
const [ displayCoin, setDisplayCoin ] = useState([])
const [input, setInput] = useState('')

const inputHandler = (event) => {
    setInput(event.target.value);
    if(event.target.value === "") {
        setDisplayCoin(allCoin);     
    }  // this if condition is used for when search box is empty then again top10 coin will displayed
}

const searchHandler = async(event) => {
    event.preventDefault();
    const coins = await allCoin.filter((item) => {
        return item.name.toLowerCase().includes(input.toLowerCase())
        // this line is for making searching effective 
        // for example: we want to search bitcoin but if i only type bit then also it search for bitcoin because bitcoin includes bit.
    })
    setDisplayCoin(coins)
}

useEffect(() => {
    setDisplayCoin(allCoin);
}, [allCoin]);


  return (
    <div className='home'>
        <div className="hero">
            <h1>Ultimate <br /> Crypto Dashboard</h1>
            <p>Welcome to the world's largest CryptoCurrency market place. <br />Track Every Coin, Anytime, Anywhere</p>
            <form onSubmit={searchHandler}>

                <input onChange={inputHandler} list='coinlist' value={input} type="text" placeholder='Search Crypto..' required />
                
                <datalist id='coinlist'>
                    {allCoin.map((item,index) => (<option key={index} value={item.name}/>))}
                </datalist>
                
                
                <button type='submit'>Search</button>
            </form>
        </div>
        <div className="crypto-table">
            <div className="table-layout">
                <p>#</p>
                <p>Coins</p>
                <p>Price</p>
                <p style={{textAlign:"center"}}>24H Change</p>
                <p className='market-cap'>Market Cap</p>
            </div>
            {
                displayCoin.slice(0,10).map((item, index) => (  // we use here slice because we have many coin data to display but we should only display 10 data to screen
                    <Link to={`/coin/${item.id}`} className="table-layout" key={index}> {/* when user click on any row of table he/she will redirect to coin page  */}
                        <p>{item.market_cap_rank}</p> {/* this market_cap_rank is variable name available in coingecko api which we used in this site */}
                        <div>
                            <img src={item.image} alt="" />
                            <p>{item.name + " - " + item.symbol}</p>
                        </div>
                        <p>{currency.symbol} {item.current_price.toLocaleString()}</p> {/* toLocaleString() is used for put comma(,) in big value like 10000 is written as 10,000 */}
                        <p className={item.price_change_percentage_24h>0?"green":"red"}>
                            {Math.floor(item.price_change_percentage_24h*100)/100}
                        </p>
                        <p className='market-cap'>{currency.symbol} {item.market_cap.toLocaleString()}</p> 
                    </Link>
                ))
            }
        </div>
    </div>
  )
}

export default Home