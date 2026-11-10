// Armazenamento local: tudo fica no navegador deste aparelho.
const KEY = 'lista-compras-v1'

export function loadItems() {
  try {
    const raw = localStorage.getItem(KEY)
    const data = raw ? JSON.parse(raw) : []
    if (!Array.isArray(data)) return []

    return data
      .filter((item) => item && typeof item.name === 'string')
      .map((item) => ({
        id: String(item.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`),
        name: item.name.trim(),
        qty: typeof item.qty === 'string' ? item.qty : String(item.qty ?? ''),
        done: Boolean(item.done)
      }))
      .filter((item) => item.name)
  } catch {
    return []
  }
}

export function saveItems(items) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items))
  } catch {
    // Navegador bloqueou o armazenamento (ex.: modo privado). O app continua funcionando.
  }
}
