import React from 'react'
import NavBar from './_components/NavBar'

const layout = ({children}: {children: React.ReactNode}) => {
  return (
    <section>
        <NavBar />
        {children}
    </section>
  )
}

export default layout