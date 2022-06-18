import React, {useState, useEffect} from 'react'
import './styles.css'
import Home from './containers/Home'
import { BrowserRouter, Route, Routes, useNavigate, Navigate } from 'react-router-dom'
import Login from './components/auth/Login'
import RestLogin from './components/auth/RestLogin'
import RestHome from './containers/RestHome'
import { StateContext, useStateContext } from './context/stateContext'

const App = () => {

  return (
    <div>
      <BrowserRouter>
      <StateContext>
      <Routes>
       <Route path="/*" element={<Home/>}/>
        <Route path='/login' element={ <Login/>}/>
        <Route path='/restaurants/*' element={ <RestHome/>}/>
        <Route path='/restaurants/login' element={<RestLogin/>}/>
      </Routes>
      </StateContext>
      </BrowserRouter>
    </div>
  )
}

export default App