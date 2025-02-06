import Faq from '@/components/Global/FaQ'
import Herosec from '@/components/Global/Herosec'
import NavBar from '@/components/Global/NavBar'
import React from 'react'

const page = () => {
  return (
    <div className='bg-[#f9fafb]'>
        <NavBar/>
        <Herosec/>
        <Faq/>
    </div>
  )
}

export default page