import React from 'react'

const FlagIcon = ({ selected }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke={selected ? '#5a55ab' : '#d9e1ee'}
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z' />
      <line x1='4' y1='22' x2='4' y2='15' />
    </svg>
  )
}

export default FlagIcon