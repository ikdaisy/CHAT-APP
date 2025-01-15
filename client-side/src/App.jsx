import {BrowserRouter,Route,Routes} from 'react-router-dom'
import SignUp from './Components/SignUp/SignUp'
import SignIn from './Components/SignIn/SignIn'
import Email from './Components/Email/Email'
import ConfirmPassword from './Components/ConfirmPassword/ConfirmPassword'
import Home from './Components/Home/Home'
import Contacts from './Components/Contacts/Contacts'
import Nav from './Components/Nav/Nav'
import { useState } from 'react'
import Chat from './Components/Chat/Chat'
import UserProfile from './Components/UserProfile/UserProfile'

function App() {
  const [user,setUser]=useState("")

  return (
    <BrowserRouter>
    {user &&<Nav  user={user} setUser={setUser} />}
      <Routes>
        <Route path='/' element={<Home setUser={setUser}/>}/>
        <Route path='/signin' Component={SignIn}/>
          <Route path='/signup' Component={SignUp}/>
          <Route path='/email' Component={Email}/>
          <Route path='/confirmpassword' element={<ConfirmPassword />}/>
          <Route path='/contacts' element={<Contacts setUser={setUser} />}/>
          <Route path='/chat/:_id' element={<Chat setUser={setUser} />}/>
          <Route path='/userprofile/:_id' element={<UserProfile setUser={setUser} />}/>




        
      </Routes>
    </BrowserRouter>
  )
}

export default App
