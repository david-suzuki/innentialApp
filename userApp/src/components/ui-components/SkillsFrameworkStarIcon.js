import React from 'react'

const SkillsFrameworkStarIcon = ({
  width = 14,
  className = '',
  fill = '#F7DD8C',
  stroke = '#FAFAFD',
  ...other
}) => (
  <svg
    width={width}
    height={width}
    viewBox='0 0 14 14'
    className={className}
    {...other}
  >
    <path
      fill={fill}
      fillRule='evenodd'
      stroke={stroke}
      d='M9.87 13.364l-2.872-1.423-2.867 1.421a1.278 1.278 0 0 1-1.719-.57 1.283 1.283 0 0 1-.092-.909l.847-3.078L.88 6.539a1.277 1.277 0 0 1 .785-2.181l2.734-.271 1.454-2.883A1.28 1.28 0 0 1 7.002.5c.48.002.92.272 1.141.702L9.6 4.09l2.734.27a1.276 1.276 0 0 1 .786 2.18l-2.286 2.267.848 3.079a1.285 1.285 0 0 1-1.238 1.614c-.198 0-.396-.047-.574-.136z'
    />
  </svg>
)

export default SkillsFrameworkStarIcon
