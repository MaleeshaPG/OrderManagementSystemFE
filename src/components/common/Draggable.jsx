import React, { useRef, useState, useEffect } from 'react'

const STORAGE_PREFIX = 'draggable-pos:'

const Draggable = ({ id, defaultPosition = { top: 12, right: 12 }, children }) => {
  const ref = useRef(null)
  const draggingRef = useRef(false)
  const startRef = useRef({ x: 0, y: 0, left: 0, top: 0 })
  const movedRef = useRef(false)
  const suppressClickRef = useRef(false)

  const getStoredRaw = () => {
    if (!id) return null
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + id)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  }

  const [pos, setPos] = useState(() => {
    return { left: undefined, top: defaultPosition.top ?? 12 }
  })
  const posRef = useRef(pos)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const stored = getStoredRaw()
    if (stored) {
      const w = el.offsetWidth || 0
      const h = el.offsetHeight || 0
      let left = stored.left
      let top = stored.top

      if (left === undefined && stored.right !== undefined) {
        left = Math.max(8, Math.min(window.innerWidth - w - 8, window.innerWidth - w - (stored.right || 0)))
      }
      if (top === undefined && stored.bottom !== undefined) {
        top = Math.max(8, Math.min(window.innerHeight - h - 8, window.innerHeight - h - (stored.bottom || 0)))
      }
      const resolved = { left: left ?? defaultPosition.left ?? 12, top: top ?? defaultPosition.top ?? 12 }
      posRef.current = resolved
      setPos(resolved)
      return
    }

    if (pos.left === undefined && defaultPosition?.right !== undefined) {
      const w = el.offsetWidth || 0
      const left = Math.max(8, window.innerWidth - (defaultPosition.right || 12) - w)
      const newPos = { ...pos, left }
      posRef.current = newPos
      setPos(newPos)
    } else if (pos.left === undefined) {
      const newPos = { ...pos, left: defaultPosition.left ?? 12 }
      posRef.current = newPos
      setPos(newPos)
    }
  }, [ref.current])

  useEffect(() => {
    posRef.current = pos

    const onMove = (e) => {
      if (!draggingRef.current) return
      e.preventDefault()
      const clientX = e.touches ? e.touches[0].clientX : e.clientX
      const clientY = e.touches ? e.touches[0].clientY : e.clientY
      const dx = clientX - startRef.current.x
      const dy = clientY - startRef.current.y
      if (!movedRef.current && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) movedRef.current = true
      const left = Math.min(
        Math.max(8, startRef.current.left + dx),
        window.innerWidth - (ref.current?.offsetWidth || 0) - 8,
      )
      const top = Math.min(
        Math.max(8, startRef.current.top + dy),
        window.innerHeight - (ref.current?.offsetHeight || 0) - 8,
      )
      const newPos = { left, top }
      posRef.current = newPos
      setPos(newPos)
    }

    const onUp = () => {
      if (!draggingRef.current) return
      draggingRef.current = false
      if (id) {
        const el = ref.current
        const w = el?.offsetWidth || 0
        const h = el?.offsetHeight || 0
        const left = posRef.current.left
        const top = posRef.current.top
        const stored = {
          left,
          top,
          right: Math.max(0, Math.round(window.innerWidth - (left + w))),
          bottom: Math.max(0, Math.round(window.innerHeight - (top + h))),
        }
        localStorage.setItem(STORAGE_PREFIX + id, JSON.stringify(stored))
      }
      if (movedRef.current) {
        const block = (ev) => {
          ev.preventDefault()
          ev.stopImmediatePropagation()
          window.removeEventListener('click', block, true)
        }
        window.addEventListener('click', block, true)
        setTimeout(() => window.removeEventListener('click', block, true), 500)
      }
      movedRef.current = false
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchmove', onMove, { passive: false })
    window.addEventListener('touchend', onUp)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onUp)
    }
  }, [id])

  useEffect(() => {
    const clampToViewport = () => {
      const el = ref.current
      if (!el) return
      const w = el.offsetWidth || 0
      const h = el.offsetHeight || 0
      const maxLeft = Math.max(8, window.innerWidth - w - 8)
      const maxTop = Math.max(8, window.innerHeight - h - 8)
      const cur = posRef.current || { left: 0, top: 0 }
      let changed = false
      let left = cur.left
      let top = cur.top
      if (left === undefined) left = Math.min(maxLeft, window.innerWidth - w - 12)
      if (top === undefined) top = Math.min(maxTop, 12)
      if (left > maxLeft) {
        left = maxLeft
        changed = true
      }
      if (top > maxTop) {
        top = maxTop
        changed = true
      }
      if (left < 8) {
        left = 8
        changed = true
      }
      if (top < 8) {
        top = 8
        changed = true
      }
      if (changed) {
        const newPos = { left, top }
        posRef.current = newPos
        setPos(newPos)
        if (id) {
          const w = el.offsetWidth || 0
          const h = el.offsetHeight || 0
          const stored = {
            left,
            top,
            right: Math.max(0, Math.round(window.innerWidth - (left + w))),
            bottom: Math.max(0, Math.round(window.innerHeight - (top + h))),
          }
          localStorage.setItem(STORAGE_PREFIX + id, JSON.stringify(stored))
        }
      }
    }
    window.addEventListener('resize', clampToViewport)
    clampToViewport()
    return () => window.removeEventListener('resize', clampToViewport)
  }, [id])


  useEffect(() => {
    const el = ref.current
    if (!el) return

    let raf = null
    const onResize = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        raf = null
        const w = el.offsetWidth || 0
        const h = el.offsetHeight || 0
        const maxLeft = Math.max(8, window.innerWidth - w - 8)
        const maxTop = Math.max(8, window.innerHeight - h - 8)
        const cur = posRef.current || { left: 0, top: 0 }
        let left = cur.left
        let top = cur.top
        let changed = false

        if (left === undefined) left = Math.min(maxLeft, window.innerWidth - w - 12)
        if (top === undefined) top = Math.min(maxTop, 12)

        if (left > maxLeft) {
          left = maxLeft
          changed = true
        }
        if (top > maxTop) {
          top = maxTop
          changed = true
        }
        if (left < 8) {
          left = 8
          changed = true
        }
        if (top < 8) {
          top = 8
          changed = true
        }

        if (changed) {
          const newPos = { left, top }
          posRef.current = newPos
          setPos(newPos)
          if (id) {
            const w = el.offsetWidth || 0
            const h = el.offsetHeight || 0
            const stored = {
              left,
              top,
              right: Math.max(0, Math.round(window.innerWidth - (left + w))),
              bottom: Math.max(0, Math.round(window.innerHeight - (top + h))),
            }
            localStorage.setItem(STORAGE_PREFIX + id, JSON.stringify(stored))
          }
        }
      })
    }

    const ro = new ResizeObserver(onResize)
    ro.observe(el)

    return () => {
      ro.disconnect()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [id])

  const handleDown = (e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    draggingRef.current = true
    startRef.current = { x: clientX, y: clientY, left: posRef.current.left ?? 12, top: posRef.current.top ?? 12 }
    movedRef.current = false
  }
  const handleDouble = () => {
    const stored = getStored()
    if (stored) {
      localStorage.removeItem(STORAGE_PREFIX + id)
      setPos({ left: undefined, top: defaultPosition.top ?? 12 })
      posRef.current = { left: undefined, top: defaultPosition.top ?? 12 }
    }
  }

  const handleClick = (e) => {
    if (suppressClickRef.current) {
      e.preventDefault()
      e.stopPropagation()
      suppressClickRef.current = false
    }
  }

  const style = {
    position: 'fixed',
    left: pos.left,
    top: pos.top,
    zIndex: 9999,
    touchAction: 'none',
  }

  return (
    <div
      ref={ref}
      style={style}
      onMouseDown={handleDown}
      onTouchStart={handleDown}
      onDoubleClick={handleDouble}
      onClick={handleClick}
    >
      {children}
    </div>
  )
}

export default Draggable
