//src/components/pos/ProductButton.tsx
import type { Producto } from '../../types'
import { IconDroplet, IconCookie, IconMilk, 
         IconShoppingBag, IconCandy, IconSpray, IconBottle } from '@tabler/icons-react'


const departamentoStyles: Record<number, { bg?: string; text: string; icon: React.ReactNode }> = {
    1: { bg: 'bg-blue-50',   text: 'text-blue-500',   icon: <IconDroplet     size={22} /> },
    2: { bg: 'bg-orange-50', text: 'text-orange-500', icon: <IconCookie  size={22} /> },
    3: { bg: 'bg-yellow-50', text: 'text-yellow-500', icon: <IconMilk        size={22} /> },
    4: { bg: 'bg-green-50',  text: 'text-green-500',  icon: <IconShoppingBag size={22} /> },
    5: { bg: 'bg-pink-50',   text: 'text-pink-500',   icon: <IconCandy       size={22} /> },
    6: { bg: 'bg-cyan-50',   text: 'text-cyan-500',   icon: <IconSpray       size={22} /> },
    7: { bg: 'bg-purple-50', text: 'text-purple-500', icon: <IconBottle      size={22} /> },
}

const defaulStyle = { bg: 'bg-gray-50', text: 'text-gray-500',  icon: <IconShoppingBag size={22} />}

interface ProductButtonProps {
    producto: Producto
    onClick: (producto: Producto) => void
}

export const ProductButton = ({ producto, onClick }: ProductButtonProps) => {
    const style = departamentoStyles[producto.iddepartamento] ?? defaulStyle

    return (
        <button 
            onClick={() => onClick(producto)}
            className="flex flex-col items-center gap-1.5 p-2 rounded-xl cursor-pointer border hover:text-orange-50 hover:border-(--color-border) hover:bg-(--color-primary) border-blue-300 bg-blue-50 text-(--color-text-main) transition-colors w-full"
        >
            <div className={`w-10 h-10 rounded-lg ${style.bg} ${style.text} flex items-center justify-center`}>
                {style.icon}
            </div>
            <span className="text-[16px] font-medium  text-center leading-tight line-clamp-2">
                {producto.nombre}
            </span>
        </button>
    )
}