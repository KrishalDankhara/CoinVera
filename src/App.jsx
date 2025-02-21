import React from 'react'
import Navbar from './Components/Navbar/Navbar'
import { Routes, Route } from 'react-router-dom'
import Home from './Pages/Home/Home'
import Coin from './Pages/Coin/Coin'
import Footer from './Components/Footer/Footer'
import Features from './Pages/Features/Features'
import Blog from "./Pages/Blog/Blog";

const App = () => {
  return (
    <div className='app'>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/coin/:coinId' element={<Coin/>} />
        <Route path="/features" element={<Features/>} />
        <Route path="/blog" element={<Blog/>} />
      </Routes>
      <Footer/> {/* here we put navbar and footer component outside the route because we want to display both of these component on every single page of website where pages like home page and coin page are display only when user wants to visit those pages. */}
    </div>
  )
}

export default App