import React from 'react'
import Home from './pages/Home'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'

const App = () => {
  return (
    <>
    <Navbar/>
    <div>
      <Home />
      
    </div>
    <Footer />
    </>
  )
}

export default App
