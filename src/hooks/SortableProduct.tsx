//src/hooks/SortableProduct.tsx

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ProductButton } from '../components/pos/ProductButton'
import { IconTrash } from '@tabler/icons-react'
import type { AccesoRapidoCompleto } from '../types'

interface SortableProductProps {
    item: AccesoRapidoCompleto
    onRemove: (item: AccesoRapidoCompleto) => void
}

export const SortableProduct = ({ item, onRemove }: SortableProductProps) => {

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: item.idacceso
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.5 : 1,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className='relative group touch-none'
            {...attributes}
            {...listeners}
        >
            <ProductButton 
                producto={{...item, activo: true, idproveedor:0, costo: 0, ganancia: 0, stockminimo: 0, stockmaximo: 0, stockactual: 0}}
                onClick={() => {}}
            />

            <button
                onPointerDown={(e) => {
                    e.stopPropagation() // <-- Clave: Evita que dnd-kit crea que quieres arrastrar el botón de basura
                    onRemove(item)
                }}
                className='absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-(--color-danger-border) text-white items-center justify-center hidden group-hover:flex transition-all'
            >
                <IconTrash size={11} />
            </button>
        </div>
    )
}