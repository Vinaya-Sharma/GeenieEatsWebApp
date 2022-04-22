import React, {useState, useEffect} from 'react'
import './styles.css'
import Home from './containers/Home'
import { BrowserRouter, Route, Routes, useNavigate, Navigate } from 'react-router-dom'
import Login from './components/auth/Login'
import RestLogin from './components/auth/RestLogin'
import RestHome from './containers/RestHome'
import { useCookies } from 'react-cookie'

const App = () => {
  const [isRest, setIsRest] = useState(false)
  const [isUser, setIsUser] = useState(false)

  const [cookies, setCookie, removeCookie] = useCookies(['user'])

  return (
    <div>
      <BrowserRouter>
      <Routes>
       <Route path="/*" element={isUser? <Home/>: <Navigate to='/login'/>}/>
        <Route path='/login' element={ <Login setIsUser={setIsUser}/>}/>
        <Route path='/restaurants/*' element={isRest? <RestHome/>: <Navigate to='/restaurants/login'/>}/>
        <Route path='/restaurants/login' element={<RestLogin setIsRest={setIsRest}/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App