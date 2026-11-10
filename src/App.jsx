import { useEffect, useMemo, useRef, useState } from 'react'
import { loadItems, saveItems } from './storage.js'
import { Download, Upload, Plus, ShoppingCart, Trash2 } from 'lucide-react'

const FILTERS = [
  { id: 'all', label: 'Tudo' },
  { id: 'open', label: 'Falta comprar' },
  { id: 'done', label: 'Já comprei' }
]

const newId = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

export default function App() {
  const [items, setItems] = useState(loadItems)
  const [name, setName] = useState('')
  const [qty, setQty] = useState('')
  const [filter, setFilter] = useState('all')
  const fileRef = useRef(null)

  useEffect(() => { saveItems(items) }, [items])

  const visible = useMemo(
    () => items.filter((i) => filter === 'all' || (filter === 'done') === i.done),
    [items, filter]
  )
  const doneCount = items.filter((i) => i.done).length
  const openCount = items.length - doneCount
  const progress = items.length ? Math.round((doneCount / items.length) * 100) : 0

  function addItem(e) {
    e.preventDefault()
    const n = name.trim()
    if (!n) return
    setItems((prev) => [{ id: newId(), name: n, qty: qty.trim(), done: false }, ...prev])
    setName('')
    setQty('')
  }

  function toggle(id) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, done: !i.done } : i)))
  }

  function remove(id) { setItems((prev) => prev.filter((i) => i.id !== id)) }
  function clearDone() { setItems((prev) => prev.filter((i) => !i.done)) }

  function exportJson() {
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `lista-de-compras-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  async function importJson(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const data = JSON.parse(await file.text())
      if (!Array.isArray(data)) throw new Error('formato')
      const valid = data
        .filter((item) => item && typeof item.name === 'string' && item.name.trim())
        .map((item) => ({
          id: newId(),
          name: item.name.trim(),
          qty: typeof item.qty === 'string' || typeof item.qty === 'number' ? String(item.qty) : '',
          done: Boolean(item.done)
        }))
      if (!window.confirm('Trocar sua lista atual pela lista deste arquivo?')) return
      setItems(valid)
    } catch {
      window.alert('Não conseguimos abrir esse arquivo. Escolha um backup exportado por esta lista.')
    }
  }

  return (
    <div className="page">
      <header className="topbar">
        <div className="flex items-center gap-6">
          <a className="logo" href="#inicio" aria-label="Minha lista de compras, início">
            <img className="logo-mark" src={`${import.meta.env.BASE_URL}logo-minha-lista.svg`} alt="Minha Lista — compras simples, dia a dia leve" />
          </a>
        </div>

        <div className="actions">
          <button className="ghost" onClick={exportJson} title="Salvar uma cópia da lista" aria-label="Salvar uma cópia da lista">
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Salvar cópia</span>
          </button>
          <button className="ghost" onClick={() => fileRef.current?.click()} title="Abrir uma cópia salva" aria-label="Abrir uma cópia salva">
            <Upload className="w-4 h-4 text-emerald-600" />
            <span>Abrir cópia</span>
          </button>
          <input ref={fileRef} type="file" accept="application/json" hidden onChange={importJson} />
        </div>
      </header>

      <main className="container" id="inicio">
        <div className="hero-compact">
          <h1 className="display">
            Sua lista de compras sem <span className="highlight">complicação</span>
          </h1>
        </div>

        <form className="add" onSubmit={addItem}>
          <input
            className="input grow"
            name="produto"
            autoComplete="off"
            maxLength={100}
            placeholder="O que você precisa comprar? Ex.: Arroz"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-label="Nome do produto"
          />
          <input
            className="input qty-input"
            name="quantidade"
            autoComplete="off"
            maxLength={50}
            placeholder="Quantidade (ex: 2 pacotes)"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            aria-label="Quantidade opcional"
          />
          <button className="cta" type="submit">
            <Plus className="w-4 h-4" />
            <span>Adicionar</span>
          </button>
        </form>
        <p className="hint">Dica: você pode escrever a quantidade, como “2 pacotes” ou “1 kg”.</p>

        <section aria-label="Sua lista de compras">
          <div className="summary">
            <h2 className="summary-title">Sua lista de compras</h2>
            <span className="progress-copy">
              {items.length === 0 ? 'Comece adicionando um produto' : `${doneCount} de ${items.length} ${items.length === 1 ? 'item comprado' : 'itens comprados'}`}
            </span>
          </div>

          <div className="progress-track" role="progressbar" aria-label="Progresso das compras" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress}>
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>

          <div className="toolbar">
            <div className="tabs" role="group" aria-label="Mostrar itens">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={`tab ${filter === f.id ? 'active' : ''}`}
                  aria-pressed={filter === f.id}
                  onClick={() => setFilter(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>
            {doneCount > 0 && (
              <button type="button" className="link" onClick={clearDone}>
                Remover comprados ({doneCount})
              </button>
            )}
          </div>

          <div className="list-container">
            {visible.length === 0 && (
              <div className="empty">
                <div className="empty-icon">
                  <ShoppingCart className="w-6 h-6 text-emerald-600" />
                </div>
                <strong>{items.length === 0 ? 'Sua lista está prontinha para começar' : 'Nenhum produto por aqui'}</strong>
                <p>{items.length === 0 ? 'Escreva o nome de um produto no campo acima e toque em “Adicionar”.' : 'Quando houver produtos nesta categoria, eles vão aparecer aqui.'}</p>
              </div>
            )}

            {visible.map((i) => (
              <div key={i.id} className={`row-card ${i.done ? 'done-wrapper' : ''}`}>
                <label className="check">
                  <input type="checkbox" checked={i.done} onChange={() => toggle(i.id)} aria-label={`${i.done ? 'Marcar como não comprado' : 'Marcar como comprado'}: ${i.name}`} />
                  <span className={`item-name ${i.done ? 'done-text' : ''}`}>{i.name}</span>
                </label>

                <div className="row-right">
                  {i.qty && <span className="qty-tag" title={i.qty}>{i.qty}</span>}
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => remove(i.id)}
                    aria-label={`Remover ${i.name}`}
                    title="Remover produto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <p className="footnote">
            Sua lista fica salva automaticamente neste aparelho. {openCount > 0 && items.length > 0 ? `${openCount} ${openCount === 1 ? 'produto esperando' : 'produtos esperando'} por você.` : ''}
          </p>
        </section>
      </main>
    </div>
  )
}
