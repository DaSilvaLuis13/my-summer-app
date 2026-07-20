//src/components/pos/QuickAccessGrid.tsx
import { useState } from 'react'
import { IconSearch, IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import { ProductButton } from './ProductButton'
import type { Producto } from '../../types'

interface QuickAccessGridProps {
    productos: Producto[]
    onSelect: (producto: Producto) => void
    itemsPage?: number
}

export const QuickAccessGrid = ({ productos, onSelect, itemsPage = 9 }: QuickAccessGridProps) => {
    const [page,   setPage]   = useState(0)
    const [search, setSearch] = useState('')

    const filtrados  = productos.filter(p =>
        p.nombre.toLowerCase().includes(search.toLowerCase())
    )
    const totalPages = Math.ceil(filtrados.length / itemsPage)
    const pagina     = filtrados.slice(page * itemsPage, (page + 1) * itemsPage)

    return (
        <div className="flex flex-col gap-3 p-3 flex-1">


            <div className="grid grid-cols-3 gap-2 flex-1 content-start">
                {pagina.length > 0
                    ? pagina.map(p => (
                        <ProductButton key={p.idproducto} producto={p} onClick={onSelect} />
                    ))
                    : <p className="col-span-3 text-center text-xs text-(--color-text-muted) py-4">Sin resultados</p>
                }
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <button
                        onClick={() => setPage(p => Math.max(0, p - 1))}
                        disabled={page === 0}
                        className="w-6 h-6 rounded-full border border-(--color-border) flex items-center justify-center text-(--color-text-muted) hover:bg-(--color-background) disabled:opacity-30"
                    >
                        <IconChevronLeft size={12} />
                    </button>

                    {Array.from({ length: totalPages }).map((_, i) => (
                        <div
                            key={i}
                            onClick={() => setPage(i)}
                            className={`w-2 h-2 rounded-full cursor-pointer transition-colors ${
                                i === page ? 'bg-blue-400' : 'bg-(--color-border) hover:bg-(--color-text-muted)'
                            }`}
                        />
                    ))}

                    <button
                        onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                        disabled={page === totalPages - 1}
                        className="w-6 h-6 rounded-full border border-(--color-border) flex items-center justify-center text-(--color-text-muted) hover:bg-(--color-background) disabled:opacity-30"
                    >
                        <IconChevronRight size={12} />
                    </button>
                </div>
            )}
        </div>
    )
}