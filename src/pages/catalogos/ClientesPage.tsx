// src/pages/catalogos/ClientesPage.tsx
import { BottomBar } from "../../components/layout/BottomBar"
import { SectionCard } from "../../components/ui/SectionCard"
import { FormInput } from "../../components/forms/FormInput"
import { ActionButton } from "../../components/ui/ActionButton"
import { Badge } from "../../components/ui/Badge"
import { useState, useEffect } from "react"
import { IconUser, IconForms, IconPhone, IconCreditCard, IconCoin, IconCoins, IconSearch, IconTable, IconArrowLeft, IconX, IconDeviceFloppy, IconCheck } from "@tabler/icons-react"
import { useNavigate } from 'react-router-dom';
import { clientesService } from "../../services/clientesService"
import { ModeToggle } from "../../components/forms/ModeToggle"
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Cliente, NuevoCliente } from '../../types'
import { SearchModal } from "../../components/ui/SearchModal"

// 1. Esquema Zod completamente en minúsculas
const schema = z.object({
    nombre: z.string().min(1, 'Requerido'),
    apellidopaterno:   z.string().min(1, 'Requerido'),
    apellidomaterno:   z.string().nullable().default(null),
    telefono:          z.string().nullable().default(null),
    domicilio:         z.string().nullable().default(null),
    limitecredito:     z.coerce.number().min(0).default(0),
    creditodisponible: z.coerce.number().min(0).default(0),
    activo:            z.boolean().default(true),
})

type ClienteForm = z.infer<typeof schema>

export const ClientesPage = () => {
    const [id, setId] = useState<number | null>(null)
    const [open, setOpen] = useState(false)
    const [mode, setMode] = useState<'nuevo' | 'editar'>('nuevo')
    
    // Estado real para llenar el modal de búsqueda
    const [clientes, setClientes] = useState<Cliente[]>([])

    const [resultados, setResultados] = useState<Cliente[]>([])
    const [query, setQuery] = useState('')

    const displayId = id != null ? id : '--'
    const navigate = useNavigate();
    
    // 2. React Hook Form con llaves en minúsculas
    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<ClienteForm>({
        resolver: zodResolver(schema as any),
        defaultValues: {
            nombre: '',
            apellidopaterno: '',
            apellidomaterno: null,
            telefono: null,
            domicilio: null,
            limitecredito: 0,
            creditodisponible: 0,
            activo: true
        }
    })

    // Escucha en tiempo real el nombre para actualizar la tarjeta de perfil de forma reactiva
    const watchNombre = watch('nombre')
    const watchApellido = watch('apellidopaterno')
    const nombreCompleto = watchNombre || watchApellido ? `${watchNombre} ${watchApellido}`.trim() : 'Nombre del cliente'

    // Cargar los clientes para cuando se abra el buscador
    const cargarClientesBuscador = async () => {
        try {
            const data = await clientesService.getAll()
            setClientes(data)
        } catch (error) {
            console.error("Error al cargar clientes para el buscador", error)
        }
    }

    useEffect(() => {
        cargarClientesBuscador()
    }, [open]) // Se actualiza cada vez que abren el modal de búsqueda

    // 3. Limpiar formulario al cambiar a modo "nuevo"
    useEffect(() => {
        if (mode === 'nuevo') {
            setId(null)
            reset({
                nombre: '',
                apellidopaterno: '',
                apellidomaterno: null,
                telefono: null,
                domicilio: null,
                limitecredito: 0,
                creditodisponible: 0,
                activo: true
            })
        }
    }, [mode, reset])

    useEffect(() => {
        const buscar = async () => {
            const data = await clientesService.search(query)
            setResultados(data)
        }
        buscar()
    }, [query])

    const onSubmit = async (data: ClienteForm) => {
        try {
            if (mode === 'nuevo') {
                const guardado = await clientesService.create(data as NuevoCliente);
                setId(guardado.idcliente)
                setMode('editar') // Cambiamos a editar tras guardar exitosamente
                toast.success(`Cliente guardado con ID ${guardado.idcliente}`)
            } else {
                if (!id) {
                    toast.error('No hay un cliente seleccionado para editar')
                    return
                }
                const actualizado = await clientesService.update(id, data as NuevoCliente);
                toast.success(`Cliente ${actualizado.idcliente} actualizado con éxito`);
                setMode('nuevo')
            }
        } catch (error) {
            toast.error(mode === 'nuevo' ? 'Error al guardar el cliente' : 'Error al actualizar el cliente');
            console.error(error)
        }
    }

    return (
        <>
            <div className='flex flex-col flex-1 gap-6 p-6 min-h-full justify-center mb-16'>

                {/* Header */}
                <div className="flex items-center gap-3 w-3/4 mx-auto">
                    <IconUser size={18} className="text-(--color-text-muted)" />
                        
                    <Badge 
                        label={mode === 'nuevo' ? 'Nuevo' : 'Editando'} 
                        variant={mode === 'nuevo' ? 'nuevo' : 'editando'} 
                    />

                    <ModeToggle mode={mode} onChange={setMode} hasSelection={id !== null} />
                    
                    <div className='ml-auto'>
                        <ActionButton 
                            label={mode === 'nuevo' ? 'Guardar cliente' : 'Guardar cambios'} 
                            icon={mode === 'nuevo' ? <IconDeviceFloppy size={14} /> : <IconCheck size={14} />} 
                            onClick={handleSubmit(onSubmit)}
                            
                            variant="success" 
                        />
                    </div>
                </div>

                {/* Tarjeta de perfil dinámica */}
                <div className="bg-(--color-surface) border border-(--color-border) rounded-xl px-5 py-4 flex items-center gap-4 w-3/4 mx-auto">
                    <div className="w-12 h-12 rounded-full bg-(--color-info-bg) border border-(--color-info-border) flex items-center justify-center text-lg font-medium text-(--color-info-text) shrink-0">
                        {watchNombre ? watchNombre.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-(--color-text-main)">{nombreCompleto}</p>
                        <p className="text-xs text-(--color-text-muted)">
                            {mode === 'nuevo' ? 'Completa el formulario para registrar' : 'Modificando registros del cliente'}
                        </p>
                    </div>
                    <span className="text-xs text-(--color-text-muted) bg-(--color-background) border border-(--color-border) rounded-lg px-3 py-1.5">
                        ID: {displayId}
                    </span>
                </div>

                {/* 4. Inputs enlazados mediante {...register('campo')} */}
                <SectionCard label="Datos Personales" icon={<IconUser size={14} />}>
                    <FormInput label="Nombre" icon={<IconForms size={13} />} required placeholder="Ej. Héctor" width="1/3" {...register('nombre')} error={errors.nombre?.message} />
                    <FormInput label="Apellido Paterno" icon={<IconForms size={13} />} required placeholder="Ej. Vargas" width="1/3" {...register('apellidopaterno')} error={errors.apellidopaterno?.message} />
                    <FormInput label="Apellido Materno" icon={<IconForms size={13} />} placeholder="Ej. Sánchez" width="1/3" {...register('apellidomaterno')} /> 
                    <FormInput label="Teléfono" icon={<IconPhone size={13} />} required placeholder="341 199 2832" type="tel" width="1/3" {...register('telefono')} />
                    <FormInput label="Domicilio" icon={<IconForms size={13} />} placeholder="Ej. Cananiro #13..." width="2/3" {...register('domicilio')} />
                </SectionCard>

                <SectionCard label="Crédito (fiado)" icon={<IconCreditCard size={14} />}>
                    <FormInput label="Límite de crédito" icon={<IconCoin size={13} />} placeholder="$0.00" hint="Monto máximo de fiado permitido" type="number" width="1/2" {...register('limitecredito')} />
                    <FormInput label="Crédito disponible" icon={<IconCoins size={13} />} placeholder="$0.00" hint="Saldo restante disponible" success width="1/2" {...register('creditodisponible')} />
                </SectionCard>

                {/* 5. Modal de Búsqueda con accesores corregidos a minúsculas */}
                <SearchModal 
                    isOpen={open}
                    onClose={() => {
                        setOpen(false)
                        setResultados([])
                    }}
                    onSearch={async (q) => {
                        const data = await clientesService.search(q)
                        setResultados(data)
                    }}
                    onSelect={(cliente: Cliente) => {
                        setId(cliente.idcliente)
                        setMode('editar')
                        reset({
                            nombre:            cliente.nombre,
                            apellidopaterno:   cliente.apellidopaterno,
                            apellidomaterno:   cliente.apellidomaterno,
                            telefono:          cliente.telefono,
                            domicilio:         cliente.domicilio,
                            limitecredito:     Number(cliente.limitecredito),
                            creditodisponible: Number(cliente.creditodisponible),
                            activo:            cliente.activo,
                        })
                        setOpen(false)
                    }}
                    title="Buscar cliente"
                    placeholder="Nombre o Apellidos..."
                    columns={[
                        { header: 'Nombre', accessor: 'nombre' as keyof Cliente },
                        { header: 'A. Paterno', accessor: 'apellidopaterno' as keyof Cliente },
                        { header: 'A. Materno', accessor: 'apellidomaterno' as keyof Cliente }
                    ]}
                    data={resultados}
                    emptyText="No se encontraron clientes"
                />
           
            </div>
            <BottomBar 
                btnsLeft={<>
                    <ActionButton 
                        label="Búsqueda" 
                        icon={<IconSearch size={14} />} 
                        variant="gWhite" 
                        onClick={async () => {
                            const data = await clientesService.search('')
                            setResultados(data)
                            setOpen(true)
                        }}
                    />
                    <ActionButton 
                        label="Clientes" 
                        icon={<IconTable size={14} />} 
                        variant="gWhite" 
                        onClick={() => navigate('/consultas/clientes')}
                    />
                    <ActionButton 
                        label="Cancelar" 
                        icon={<IconX size={14} />} 
                        variant="gWhite" 
                        onClick={() => setMode('nuevo')} 
                    />
                </>}
                btnsRight={
                    <ActionButton 
                        label="Regresar"   
                        icon={<IconArrowLeft size={14} />} 
                        variant='ghost' 
                        onClick={() => navigate('/')}    
                    />
                }
            />
        </>
    )
}