import useWindowSize from '../hooks/useWindowSize'

export const useGetSpan = () => {
  const { width } = useWindowSize()

  const getSpan = () => {
    if (width <= 640) return '1 / -1'
    if (width <= 1024) return 'span 4'
    return 'span 6'
  }

  return getSpan
}
