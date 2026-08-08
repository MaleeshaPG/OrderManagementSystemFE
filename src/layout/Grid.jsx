import React from 'react'
import useWindowSize from '../hooks/useWindowSize'

const Grid = ({ children, style: styleProp = {}, fullHeight = false }) => {
  const { width } = useWindowSize()

  let gridTemplateColumns = 'repeat(12, 1fr)'
  if (width <= 640) gridTemplateColumns = 'repeat(1, 1fr)'
  else if (width <= 1024) gridTemplateColumns = 'repeat(8, 1fr)'

  const baseStyle = {
    minWidth: '100%',
    display: 'grid',
    gridTemplateColumns,
    alignContent: 'start',
    alignItems: 'start',
    gap: '12px',
    boxSizing: 'border-box',
  }

  if (fullHeight) baseStyle.minHeight = '100vh'

  return <div style={{ ...baseStyle, ...styleProp }}>{children}</div>
}

export default Grid
