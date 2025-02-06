import React from 'react'
import AccountFilter from './AccountFilter'
import DateFilter from './date-filter'

const Filter = () => {
  return (
    <div className='flex flex-col lg:flex-row items-center gap-y-2 lg:gap-y-0 lg:gap-x-2'>
        <AccountFilter/>
        <DateFilter/>
    </div>
  )
}

export default Filter