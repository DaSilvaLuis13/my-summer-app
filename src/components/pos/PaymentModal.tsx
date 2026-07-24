// src/components/pos/PaymentModal.tsx
import { useState } from 'react'
import { IconCreditCard, IconX, IconCash, IconFileInvoice, 
         IconPrinter, IconPrinterOff, IconCashRegister, IconCheck } from '@tabler/icons-react'
import { ActionButton } from '../ui/ActionButton'
import { SearchModal } from '../ui/SearchModal'
import type { Cliente, MetodoCobro } from '../../types'
import { clientesService } from '../../services/clientesService'

interface PaymentModalProps {
    isOpen:    boolean
    total:     number
    numeroVenta: number
    cantidadArticulos: number
    onClose:   () => void
    onConfirm: (metodo: MetodoCobro, pagado: number, cambio: number, imprimir: boolean, cliente?: Cliente) => void
}


export const PaymentModal = ({
    isOpen,
    total,
    numeroVenta,
    cantidadArticulos,
    onClose,
    onConfirm,
}: PaymentModalProps) => {

    const [metodo, setMetodo] = useState<MetodoCobro>('efectivo')
    const [pagado, setPagado] = useState<number>(0)
    const [imprimir, setImprimir] = useState(true)

    // Cliente para fiado
    const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null)
    const [openBuscarCliente, setOpenBuscarCliente] = useState(false)
    const [resultadosClientes, setResultadosClientes] = useState<Cliente[]>([])

    if (!isOpen) return null

    const cambio = pagado - total
    const cambioValido = metodo === 'efectivo' ? pagado >= total : true
    const fiadoValido = metodo === 'fiado' ? clienteSeleccionado !== null : true
    const puedeConfirmar = cambioValido && fiadoValido

    const cerrarYLimpiar = () => {
        setMetodo('efectivo')
        setPagado(0)
        setImprimir(true)
        setClienteSeleccionado(null)
        onClose()
    }

    const confirmar = () => {
        if (!puedeConfirmar) return
        const montoFinal = metodo === 'fiado' ? total : pagado
        const cambioFinal = metodo === 'efectivo' ? cambio : 0
        onConfirm(metodo, montoFinal, cambioFinal, imprimir, clienteSeleccionado ?? undefined)
        cerrarYLimpiar()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={cerrarYLimpiar} />

            <div className="relative z-10 bg-(--color-surface) rounded-2xl shadow-xl w-full max-w-md mx-4 flex flex-col overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-(--color-border)">
                    <div>
                        <p className="text-sm font-medium text-(--color-text-main)">Cobrar venta</p>
                        <p className="text-xs text-(--color-text-muted)">
                            Venta #{numeroVenta.toString().padStart(5, '0')} · {cantidadArticulos} artículos
                        </p>
                    </div>
                    <button onClick={cerrarYLimpiar} className="text-(--color-text-muted) hover:text-(--color-text-main)">
                        <IconX size={18} />
                    </button>
                </div>

                {/* Total a cobrar */}
                <div className="flex items-center justify-between px-5 py-4 bg-(--color-success-bg) border-b border-(--color-success-border)">
                    <span className="text-xs font-medium text-(--color-success-text) flex items-center gap-1.5">
                        <IconCheck size={14} /> Total a cobrar
                    </span>
                    <span className="text-2xl font-semibold text-(--color-success-text)">
                        ${total.toFixed(2)}
                    </span>
                </div>

                <div className="flex flex-col gap-4 px-5 py-4">

                    {/* Método de pago */}
                    <div className="flex flex-col gap-2">
                        <span className="text-xs font-medium uppercase tracking-wide text-(--color-text-muted)">
                            Método de pago
                        </span>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                onClick={() => setMetodo('efectivo')}
                                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-colors ${
                                    metodo === 'efectivo'
                                        ? 'border-(--color-info-border) bg-(--color-info-bg) text-(--color-info-text)'
                                        : 'border-(--color-border) bg-(--color-background) text-(--color-text-muted)'
                                }`}
                            >
                                <IconCash size={20} />
                                <span className="text-xs font-medium">Efectivo</span>
                            </button>

                            <button
                                onClick={() => setMetodo('tarjeta')}
                                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-colors ${
                                    metodo === 'tarjeta'
                                        ? 'border-(--color-info-border) bg-(--color-info-bg) text-(--color-info-text)'
                                        : 'border-(--color-border) bg-(--color-background) text-(--color-text-muted)'
                                }`}
                            >
                                <IconCreditCard size={20} />
                                <span className="text-xs font-medium">Tarjeta</span>
                            </button>

                            <button
                                onClick={() => setMetodo('fiado')}
                                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-colors ${
                                    metodo === 'fiado'
                                        ? 'border-(--color-info-border) bg-(--color-info-bg) text-(--color-info-text)'
                                        : 'border-(--color-border) bg-(--color-background) text-(--color-text-muted)'
                                }`}
                            >
                                <IconFileInvoice size={20} />
                                <span className="text-xs font-medium">Fiado</span>
                            </button>
                        </div>
                    </div>

                    {/* Contenido según método */}
                    {metodo === 'efectivo' && (
                        <div className="flex flex-col gap-2">
                            <span className="text-xs font-medium uppercase tracking-wide text-(--color-text-muted)">
                                Pago recibido
                            </span>
                            <div className="flex items-center gap-2 bg-(--color-background) border border-(--color-border) rounded-lg px-3 py-2">
                                <span className="text-sm text-(--color-text-muted)">$</span>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    value={pagado || ''}
                                    onChange={(e) => setPagado(Number(e.target.value))}
                                    className="flex-1 bg-transparent text-sm outline-none text-(--color-text-main)"
                                />
                            </div>

                            

                            {/* Cambio */}
                            <div className={`flex items-center justify-between px-3 py-2 rounded-lg border ${
                                cambio >= 0 
                                    ? 'bg-(--color-background) border-(--color-border)' 
                                    : 'bg-(--color-danger-bg) border-(--color-danger-border)'
                            }`}>
                                <span className={`text-xs font-medium ${cambio >= 0 ? 'text-(--color-text-muted)' : 'text-(--color-danger-text)'}`}>
                                    Cambio
                                </span>
                                <span className={`text-sm font-semibold ${cambio >= 0 ? 'text-(--color-text-main)' : 'text-(--color-danger-text)'}`}>
                                    {pagado > 0 ? `$${Math.abs(cambio).toFixed(2)}` : '—'}
                                </span>
                            </div>
                        </div>
                    )}

                    {metodo === 'tarjeta' && (
                        <div className="flex items-center justify-center py-6 text-xs text-(--color-text-muted)">
                            {/* Pendiente: integración con terminal de pago */}
                            Confirma el cobro directamente en la terminal
                        </div>
                    )}

                    {metodo === 'fiado' && (
                        <div className="flex flex-col gap-2">
                            <span className="text-xs font-medium uppercase tracking-wide text-(--color-text-muted)">
                                Cliente
                            </span>
                            {clienteSeleccionado ? (
                                <div className="flex items-center justify-between px-3 py-2 bg-(--color-background) border border-(--color-border) rounded-lg">
                                    <span className="text-sm text-(--color-text-main)">
                                        {clienteSeleccionado.nombre} {clienteSeleccionado.apellidopaterno}
                                    </span>
                                    <button
                                        onClick={async () => {
                                            const data = await clientesService.search('')
                                            setResultadosClientes(data)
                                            setOpenBuscarCliente(true)
                                        }}
                                        className="text-xs text-(--color-info-text)"
                                    >
                                        Cambiar
                                    </button>
                                </div>
                            ) : (
                                <ActionButton
                                    label="Seleccionar cliente"
                                    icon={<IconFileInvoice size={14} />}
                                    variant="gWhite"
                                    onClick={async () => {
                                        const data = await clientesService.search('')
                                        setResultadosClientes(data)
                                        setOpenBuscarCliente(true)
                                    }}
                                />
                            )}
                        </div>
                    )}

                    <hr className="border-(--color-border)" />

                    {/* Imprimir ticket */}
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-(--color-text-main)">Imprimir ticket</p>
                            <p className="text-xs text-(--color-text-muted)">Recibo para el cliente</p>
                        </div>
                        <div className="flex border border-(--color-border) rounded-lg overflow-hidden">
                            <button
                                onClick={() => setImprimir(true)}
                                className={`flex items-center gap-1 px-3 py-1.5 cursor-pointer text-xs font-medium transition-colors ${
                                    imprimir ? 'bg-(--color-navbar) text-(--color-success-text)' : 'text-(--color-text-muted)'
                                }`}
                            >
                                <IconPrinter size={13} /> Sí
                            </button>
                            <button
                                onClick={() => setImprimir(false)}
                                className={`flex items-center gap-1 px-3 py-1.5 cursor-pointer text-xs font-medium transition-colors ${
                                    !imprimir ? 'bg-(--color-navbar) text-(--color-danger-text)' : 'text-(--color-text-muted)'
                                }`}
                            >
                                <IconPrinterOff size={13} /> No
                            </button>
                        </div>
                    </div>

                    {/* Acciones */}
                    <div className='flex flex-row justify-between'>
                        <ActionButton
                            label="Confirmar cobro"
                            icon={<IconCashRegister size={14} />}
                            variant="success"
                            disabled={!puedeConfirmar}
                            onClick={confirmar}
                            
                        />
                        <ActionButton
                            label="Cancelar venta"
                            icon={<IconX size={14} />}
                            variant="danger"
                            onClick={cerrarYLimpiar}
                        />
                    </div>

                </div>
            </div>

            {/* Modal de búsqueda de cliente para fiado */}
            <SearchModal
                isOpen={openBuscarCliente}
                onClose={() => { setOpenBuscarCliente(false); setResultadosClientes([]) }}
                onSearch={async (q) => {
                    const data = await clientesService.search(q)
                    setResultadosClientes(data)
                }}
                onSelect={(cliente: Cliente) => {
                    setClienteSeleccionado(cliente)
                    setOpenBuscarCliente(false)
                }}
                title="Buscar cliente"
                placeholder="Nombre o apellidos..."
                columns={[
                    { header: 'Nombre',     accessor: 'nombre'          as keyof Cliente },
                    { header: 'A. Paterno', accessor: 'apellidopaterno' as keyof Cliente },
                    { header: 'A. Materno', accessor: 'apellidomaterno' as keyof Cliente },
                ]}
                data={resultadosClientes}
                emptyText="No se encontraron clientes"
            />
        </div>
    )
}