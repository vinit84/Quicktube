import React from 'react'
import Intropage from "./IntroPage"
import Designs from "./Designs"
import Feature from './Feature'
import BackgroundBeams from './UI/backgroundBeams'





function Home() {
  return (
    <div className='flex bg-black  flex-col w-screen overflow-x-hidden'>
    <Intropage/>
    <div className='mt-[9rem]'>
    <Designs/>
    </div>
    <div>
    <Feature/>
    </div>
    <BackgroundBeams/>
    
   
    </div>
  )
}

export default Home