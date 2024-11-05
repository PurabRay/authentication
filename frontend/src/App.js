import React from 'react'
import Login from './Login'
import Signup from './Signup'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './Home'
import Admin from './Admin'
import PasswordReset from './PasswordReset'
const App = () => {
  return (
      <BrowserRouter>
      <Routes>
      <Route path='/' element={<Login/>}></Route>
      <Route path='/signup' element={<Signup/>}></Route>
      <Route path="/password-reset" element={<PasswordReset/>}></Route>
      <Route path='/home' element={<Home/>}></Route>
      <Route path='/admin/users' element={<Admin/>}></Route>
      </Routes>
     </BrowserRouter>
  )
}

export default App

