import React from 'react'
import { Route, Routes } from 'react-router-dom'
import './styles/Home.css'
const Home = () => {
  return (
    <Routes>
      <Route path="/home" element={
        <div>
          Home
        </div>
         
      } />
    </Routes>
   
  )
}

export default Home