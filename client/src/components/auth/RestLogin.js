import React, {useState} from 'react'
import background from '../../assets/background.png'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import { useCookies } from 'react-cookie';

const RestLogin = ({setIsRest}) => {
  const navigate = useNavigate()

  const [login, setLogin] = useState(true)
  const [name, setName] = useState('')
  const [theEmail, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [website, setWebsite] = useState('')
  const [location, setLocation] = useState('')
  const [logo, setLogo] = useState('')
  const [img, setImg] = useState('')
  const [cookies, setCookie, removeCookie] = useCookies([])

  const switchLS = () => {
    setLogin(!login)
  }

  const submitForm = async(e) => {
    e.preventDefault()
    const email = theEmail.toLowerCase()

    if (login && theEmail && password){
      try{
        const resp = await axios.post('http://localhost:5000/restaurant/login', {
          email,password
        })

        setCookie('email', resp.data.email)
        setIsRest(resp.data.email)

        if (resp.status === 201){
          navigate('/restaurants')
        } else {
          alert('invalid credentials')
        }
      }catch(err){
        alert('invalid credentials')
      }

    } else if (!login && theEmail && password && name ){
    try{
      const resp = await axios.post('http://localhost:5000/restaurant/signup', {
        name, email, password, website,location,img,logo
      })
      setCookie('email', resp.data.email)
      setIsRest(resp.data.email)

      if (resp.status === 200){
        navigate('/restaurants')
      } else (
        console.log('email taken')
      )
    }catch(err){
      console.log(err)
     alert('email taken...try another')
    }
  }}


  const tealStyle = "text-4xl font-bold text-teal underline font-playfair hover:underline cursor-pointer";
  const whiteStyle = "text-4xl font-bold text-white font-playfair cursor-pointer hover:underline ";

  return (
    <div className='w-screen min-h-screen bg-lblue h-full flex relative' >

      <div className="hidden md:flex flex-end cover object-cover h-full max-w-320 contain absolute right-0">
      <img src={ img!=''? img : background} className='object-cover' alt='background'/>
      </div>


      {/** LOGIN AND SIGN UP STUFF */}
      <div className="flex flex-col w-full md:w-8/12 justify-center center align-center place-content-center">

            {/** DECIDING LOGIN OR SIGN UP STARTS */}
      <div className="flex flex-row space-x-4 place-self-center mb-5">
        <div onClick={() => switchLS()} className={login? tealStyle:whiteStyle}>Login</div>
        <div onClick={() => switchLS()} className={!login? tealStyle:whiteStyle}>Sign Up</div>
      </div>
      <p className="text-sm text-stone-300 place-self-center">
      {login?'save food, save money, and help the community':'Register as a business and experience the magic of GeenieEats'}
      </p>
            {/** DECIDING LOGIN AND SIGN UP STUFF ENDS */}
            {/** FORM STARTS */}
      <div className='flex flex-row align-center center place-content-center justify-center w-full'>

        <form className='place-self-center' onSubmit={(e) => submitForm(e)}>
          <div className="flex flex-col h-full place-content-center space-y-2 mt-5">

          {!login && <div className="flex flex-col space-y-2 ">
          <label className='text-sm text-stone-300' htmlFor="name">business name</label>
          <input type="text" name='name' onChange={(e) => setName(e.target.value) } value={name} className=' min-w-250 bg-white p-2 rounded-full' />
          </div> }
          <label className='text-sm text-stone-300' htmlFor="email">email</label>
          <input type="email"  name='email' value={theEmail}  onChange={(e) => setEmail(e.target.value) }  className=' min-w-250 bg-white p-2 rounded-full' />
        {
            !login && (<div className='flex flex-col space-y-2'>
                 <label className='text-sm text-stone-300 mt-2 ' htmlFor="website">website</label>
                <input type="url"  name='website' value={website}  onChange={(e) => setWebsite(e.target.value) }  className=' min-w-250 bg-white p-2 rounded-full' />
        
                <label className='text-sm text-stone-300 mt-2 ' htmlFor="location">location address</label>
                <input type="text"  name='location' value={location}  onChange={(e) => setLocation(e.target.value) }  className=' min-w-250 bg-white p-2 rounded-full' />

                <label className='text-sm text-stone-300 mt-2 ' htmlFor="website">restaurant image</label>
                <input type="url"  name='website' value={img}  onChange={(e) => setImg(e.target.value) }  className=' min-w-250 bg-white p-2 rounded-full' />

                <label className='text-sm text-stone-300 mt-2 ' htmlFor="logo">business logo</label>
                <input type="url"  name='logo' value={logo}  onChange={(e) => setLogo(e.target.value) }  className=' min-w-250 bg-white p-2 rounded-full' />
            </div>)
        }
          
          <label className='text-sm text-stone-300 mt-2 ' htmlFor="password">password</label>
          <input type="password" value={password}  name='password' onChange={(e) => setPassword(e.target.value) }  className=' min-w-250 bg-white p-2 rounded-full' />
          
          <input type="submit" className='m-10 min-w-250 bg-teal text-white p-2 rounded-full' />
          </div>
        </form>
            {/** FORM ENDS */}
            </div>
      </div>
      {/** LOGIN AND SIGN UP STUFF */}
     
    </div>
  )
}

export default RestLogin