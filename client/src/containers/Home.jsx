import React, { useState, useEffect } from 'react'
import SideBar from '../components/SideBar'
import HeroRouter from '../Routing/HeroRouter'
import Cart from '../components/customers/Cart'

import NavBar from '../components/NavBar'

import axios from 'axios'
import {useCookies} from 'react-cookie'

const Home = () => {

  const [showSideBar, setShowSidebar] = useState(false)
  const [restaurants, setrestaurants] = useState([])
  const [user, setUser] = useState({})
  const [userEmail, setUserEmail] = useState('')
  const [Cookies, setCookie, removeCookie] = useCookies()
  

  const findUser = async() => {
    try{
      const resp = await axios.post('http://localhost:5000/findUser', {email:userEmail})
      resp && setUser(resp.data)
      console.log(user)
    } catch(err){
      alert('user not found')
    }
  }

  const getRest = async() => {
    try{
      const resp = await axios.get('http://localhost:5000/findRestaurants')
      setrestaurants(resp.data)

    } catch(err){
      console.log(err)
    }
  }


  useEffect(() => {
    getRest()
    setUserEmail(Cookies.email) 
    userEmail && findUser()
  }
, [userEmail])

  return (
    <div className="flex min-w-screen bg-dblue w-full h-full overflow-hidden bg-green">


   <div className="hidden md:flex bg-dblue md:w-1/6 lg:w-1/12 bg-white"><SideBar/></div>

        {
          showSideBar && <div className="md:hidden bg-white"><SideBar/></div>
        }
        
        <div className='lg:w-8/12 md:w-10/12 w-12/12'>
          <div className='flex bg-dblue md:hidden'><NavBar showSideBar={showSideBar} setShowSidebar={setShowSidebar}/></div> 
          <div className="rounded-t-lg w-12/12">
            {
              user&&          <HeroRouter user={user} restaurants={restaurants} />
            }
          </div>
        </div>
        <div className='hidden lg:flex w-3/12 bg-yellow'>
        <Cart user={user} />
        </div>
    </div>
  )
}

export default Home