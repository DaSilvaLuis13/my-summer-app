// src/pages/secciones/AccesoRapido.tsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconArrowLeft, IconPlus, IconTrash } from '@tabler/icons-react'
import { BottomBar } from '../../components/layout/BottomBar'
import { ActionButton } from '../../components/ui/ActionButton'
import { SearchModal } from '../../components/ui/SearchModal'
import { ProductButton } from '../../components/pos/ProductButton'
import { accesorapidoService } from '../../services/accesorapidoService'
import { productosService } from '../../services/productosService'
import type { AccesoRapidoCompleto, Producto } from '../../types'
import toast from 'react-hot-toast'

export const AccesoRapido = () => {
    const navigate = useNavigate()

    const [items,      setItems]      = useState<AccesoRapidoCompleto[]>([])
    const [open,       setOpen]       = useState(false)
    const [resultados, setResultados] = useState<Producto[]>([])
    const [loading,    setLoading]    = useState(true)

    const cargar = async () => {
        try {
            setLoading(true)
            const data = await accesorapidoService.getAll()
            setItems(data)
        } catch {
            toast.error('Error al cargar acceso rápido')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { cargar() }, [])

    const agregar = async (producto: Producto) => {
        const existe = items.find(i => i.idproducto === producto.idproducto)
        if(existe) {
            toast.error(`${producto.nombre} ya está en acceso rápido`)
            setOpen(false)
            return
        }
        try {
            await accesorapidoService.add(producto.idproducto)
            toast.success(`${producto.nombre} agregado`)
            setOpen(false)
            cargar()
        } catch {
            toast.error('Error al agregar producto')
        }
    }

    const quitar = async (item: AccesoRapidoCompleto) => {
        try {
            await accesorapidoService.remove(item.idacceso)
            toast.success(`${item.nombre} eliminado`)
            cargar()
        } catch {
            toast.error('Error al quitar producto')
        }
    }

    return (
        <>
            <div className='flex flex-col flex-1 gap-4 p-6 mb-16'>

                {/* Hearder */}
                <div className='flex items-center justify-between w-3/4 mx-auto'>
                    <div>
                        <p className='text-sm font-medium text-(--color-text-main)'>Acceso rápido</p>
                        <p className='text-xs text-(--color-text-muted)'>
                            {items.length} producto{items.length !== 1 ? 's': ''} configurado{items.length !== 1 ? 's' : ''}
                        </p>
                    </div>

                    <ActionButton
                        label="Agregar producto"
                        icon={<IconPlus size={14} />}
                        variant="success"
                        fullWidth={false}
                        onClick={async () => {
                            const data = await productosService.search('')
                            setResultados(data)
                            setOpen(true)
                        }}
                    />
                </div>
                
                {/* Grid de productos configurados */}
                <div className='w-3/4 mx-auto flex-1'>
                    {loading ? (
                        <p className='text-xs text-(--color-text-muted) text-center py-10'>Cargando...</p>
                    ) : items.length === 0 ? (
                        <div className='flex items-center justify-center py-16 border border-dashed border-(--color-border) rounded-xl'>
                            <p className='text-xs text-(--color-text-muted)'>
                                No hay productos en el acceso rápido. Agrega uno con el botón de arriba.
                            </p>
                        </div>
                    ) : (
                        <div className='grid grid-cols-6 gap-3'>
                            {items.map(item => (
                                <div key={item.idacceso} className='relative group'>

                                    <ProductButton 
                                        producto={{
                                            idproducto:     item.idproducto,
                                            nombre:         item.nombre,
                                            precio:         item.precio,
                                            iddepartamento: item.iddepartamento,
                                            idproveedor:    null,
                                            codigobarras:   item.codigobarras,
                                            costo:          0,
                                            ganancia:       0,
                                            unidadmedida:   item.unidadmedida,
                                            stockminimo:    0,
                                            stockmaximo:    0,
                                            stockactual:    0,
                                            activo:         true,
                                        }}
                                        onClick={() => {}}
                                    />

                                    <button
                                        onClick={() => quitar(item)}
                                        className='absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-(--color-danger-border) text-white
                                                   items-center justify-center hidden group-hover:flex transition-all'
                                        title="Quitar de acceso rápido"
                                    >
                                        <IconTrash size={11} />
                                    </button>

                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {/* SearchModal para buscar y agregar */}
                <SearchModal
                    isOpen={open}
                    onClose={() => { setOpen(false); setResultados([]) }}
                    onSearch={async (q) => {
                        const data = await productosService.search(q)
                        setResultados(data)
                    }}
                    onSelect={agregar}
                    title="Agregar producto al acceso rápido"
                    placeholder="Nombre o código de barras..."
                    columns={[
                        { header: 'Código', accessor: 'codigobarras' as keyof Producto },
                        { header: 'Nombre', accessor: 'nombre'       as keyof Producto },
                        { header: 'Precio', accessor: (p: Producto) => `$${p.precio.toFixed(2)}` },
                    ]}
                    data={resultados}
                    emptyText="No se encontraron productos"
                />

            </div>
            <BottomBar
                btnsLeft={<>
                    <ActionButton
                        label="Regresar"
                        icon={<IconArrowLeft size={14} />}
                        variant="gWhite"
                        onClick={() => navigate('/')}
                    />
                </>}
            />

        </>
    )



}