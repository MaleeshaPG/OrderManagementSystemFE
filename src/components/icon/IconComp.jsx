/* eslint-disable react-hooks/static-components */
import React, { Suspense, useMemo } from 'react'
import { useTheme } from '../../providers/ThemeProvider.jsx'
import { getLucideIcon } from '../../utils/get-Icon'

const IconComp = ({
  name = 'Check',
  size = 20,
  className = '',
  variant,
  animate = 'spin',
  animateMode = 'once',
  animateTrigger = null,
  fallback = null,
  ...props
}) => {
  const { theme } = useTheme()
  const LazyIcon = useMemo(() => getLucideIcon(name), [name])

  let iconColor = variant
  if (!iconColor) {
    iconColor = theme?.icon?.foreground || theme?.text?.primary || theme?.base?.foreground || '#000'
  } else if (theme && theme.icon && variant in theme.icon) {
    iconColor = theme.icon[variant]
  } else if (theme && theme.base && variant in theme.base) {
    iconColor = theme.base[variant]
  }

  if (animateMode === 'none') {
    return (
      <div className={`icon-wrapper ${className}`} data-icon={name}>
        <Suspense
          fallback={fallback || <span style={{ display: 'inline-block', width: size, height: size }} aria-hidden />}
        >
          <LazyIcon size={size} className={className} color={iconColor} {...props} />
        </Suspense>
      </div>
    )
  }

  const infiniteClass =
    animateMode === 'infinite'
      ? animate === 'spin'
        ? 'icon-spin'
        : animate === 'pulse'
          ? 'icon-pulse'
          : animate === 'pop'
            ? 'icon-pop-infinite'
            : ''
      : ''

  const [oneShotActive, setOneShotActive] = React.useState(false)
  React.useEffect(() => {
    if (animateMode === 'once') {
      setOneShotActive(true)
    }
  }, [animateTrigger, animateMode])
  const oneShotClass =
    animateMode === 'once' || animateMode === 'hover'
      ? animate === 'pop'
        ? 'icon-pop-once'
        : animate === 'spin'
          ? 'icon-spin-once'
          : animate === 'pulse'
            ? 'icon-pulse-once'
            : ''
      : ''

  const hoverClass =
    animateMode === 'hover'
      ? animate === 'spin'
        ? 'icon-spin-hover'
        : animate === 'pulse'
          ? 'icon-pulse-hover'
          : animate === 'pop'
            ? 'icon-pop-hover'
            : ''
      : ''

  const combinedClass = [infiniteClass, oneShotActive ? oneShotClass : '', hoverClass, className]
    .filter(Boolean)
    .join(' ')

  const handleAnimationEnd = () => {
    if (oneShotActive) setOneShotActive(false)
  }
  const handleMouseEnter = () => {
    if (animateMode === 'hover') {
      setOneShotActive(true)
    }
  }

  return (
    <div className={`icon-wrapper ${combinedClass}`} data-icon={name} onMouseEnter={handleMouseEnter}>
      <Suspense
        fallback={fallback || <span style={{ display: 'inline-block', width: size, height: size }} aria-hidden />}
      >
        <LazyIcon
          size={size}
          className={combinedClass}
          onAnimationEnd={handleAnimationEnd}
          color={iconColor}
          {...props}
        />
      </Suspense>
    </div>
  )
}

export default IconComp
