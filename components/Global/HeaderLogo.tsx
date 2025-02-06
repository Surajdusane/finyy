import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Props = {
  variant?: 'white' | 'blue'
}

const HeaderLogo = ({ variant = 'white' }: Props) => {
  return (
    <Link href="/">
        <>
            {
              variant === 'white' ? (
                <div className='items-center hidden lg:flex'>
                  <Image src="/logo.svg" height={28} width={28} alt='Logo'/>
                  <p className='font-semibold text-white textt-2xl ml-2.5'>Finance</p>
                </div>
              ) : (
                <div className='items-center flex'>
                  <Image src="/logo_blue.svg" height={28} width={28} alt='Logo'/>
                  <p className='font-semibold text-[#3d82f6] textt-2xl ml-2.5'>Finance</p>
                </div>
              )
            }
        </>
    </Link>
  )
}

export default HeaderLogo