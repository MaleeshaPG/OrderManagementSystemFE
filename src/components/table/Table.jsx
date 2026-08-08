/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useMemo, useEffect } from 'react'
import { useTheme } from '../../providers/ThemeProvider'
import Button from '../button/Button'
import useWindowSize from '../../hooks/useWindowSize'

function PaginationControls({
  page,
  setPage,
  pageSize,
  setPageSize,
  pageSizeOptions,
  total,
  pageCount,
  borderColor,
  fg,
  cardBg,
}) {
  const controlStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 8,
    borderTop: `1px solid ${borderColor}`,
  }
  const btnStyle = {
    background: 'transparent',
    border: `1px solid ${borderColor}`,
    color: fg,
    padding: '6px 10px',
    borderRadius: 6,
    cursor: 'pointer',
  }

  const start = total === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)

  return (
    <div style={controlStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ fontSize: 13, whiteSpace: 'nowrap' }}>Rows per page:</div>
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value))
            setPage(1)
          }}
          style={{
            padding: '6px 8px',
            borderRadius: 6,
            border: `1px solid ${borderColor}`,
            background: cardBg,
            color: fg,
          }}
        >
          {pageSizeOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        <div style={{ fontSize: 13, color: fg, marginLeft: 8 }}>{`${start}–${end} of ${total}`}</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} variant="ghost" size="sm" ariaLabel="Previous page">
          <span style={{ fontSize: 18 }}>‹</span>
        </Button>
        <div style={{ fontSize: 13, minWidth: 56, textAlign: 'center' }}>{`${page} / ${pageCount}`}</div>
        <Button onClick={() => setPage((p) => Math.min(pageCount, p + 1))} disabled={page >= pageCount} variant="ghost" size="sm" ariaLabel="Next page">
          <span style={{ fontSize: 18 }}>›</span>
        </Button>
      </div>
    </div>
  )
}

export default function Table({
  columns = [],
  data = [],
  rowKey = 'id',
  className = '',
  initialPageSize = 10,
  pageSizeOptions = [5, 10, 20, 50],
  showPagination = true,
  localStorageKey = null, 
  onRowClick = null,
  serverSide = false,
  serverPage = 1,
  serverPageSize = 10,
  serverTotal = 0,
  onPageChange = null,
  onPageSizeChange = null,
}) {
  const { theme } = useTheme()
  const fg = theme?.text?.primary ?? theme?.base?.foreground
  const borderColor = theme?.card?.line ?? theme?.modal?.line ?? 'rgba(0,0,0,0.06)'
  const cardBg = theme?.card?.background ?? theme?.base?.background ?? '#fff'

  const { width } = useWindowSize()
  const isMobile = width < 640

  const safeData = Array.isArray(data) ? data : []

  const [page, setPage] = useState(serverSide ? serverPage : 1)
  const [pageSize, setPageSize] = useState(() => {
    try {
      if (localStorageKey) {
        const val = localStorage.getItem(localStorageKey)
        if (val) return Number(val)
      }
    } catch (e) {

    }
    return initialPageSize
  })

  const total = serverSide ? serverTotal : safeData.length
  const effectivePageSize = serverSide ? serverPageSize : pageSize
  const pageCount = Math.max(1, Math.ceil(total / effectivePageSize))

  useEffect(() => {
    if (serverSide) {
      setPage(serverPage)
      setPageSize(serverPageSize)
    }
  }, [serverSide, serverPage, serverPageSize])

  useEffect(() => {
    if (page > pageCount) setPage(pageCount)
    if (page < 1) setPage(1)
  }, [page, pageCount])

  const hideOnSinglePage = true
  const shouldShowPagination = showPagination && (!hideOnSinglePage || pageCount > 1)

  const pagedData = useMemo(() => {
    if (!shouldShowPagination) return safeData
    if (serverSide) return safeData
    const start = (page - 1) * pageSize
    return safeData.slice(start, start + pageSize)
  }, [safeData, page, pageSize, shouldShowPagination, serverSide])

  useEffect(() => {
    try {
      if (localStorageKey) localStorage.setItem(localStorageKey, String(pageSize))
    } catch (e) {

    }
  }, [pageSize, localStorageKey])

  if (isMobile) {
    return (
      <div className={className} style={{ display: 'block' }}>
        {pagedData.map((row) => (
          <div
            key={row[rowKey] ?? JSON.stringify(row)}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
            style={{
              background: cardBg,
              color: fg,
              border: `1px solid ${borderColor}`,
              borderRadius: 8,
              padding: 12,
              marginBottom: 12,
              cursor: onRowClick ? 'pointer' : undefined,
            }}
          >
            {columns.map((col) => (
              <div key={col.key} style={{ display: 'flex', padding: '6px 0', alignItems: 'flex-start' }}>
                <div style={{ minWidth: 110, fontWeight: 600, opacity: 0.9 }}>{col.label}</div>
                <div style={{ flex: 1 }}>{col.render ? col.render(row) : (row[col.key] ?? '')}</div>
              </div>
            ))}
          </div>
        ))}

        {shouldShowPagination && (
          <PaginationControls
            page={serverSide ? serverPage : page}
            setPage={serverSide ? (p) => onPageChange && onPageChange(p) : setPage}
            pageSize={effectivePageSize}
            setPageSize={serverSide ? (s) => onPageSizeChange && onPageSizeChange(s) : (s) => { setPageSize(s); setPage(1) }}
            pageSizeOptions={pageSizeOptions}
            total={total}
            pageCount={pageCount}
            borderColor={borderColor}
            fg={fg}
            cardBg={cardBg}
          />
        )}
      </div>
    )
  }

  return (
    <>
      <table className={className} style={{ width: '100%', borderCollapse: 'collapse', color: fg }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={{ textAlign: col.align ?? 'left', padding: 8 }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {pagedData.map((row) => (
            <tr
              key={row[rowKey] ?? JSON.stringify(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              style={{ borderBottom: `1px solid ${borderColor}`, cursor: onRowClick ? 'pointer' : undefined }}
            >
              {columns.map((col) => (
                <td key={col.key} style={{ padding: 8, textAlign: col.align ?? 'left' }}>
                  {col.render ? col.render(row) : (row[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {shouldShowPagination && (
        <PaginationControls
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          pageSizeOptions={pageSizeOptions}
          total={total}
          pageCount={pageCount}
          borderColor={borderColor}
          fg={fg}
          cardBg={cardBg}
        />
      )}
    </>
  )
}
