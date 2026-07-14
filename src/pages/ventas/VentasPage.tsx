import { BottomBar } from "../../components/layout/BottomBar"
import { SectionCard } from "../../components/ui/SectionCard"
import { FormInput } from "../../components/forms/FormInput"
import { ActionButton } from "../../components/ui/ActionButton"
import { Badge } from "../../components/ui/Badge"
import { useState } from "react"
import { IconSearch, IconTable, IconX, IconArrowLeftTail, IconMoneybag, IconTrash, IconBaguette } from "@tabler/icons-react"
import { useNavigate } from 'react-router-dom';
import { SearchModal } from "../../components/ui/SearchModal"
import { DataTable } from "../../components/tables/DataTable"
import type { Producto } from "../../types"


export const VentasPage = () => {

    const [id, setId] = useState(null)

    const productos: Producto[] = []

    const displayId = id != null ? id : '--'

    const navigate = useNavigate();

    const columnas = [
        { header: 'Código de Barras', accessor: 'CodigoBarras' as keyof Producto},
        { header: 'Producto', accessor: 'Nombre' as keyof Producto },
        { header: 'Cantidad', accessor: 'StockActual' as keyof Producto },
        { header: 'Precio',   accessor: (row: Producto) => `$${row.Precio.toFixed(2)}` },
        { header: 'Subtotal', accessor: (row: any) => {
            const total = row.Cantidad * row.Precio; 
            return `$${total.toFixed(2)}`;
        } },
        { header: 'Acción',   accessor: (row: Producto) => (
            <button
            onClick={() => console.log('eliminar', row.IdProducto)}
            className="text-(--color-danger-text) hover:text-(--color-danger-border) transition-colors"
            >
            <IconTrash size={15} />
            </button>
        ),
        width: 'w-16'
        },
    ]


    return (
        <>
            <div className='flex flex-col flex-1 min-h-full'>

                <div className="flex flex-row">
                    <div className='w-4/6'>
                        <DataTable
                            columns={columnas}
                            data={productos}
                            emptyText="Escanea un código o usa Acceso Rápido para agregar artículos"
                        />
                    </div>

                    <div className='w-2/6'>
                        <div className='flex flex-col gap-3 p-3'>
                            <div className="w-3/4">
                                <div>
                                    <p className='text-sm font-medium text-(--color-text-main)'>Acceso rápido</p>
                                    <p className='text-xs text-(--color-text-muted)'>Top artículos</p>
                                </div>

                                
                            </div>

                            <div className="w-1/4">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <BottomBar 
                    btnsLeft={<>
                        <ActionButton label="Búscar Productos" icon={<IconSearch size={14} />} variant="gWhite" />
                        <ActionButton label="Producto Genérico" icon={<IconBaguette size={14} />} variant="gWhite" />
                        <ActionButton label="Ventas" icon={<IconTable size={14} />} variant="gWhite" />
                        <ActionButton label="Devolución" icon={<IconArrowLeftTail size={14} />} variant="gWhite" />
                        <ActionButton label="Cerrar Caja" icon={<IconMoneybag size={14} />} variant="gWhite" />
                    </>}
                    btnsRight={
                        <ActionButton 
                            label="Cancelar Venta"   
                            icon={<IconX size={14} />} 
                            variant='ghost' 
                            onClick={() => navigate('/')}    
                        />
                    }

                />
        </>
    )
}