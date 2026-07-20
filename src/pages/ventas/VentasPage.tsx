// src/pages/ventas/VentasPage.tsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconSearch, IconTable, IconX, IconArrowLeftTail, 
         IconMoneybag, IconTrash, IconBaguette, IconCash,
         IconEdit } from '@tabler/icons-react'
import { BottomBar } from '../../components/layout/BottomBar'
import { ActionButton } from '../../components/ui/ActionButton'
import { DataTable } from '../../components/tables/DataTable'
import { QuickAccessGrid } from '../../components/pos/QuickAccessGrid'
import { QtyValue } from '../../components/pos/QtyValue'
import { accesorapidoService } from '../../services/accesorapidoService'
import type { Producto, ItemCarrito, AccesoRapidoCompleto } from '../../types'
import { SearchModal } from '../../components/ui/SearchModal'
import { productosService } from "../../services/productosService"


const UNIDADES_POR_PESO = ['Kg', 'Litro']

export const VentasPage = () => {
    const navigate = useNavigate()
    const [carrito, setCarrito] = useState<ItemCarrito[]>([])
    const [quickProductos, setQuickProductos] = useState<Producto[]>([])

    const [id, setId] = useState<number | null>(null)


    const [productoPendiente, setProductoPendiente] = useState<Producto | null>(null)
    const [precio, setPrecio] = useState<number>(0)
    const [peso, setPeso] = useState<number>(0)

    const [open, setOpen] = useState(false)
    const [resultados, setResultados] = useState<Producto[]>([])


    // Cargar productos del acceso rápido desde Superbase
    useEffect(() => {
        accesorapidoService.getAll().then((items: AccesoRapidoCompleto[]) => {
            const productos: Producto[] = items.map(i => ({
                idproducto:     i.idproducto,
                nombre:         i.nombre,
                precio:         i.precio,
                iddepartamento: i.iddepartamento,
                idproveedor:    null,
                codigobarras:   i.codigobarras,
                costo:          0,
                ganancia:       0,
                unidadmedida:   i.unidadmedida,
                stockminimo:    0,
                stockmaximo:    0,
                stockactual:    0,
                activo:         true,
            }))
            setQuickProductos(productos)
        })
    }, [])

    // Agregar al carrito
    const agregarDirecto = (producto: Producto) => {
        setCarrito(prev => {
            const existe = prev.find(i => i.producto.idproducto === producto.idproducto)
            if (existe) {
                return prev.map(i => 
                    i.producto.idproducto === producto.idproducto
                        ? { ...i, cantidad: i.cantidad + 1, importe: (i.cantidad + 1) * i.preciounitario} 
                        : i
                )
            }

            return [...prev, {
                producto,
                cantidad: 1,
                preciounitario: producto.precio,
                descuento: 0,
                importe: producto.precio,
            }]
        })
    }

    const agregarAlCarrito = (producto: Producto) => {
        const requierePeso = producto.unidadmedida != null
            && UNIDADES_POR_PESO.includes(producto.unidadmedida)

        if (requierePeso){

            setProductoPendiente(producto)
            setPrecio(0)
            setPeso(0)
            return
        }

        agregarDirecto(producto)
    }

    const manejarCambioPrecio = (nuevoPrecio: number) => {
        setPrecio(nuevoPrecio)
        if (productoPendiente && productoPendiente.precio > 0) {
            setPeso(nuevoPrecio / productoPendiente.precio)
        }
    }

    const manejarCambioPeso = (nuevoPeso: number) => {
        setPeso(nuevoPeso)
        if (productoPendiente) {
            setPrecio(nuevoPeso * productoPendiente.precio)
        }
    }

    const confirmarPorPeso = () => {
        if (!productoPendiente || peso <= 0) return

        const subtotal = precio * peso

        setCarrito(prev => [...prev, {
            producto: productoPendiente,
            cantidad: peso,
            preciounitario: precio,
            descuento: 0,
            importe: subtotal
        }])

        cerrarModalPeso()
    }

    const cerrarModalPeso = () => {
        setProductoPendiente(null)
        setPrecio(0)
        setPeso(0)
    }

    const quitarDelCarrito = (idproducto: number) => {
        setCarrito(prev => prev.filter(i => i.producto.idproducto !== idproducto))
    }

    // Cálculos de caja
    const subtotal  = carrito.reduce((acc, i) => acc + i.importe, 0)
    const descuento = 0
    const impuesto  = 0
    const total     = subtotal - descuento + impuesto

    const columnas = [
        { header: 'Código',   accessor: (row: ItemCarrito) => row.producto.codigobarras ?? '—' },
        { header: 'Artículo', accessor: (row: ItemCarrito) => row.producto.nombre },
        { header: 'Qty',      accessor: (row: ItemCarrito) => row.cantidad },
        { header: 'Precio',   accessor: (row: ItemCarrito) => `$${row.preciounitario.toFixed(2)}` },
        { header: 'Subtotal', accessor: (row: ItemCarrito) => `$${row.importe.toFixed(2)}` },
        { header: '',         accessor: (row: ItemCarrito) => (
            <button
                onClick={() => quitarDelCarrito(row.producto.idproducto)}
                className="text-(--color-danger-text) hover:text-(--color-danger-border) transition-colors"
            >
                <IconTrash size={15} />
            </button>
        ), width: 'w-12' },
    ]


    return (
        <>
            <div className='flex flex-1 overflow-hidden'>

                {/* ── Izquierda: tabla del carrito ── */}
                <div className='flex flex-col flex-1 border-r border-(--color-border) w-2/3'>
                    <DataTable
                        columns={columnas}
                        data={carrito}
                        emptyText="Escanea un código o usa Acceso Rápido para agregar artículos"
                    />
                </div>

                {/* ── Derecha: Acceso Rápido + Caja ── */}
                <div className='flex flex-col w-1/3 shrink-0 bg-(--color-surface)'>

                    {/* Encabezado con botón editar */}
                    <div className='flex items-center justify-between px-3 pt-3'>
                        <div>
                            <p className='text-sm font-medium text-(--color-text-main)'>Acceso rápido</p>
                            <p className='text-xs text-(--color-text-muted)'>Top artículos</p>
                        </div>
                        <button
                            onClick={() => navigate('/secciones/accesorapido')}
                            className='text-xs text-(--color-text-muted) hover:text-(--color-text-main) flex items-center gap-1 transition-colors'
                        >
                            <IconEdit size={13} />
                            Editar
                        </button>
                    </div>

                    {/* Grid */}
                    <QuickAccessGrid
                        productos={quickProductos}
                        onSelect={agregarAlCarrito}
                    />

                    {/* Caja */}
                    <div className='border-t border-(--color-border) bg-(--color-surface) p-3 flex flex-col gap-2'>
                        <p className='text-xs font-medium uppercase tracking-wide text-(--color-text-muted)'>Caja</p>
                        <div className='flex flex-col gap-1'>
                            <div className='flex justify-between text-xs text-(--color-text-muted)'>
                                <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className='flex justify-between text-xs text-(--color-success-text)'>
                                <span>Descuento</span><span>-${descuento.toFixed(2)}</span>
                            </div>
                            <div className='flex justify-between text-xs text-(--color-text-muted)'>
                                <span>Impuesto</span><span>${impuesto.toFixed(2)}</span>
                            </div>
                            <div className='flex justify-between text-sm font-medium text-(--color-text-main) pt-2 border-t border-(--color-border)'>
                                <span>Total</span><span>${total.toFixed(2)}</span>
                            </div>
                        </div>
                        <button className='w-full py-3 bg-green-700 hover:bg-green-800 text-white text-sm font-medium rounded-xl flex items-center justify-center gap-2 transition-colors'>
                            <IconCash size={16} />
                            Cobrar
                        </button>
                    </div>

                </div>
            </div>

            {/* ── Modal: capturar precio/peso antes de agregar ── */}
            {productoPendiente && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={cerrarModalPeso}
                    />
                    <div className="relative z-10 bg-(--color-surface) rounded-2xl shadow-xl w-full max-w-sm mx-4 p-5 flex flex-col gap-4">
 
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-(--color-text-main)">
                                {productoPendiente.nombre}
                            </h3>
                            <button
                                onClick={cerrarModalPeso}
                                className="text-(--color-text-muted) hover:text-(--color-text-main)"
                            >
                                <IconX size={16} />
                            </button>
                        </div>
 
                        <div className="flex gap-3">
                            <QtyValue
                                precio={precio}
                                peso={peso}
                                onPrecioChange={manejarCambioPrecio} 
                                onPesoChange={manejarCambioPeso}
                            />
                        </div>
 
                        <div className="flex justify-between items-center px-3 py-2 bg-(--color-success-bg) border border-(--color-success-border) rounded-lg">
                            <span className="text-xs font-medium text-(--color-success-text)">Subtotal</span>
                            <span className="text-base font-semibold text-(--color-success-text)">
                                ${(precio * peso).toFixed(2)}
                            </span>
                        </div>
 
                        <ActionButton
                            label="Agregar a la venta"
                            icon={<IconCash size={14} />}
                            variant="success"
                            disabled={peso <= 0}
                            onClick={confirmarPorPeso}
                        />
                    </div>
                </div>
            )}

                <SearchModal 
                    isOpen={open}
                    onClose={() => {
                        setOpen(false)
                        setResultados([])
                    }}
                    onSearch={async (q) => {
                        const data = await productosService.search(q)
                        setResultados(data)
                    }}
                   onSelect={(producto: Producto) => {
                        agregarAlCarrito(producto); 
                        setOpen(false);
                    }}
                    title="Buscar producto"
                    placeholder="Nombre o Código de barras..."
                    columns={[
                        { header: 'Código de Barras', accessor: 'codigobarras' as keyof Producto },
                        { header: 'Nombre', accessor: 'nombre' as keyof Producto },
                        { header: 'Precio', accessor: 'precio' as keyof Producto }
                    ]}
                    data={resultados}
                    emptyText="No se encontraron productos"
                />

            <BottomBar
                btnsLeft={<>
                    <ActionButton 
                            label="Búsqueda" 
                            icon={<IconSearch size={14} />} 
                            variant="gWhite" 
                            onClick={async () => {
                                const data = await productosService.search('')
                                setResultados(data)
                                setOpen(true)
                            }}
                        />
                    <ActionButton label="Producto Genérico" icon={<IconBaguette     size={14} />} variant="gWhite" />
                    <ActionButton label="Ventas"            icon={<IconTable        size={14} />} variant="gWhite" />
                    <ActionButton label="Devolución"        icon={<IconArrowLeftTail size={14} />} variant="gWhite" />
                    <ActionButton label="Cerrar Caja"       icon={<IconMoneybag     size={14} />} variant="gWhite" />
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