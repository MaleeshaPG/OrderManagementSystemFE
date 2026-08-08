/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useMemo, useRef, useEffect, useId } from 'react'
import { useTheme } from '../../providers/ThemeProvider'

const Select = ({
  options = [],
  multiple = false,
  pageSize = 10,
  value,
  onChange,
  placeholder = 'Select...',
  style = {},
  label,
  labelStyle,
  reserveLabel = false,
  disabled = false,
}) => {
  const uid = useId()
  const { theme } = useTheme()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(false)
  const ref = useRef(null)
  const searchRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(-1)

  const optionList = useMemo(() => {
    if (Array.isArray(options)) {
      return options.map((o, i) => {
        if (typeof o === 'string' || typeof o === 'number') return [String(o), String(o)]
        if (o && typeof o === 'object') return [String(o.value ?? i), String(o.label ?? o.value ?? '')]
        return [String(i), '']
      })
    }
 
    return Object.entries(options).map(([k, v]) => [String(k), String(v)])
  }, [options])

  const optionMap = useMemo(() => Object.fromEntries(optionList), [optionList])

  const filtered = useMemo(() => {
    const q = String(search || '').toLowerCase()
    if (!q) return optionList
    return optionList.filter(([k, v]) => String(v).toLowerCase().includes(q) || String(k).toLowerCase().includes(q))
  }, [optionList, search])
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

  const isSelected = (key) => {
    const valStr = String(key)
    return multiple 
      ? Array.isArray(value) && value.map(String).includes(valStr) 
      : String(value ?? '') === valStr
  }

  const handleSelect = (key) => {
    if (multiple) {
      let next = Array.isArray(value) ? [...value] : []
      if (next.map(String).includes(String(key))) {
        next = next.filter((k) => String(k) !== String(key))
      } else {
        next.push(key)
      }
      onChange && onChange(next)
    } else {
      onChange && onChange(key)
      setOpen(false)
    }
  }

  const borderColor = theme?.input?.border || '#ccc'
  const bgColor = theme?.input?.background || '#fff'
  const fgColor = theme?.input?.foreground || '#000'
  const focusRing = theme?.input?.focus_ring || '#0D6EFD'
  const selectedBg = theme?.button?.primary || '#0D6EFD'
  const selectedFg = theme?.button?.primary_foreground || '#fff'

  const outerStyle = { display: 'flex', flexDirection: 'column', width: '100%', padding: 2, ...style }
  const wrapperStyle = {
    position: 'relative',
    minWidth: 220,
  }
  const hasFocus = open || focused
  const inputStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    width: '100%',
    padding: '8px 10px',
    border: `1px solid ${hasFocus ? focusRing : borderColor}`,
    borderRadius: 8,
    background: bgColor,
    color: fgColor,
    outline: 'none',
    boxShadow: hasFocus ? `0 0 0 4px ${focusRing}33` : 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.7 : 1,
    fontSize: 14,
    boxSizing: 'border-box',
    transition: 'box-shadow 150ms, border-color 150ms',
  }
  const dropdownStyle = {
    position: 'absolute',
    top: '100%',
    left: 0,
    width: '100%',
    background: bgColor,
    border: `1px solid ${borderColor}`,
    borderRadius: 6,
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    zIndex: 10,
    maxHeight: 240,
    overflowY: 'auto',
    marginTop: 2,
  }
  const optionStyle = (selected, active) => ({
    padding: '8px 10px',
    background: selected ? selectedBg : active ? `${selectedBg}22` : bgColor,
    color: selected ? selectedFg : fgColor,
    cursor: 'pointer',
    fontSize: 14,
    transition: 'background 0.12s',
  })
  const chipStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '4px 8px',
    border: `0.5px solid ${borderColor}`,
    borderRadius: 999,
    background: theme?.input?.static_area || '#f1f3f5',
    color: fgColor,
    fontSize: 13,
  }
  const chipCloseStyle = {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: fgColor,
    padding: 0,
    marginLeft: 4,
  }
  const searchStyle = {
    width: '100%',
    padding: '6px 10px',
    border: `1px solid ${borderColor}`,
    borderRadius: 6,
    marginBottom: 4,
    background: bgColor,
    color: fgColor,
    fontSize: 14,
    boxSizing: 'border-box',
  }
  const paginationStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '4px 8px',
    fontSize: 13,
    color: fgColor,
  }

  let displayValue = ''
  if (multiple) {
    displayValue = Array.isArray(value) ? value.map((k) => optionMap[String(k)] || k).join(', ') : ''
  } else {
    displayValue = value !== undefined && value !== null ? optionMap[String(value)] || value : ''
  }

  useEffect(() => {
    const onDoc = (e) => {
      if (!ref.current) return
      if (!ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('touchstart', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('touchstart', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  useEffect(() => {
    if (open) {
      setActiveIndex(paged.length > 0 ? 0 : -1)
      setTimeout(() => searchRef.current && searchRef.current.focus(), 0)
    } else {
      setActiveIndex(-1)
    }
  }, [open, paged.length])

  const handleKeyDown = (e) => {
    if (!open) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => (i + 1) % Math.max(1, paged.length))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => (i - 1 + Math.max(1, paged.length)) % Math.max(1, paged.length))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIndex >= 0 && activeIndex < paged.length) {
        const [k] = paged[activeIndex]
        handleSelect(k)
      }
    }
  }

  const shouldShowLabel = Boolean(label) || reserveLabel

  return (
    <div style={{ ...outerStyle }}>
      {shouldShowLabel ? (
        <div style={{ minHeight: 16, marginBottom: 4 }}>
          <label
            htmlFor={uid}
            aria-hidden={label ? undefined : true}
            style={{
              display: 'block',
              fontSize: '0.875rem',
              lineHeight: '1rem',
              color: theme?.input?.label || theme?.base?.foreground || '#333',
              ...labelStyle,
            }}
          >
            {label || '\u00A0'}
          </label>
        </div>
      ) : null}

      <div style={wrapperStyle} ref={ref} onKeyDown={handleKeyDown}>
        <div
          id={uid}
          tabIndex={0}
          style={inputStyle}
          onClick={() => {
            if (!disabled) setOpen((o) => !o)
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        >
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', flex: 1 }}>
            {multiple ? (
              Array.isArray(value) && value.length > 0 ? (
                value.map((k) => (
                  <span key={k} style={chipStyle} onClick={(e) => e.stopPropagation()}>
                    {optionMap[k] || k}
                    <button
                      type="button"
                      aria-label={`Remove ${k}`}
                      style={chipCloseStyle}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSelect(k)
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))
              ) : (
                <span style={{ color: '#888' }}>{placeholder}</span>
              )
            ) : (
              <span>{displayValue || <span style={{ color: '#888' }}>{placeholder}</span>}</span>
            )}
          </div>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform .18s' }}
          >
            <path fill={fgColor} d="M7 10l5 5 5-5z" />
          </svg>
        </div>
        {open && (
          <div
            style={dropdownStyle}
            onMouseDown={(e) => {
              e.stopPropagation()
              if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) e.nativeEvent.stopImmediatePropagation()
            }}
          >
            <input
              ref={searchRef}
              style={searchStyle}
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              autoFocus={open}
            />
            {paged.length === 0 ? (
              <div style={{ padding: '8px', color: '#888' }}>No options</div>
            ) : (
              paged.map(([k, v], idx) => {
                const selected = isSelected(k)
                const active = idx === activeIndex
                return (
                  <div
                    key={k}
                    style={optionStyle(selected, active)}
                    onMouseDown={(e) => {
                      e.stopPropagation()
                      if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) e.nativeEvent.stopImmediatePropagation()
                      if (!disabled) handleSelect(k)
                    }}
                    onMouseEnter={() => setActiveIndex(idx)}
                  >
                    {v}
                  </div>
                )
              })
            )}
            {totalPages > 1 && (
              <div style={paginationStyle}>
                  <button
                    type="button"
                  style={{
                    border: 'none',
                    background: 'none',
                    color: fgColor,
                    cursor: page > 1 ? 'pointer' : 'not-allowed',
                  }}
                  disabled={page === 1}
                  onMouseDown={(e) => {
                    e.stopPropagation()
                    if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) e.nativeEvent.stopImmediatePropagation()
                    setPage((p) => Math.max(1, p - 1))
                  }}
                >
                  Prev
                </button>
                <span>
                  Page {page} / {totalPages}
                </span>
                <button
                  type="button"
                  style={{
                    border: 'none',
                    background: 'none',
                    color: fgColor,
                    cursor: page < totalPages ? 'pointer' : 'not-allowed',
                  }}
                  disabled={page === totalPages}
                  onMouseDown={(e) => {
                    e.stopPropagation()
                    if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) e.nativeEvent.stopImmediatePropagation()
                    setPage((p) => Math.min(totalPages, p + 1))
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Select
