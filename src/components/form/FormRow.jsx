import React from 'react'
import useWindowSize from '../../hooks/useWindowSize'

const FormRow = ({ children }) => {
  const { width } = useWindowSize()

  const getContainerSpan = () => {
    if (width <= 640) return '1 / -1'
    if (width <= 1024) return 'span 8'
    return 'span 12'
  }

  return <div style={{ gridColumn: getContainerSpan(), display: 'contents' }}>{children}</div>
}

export default FormRow
