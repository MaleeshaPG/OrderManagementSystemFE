function toPascalCase(key) {
  if (typeof key !== 'string' || key.length === 0) return key
  return key
    .replace(/[-_\s]+(.)?/g, (_, chr) => (chr ? chr.toUpperCase() : ''))
    .replace(/^(.)/, (chr) => chr.toUpperCase())
}

function isPlainObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]'
}

export function normalizeKeys(value) {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeKeys(item))
  }

  if (isPlainObject(value)) {
    return Object.keys(value).reduce((memo, key) => {
      const normalizedKey = toPascalCase(key)
      memo[normalizedKey] = normalizeKeys(value[key])
      return memo
    }, {})
  }

  return value
}

export default normalizeKeys
