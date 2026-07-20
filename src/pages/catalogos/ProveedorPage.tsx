// src/pages/catalogos/ProveedorPage.tsx
import { BottomBar } from "../../components/layout/BottomBar"
import { SectionCard } from "../../components/ui/SectionCard"
import { FormInput } from "../../components/forms/FormInput"
import { ActionButton } from "../../components/ui/ActionButton"
import { Badge } from "../../components/ui/Badge"
import { useState, useEffect } from "react"
import { IconTruck, IconForms, IconPhone, IconMapPin, IconSearch, 
         IconTable, IconArrowLeft, IconX, IconDeviceFloppy, IconCheck } from "@tabler/icons-react"
import { useNavigate } from 'react-router-dom'
import { proveedoresService } from "../../services/proveedoresService"
import { ModeToggle } from "../../components/forms/ModeToggle"
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Proveedor, NuevoProveedor } from '../../types'
import { SearchModal } from "../../components/ui/SearchModal"

const schema = z.object({
    nombre:    z.string().min(1, 'Requerido'),
    telefono:  z.string().nullable().default(null),
    direccion: z.string().nullable().default(null),
    activo:    z.boolean().default(true),
})

type ProveedorForm = z.infer<typeof schema>

export const ProveedorPage = () => {
    const [id, setId]           = useState<number | null>(null)
    const [open, setOpen]       = useState(false)
    const [mode, setMode]       = useState<'nuevo' | 'editar'>('nuevo')
    const [resultados, setResultados] = useState<Proveedor[]>([])

    const displayId = id != null ? id : '--'
    const navigate  = useNavigate()

    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<ProveedorForm>({
        resolver: zodResolver(schema as any),
        defaultValues: {
            nombre:    '',
            telefono:  null,
            direccion: null,
            activo:    true,
        }
    })

    const watchNombre    = watch('nombre')
    const nombreDisplay  = watchNombre || 'Nombre del proveedor'

    // Limpiar al cambiar a modo nuevo
    useEffect(() => {
        if (mode === 'nuevo') {
            setId(null)
            reset({
                nombre:    '',
                telefono:  null,
                direccion: null,
                activo:    true,
            })
        }
    }, [mode, reset])

    const onSubmit = async (data: ProveedorForm) => {
        try {
            if (mode === 'nuevo') {
                const guardado = await proveedoresService.create(data as NuevoProveedor)
                setId(guardado.idproveedor)
                setMode('editar')
                toast.success(`Proveedor guardado con ID ${guardado.idproveedor}`)
            } else {
                if (!id) {
                    toast.error('No hay un proveedor seleccionado para editar')
                    return
                }
                await proveedoresService.update(id, data as NuevoProveedor)
                toast.success('Proveedor actualizado con éxito')
                setMode('nuevo')
            }
        } catch (error) {
            toast.error(mode === 'nuevo' ? 'Error al guardar el proveedor' : 'Error al actualizar el proveedor')
            console.error(error)
        }
    }

    return (
        <>
            <div className='flex flex-col flex-1 gap-6 p-6 min-h-full justify-center mb-16'>

                {/* Header */}
                <div className="flex items-center gap-3 w-3/4 mx-auto">
                    <IconTruck size={18} className="text-(--color-text-muted)" />
                    <Badge
                        label={mode === 'nuevo' ? 'Nuevo' : 'Editando'}
                        variant={mode === 'nuevo' ? 'nuevo' : 'editando'}
                    />
                    <ModeToggle mode={mode} onChange={setMode} hasSelection={id !== null} />
                    <div className='ml-auto'>
                        <ActionButton
                            label={mode === 'nuevo' ? 'Guardar proveedor' : 'Guardar cambios'}
                            icon={mode === 'nuevo' ? <IconDeviceFloppy size={14} /> : <IconCheck size={14} />}
                            onClick={handleSubmit(onSubmit)}
                            variant="success"
                        />
                    </div>
                </div>

                {/* Tarjeta de perfil */}
                <div className="bg-(--color-surface) border border-(--color-border) rounded-xl px-5 py-4 flex items-center gap-4 w-3/4 mx-auto">
                    <div className="w-12 h-12 rounded-full bg-(--color-info-bg) border border-(--color-info-border) flex items-center justify-center text-lg font-medium text-(--color-info-text) shrink-0">
                        {watchNombre ? watchNombre.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-(--color-text-main)">{nombreDisplay}</p>
                        <p className="text-xs text-(--color-text-muted)">
                            {mode === 'nuevo' ? 'Completa el formulario para registrar' : 'Modificando registros del proveedor'}
                        </p>
                    </div>
                    <span className="text-xs text-(--color-text-muted) bg-(--color-background) border border-(--color-border) rounded-lg px-3 py-1.5">
                        ID: {displayId}
                    </span>
                </div>

                {/* Formulario */}
                <SectionCard label="Datos del Proveedor" icon={<IconTruck size={14} />}>
                    <FormInput
                        label="Nombre" icon={<IconForms size={13} />}
                        required placeholder="Ej. Distribuidora González"
                        width="1/3"
                        {...register('nombre')}
                        error={errors.nombre?.message}
                    />
                    <FormInput
                        label="Teléfono" icon={<IconPhone size={13} />}
                        type="tel" placeholder="Ej. 341 199 45 32"
                        width="1/3"
                        {...register('telefono')}
                    />
                    <FormInput
                        label="Dirección" icon={<IconMapPin size={13} />}
                        placeholder="Ej. Blvd. Tlaquepaque #100"
                        width="1/3"
                        {...register('direccion')}
                    />
                </SectionCard>

                {/* SearchModal */}
                <SearchModal
                    isOpen={open}
                    onClose={() => {
                        setOpen(false)
                        setResultados([])
                    }}
                    onSearch={async (q) => {
                        const data = await proveedoresService.search(q)
                        setResultados(data)
                    }}
                    onSelect={(proveedor: Proveedor) => {
                        setId(proveedor.idproveedor)
                        setMode('editar')
                        reset({
                            nombre:    proveedor.nombre,
                            telefono:  proveedor.telefono,
                            direccion: proveedor.direccion,
                            activo:    proveedor.activo,
                        })
                        setOpen(false)
                    }}
                    title="Buscar proveedor"
                    placeholder="Nombre del proveedor..."
                    columns={[
                        { header: 'Nombre',    accessor: 'nombre'    as keyof Proveedor },
                        { header: 'Teléfono',  accessor: 'telefono'  as keyof Proveedor },
                        { header: 'Dirección', accessor: 'direccion' as keyof Proveedor },
                    ]}
                    data={resultados}
                    emptyText="No se encontraron proveedores"
                />

            </div>

            <BottomBar
                btnsLeft={<>
                    <ActionButton
                        label="Búsqueda"
                        icon={<IconSearch size={14} />}
                        variant="gWhite"
                        onClick={async () => {
                            const data = await proveedoresService.search('')
                            setResultados(data)
                            setOpen(true)
                        }}
                    />
                    <ActionButton
                        label="Proveedores"
                        icon={<IconTable size={14} />}
                        variant="gWhite"
                        onClick={() => navigate('/consultas/proveedores')}
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