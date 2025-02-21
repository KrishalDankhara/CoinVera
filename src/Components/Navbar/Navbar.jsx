import React, { useContext } from 'react'
import './Navbar.css'
import logo from '../../assets/cryptocurrency.png'
import { CoinContext } from '../../Context/CoinContext'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import menu from '../../assets/menu.png'

const Navbar = () => {

  const {setCurrency} = useContext(CoinContext)
  const [showMenu, setShowMenu] = useState(false);

  const currencyHandler = (event) => {
    switch (event.target.value) {
        case "usd" : {
            setCurrency({name: "usd", symbol: "$"});
            break;
        }
        case "eur" : {
            setCurrency({name: "eur", symbol: "€"});
            break;
        }
        case "inr" : {
            setCurrency({name: "inr", symbol: "₹"});
            break;
        }
        default : {
            setCurrency({name: "usd", symbol: "$"});
            break;
        }
        
    }

  }

  return (
    <div className='navbar'>
        <Link to={'/'} className="logo-container">
                <img src={logo} alt="Logo" className='logo' />
                <h4 className='logoTitle'>CoinVera</h4>
        </Link>
        <ul>
        <Link to={'/'} >
            <li>Home</li>
        </Link>
        <Link to={'/features'} >
            <li>Features</li>
        </Link>
        <Link to={'/blog'} >
            <li>Blog</li>
        </Link>
        </ul>
        <div className="nav-right">
            <select onChange={currencyHandler}>
                <option value="usd">USD</option>
                <option value="eur">EUR</option>
                <option value="inr">INR</option>
            </select>
        </div>
        <img src={menu} alt="Menu" className='mobMenu' onClick={() =>setShowMenu(!showMenu)}/>
                <div className="navMenu" style={{display: showMenu? 'flex':'none'}}>
                    <Link activeClass='active' to={'/'} spy={true} smooth={true} offset={-100} duration={500} className='listItem' onClick={() =>setShowMenu(false)}>Home</Link>
                    <Link activeClass='active' to={'/features'} spy={true} smooth={true} offset={-70} duration={500} className='listItem' onClick={() =>setShowMenu(false)}>Features</Link>
                    <Link activeClass='active' to={'/blog'} spy={true} smooth={true} offset={-100} duration={500} className='listItem' onClick={() =>setShowMenu(false)}>Blog</Link>
                </div> 
    </div>
  )
}

export default Navbar