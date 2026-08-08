import React from 'react'
import { useTheme } from '../../providers/ThemeProvider'
import useWindowSize from '../../hooks/useWindowSize'

const PageHeader = ({ title, subtitle, actions }) => {
  const { theme } = useTheme()
  const { width: windowWidth } = useWindowSize()
  const styles = {
    container: {
      display: 'flex',
      flexDirection: windowWidth <= 440 && actions ? 'column' : 'row',
      justifyContent: 'space-between',
      alignItems: windowWidth <= 440 && actions ? 'flex-start' : 'center',
      gap: windowWidth <= 440 && actions ? 8 : 0,
      padding: '12px 0',
      borderBottom: `1px solid ${theme.pageheader?.border || theme.card?.border || 'rgba(255,255,255,0.12)'}`,
      marginBottom: 12,
    },
    left: {
      display: 'flex',
      flexDirection: 'column',
      color: theme.pageheader?.mainheading || theme.base?.foreground,
    },
    title: {
      fontSize: '1.25rem',
      fontWeight: 600,
      margin: 0,
      color: theme.pageheader?.mainheading || theme.base?.foreground,
    },
    subtitle: {
      fontSize: '0.9rem',
      margin: 0,
      color: theme.pageheader?.subheading || theme.base?.foreground,
      opacity: 0.75,
    },
    right: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'wrap',
    },
  }

  return (
    <div style={styles.container}>
      <div style={styles.left}>
        {title && <h1 style={styles.title}>{title}</h1>}
        {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
      </div>
      <div style={styles.right}>{actions}</div>
    </div>
  )
}

export default PageHeader
