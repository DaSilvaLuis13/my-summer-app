import { BottomBar } from "../../components/layout/BottomBar"
import { SectionCard } from "../../components/ui/SectionCard"
import { FormInput } from "../../components/forms/FormInput"
import { ActionButton } from "../../components/ui/ActionButton"
import { Badge } from "../../components/ui/Badge"
import { useState, useEffect } from "react"
import { IconSearch, IconTable, IconArrowLeft, IconX, IconStack, IconCash, IconTrendingUp, 
         IconCoins, IconBarcode, IconBox, 
         IconDeviceFloppy,
         IconCheck} from "@tabler/icons-react"
import { useNavigate } from 'react-router-dom';
import { productosService } from "../../services/productosService"
import { ModeToggle } from "../../components/forms/ModeToggle"
import toast from "react-hot-toast"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from 'zod'
import type { Producto, NuevoProducto } from "../../types"
import { SearchModal } from "../../components/ui/SearchModal"


const schema = z.object({
    codigobarras: z.string().min(1, 'Requerido'),
    nombre: z.string().min(1, 'Requerido'),
    iddepartamento: z.coerce.number().min(0).default(0),
    idproveedor: z.coerce.number().min(0).default(0),
    costo: z.coerce.number().min(0).default(0),
    ganancia: z.coerce.number().min(0).default(0),
    precio: z.coerce.number().min(0).default(0),
    unidadmedida: z.string().nullable().default(null),
    stockminimo: z.coerce.number().min(0).default(0),
    stockmaximo: z.coerce.number().min(0).default(0),
    stockactual: z.coerce.number().min(0).default(0),
    activo: z.boolean().default(true),
})

type ProductoForm = z.infer<typeof schema>


export const ProductosPage = () => {

    const [id, setId] = useState<number | null>(null)
    const [open, setOpen] = useState(false)
    const [mode, setMode] = useState<'nuevo' | 'editar'>('nuevo')


    const [productos, setProductos] = useState<Producto[]>([])

    const [resultados, setResultados] = useState<Producto[]>([])
    const [query, setQuery] = useState('')

    const displayId = id != null ? id : '--'
    const navigate = useNavigate();

    const { register, handleSubmit, reset, watch, formState: {errors} } = useForm<ProductoForm>({
        resolver: zodResolver(schema as any),
        defaultValues: {
            nombre: '',
            codigobarras: '',
            iddepartamento: 0,
            idproveedor: 0,
            costo: 0,
            ganancia: 0,
            precio: 0,
            unidadmedida: '',
            stockminimo: 0,
            stockmaximo: 0,
            stockactual: 0,
            activo: true
        }
    })

    const cargarProductosBuscador = async () => {
        try {
            const data = await productosService.getAll()
            setProductos(data)
        } catch (error) {
            console.error('Error al cargar productos para el buscador', error)
        }
    }

    useEffect(() => {
        cargarProductosBuscador()
    }, [open])

    useEffect(() => {
        if(mode === 'nuevo') {
            setId(null)
            reset({
                nombre: '',
                codigobarras: '',
                iddepartamento: 0,
                idproveedor: 0,
                costo: 0,
                ganancia: 0,
                precio: 0,
                unidadmedida: '',
                stockminimo: 0,
                stockmaximo: 0,
                stockactual: 0,
                activo: true
            })
        }
    }, [mode, reset])

    useEffect(() => {
        const buscar = async () => {
            const data = await productosService.search(query)
            setResultados(data)
        }
        buscar()
    }, [query])

    const onSubmit = async (data: ProductoForm) => {
        try {
            if (mode === 'nuevo') {
                const guardado = await productosService.create(data as NuevoProducto);
                setId(guardado.idproducto)
                setMode('editar')
                toast.success(`Producto guardado con ID ${guardado.idproducto}`)
            } else {
                if(!id) {
                    toast.error('No hay producto seleccionado para editar')
                    return
                }
                const actualizado = await productosService.update(id, data as NuevoProducto);
                toast.success(`Producto ${actualizado.idproducto} actualizado con éxito`);
                setMode('nuevo')
            }
        } catch (error) {
            toast.error(mode === 'nuevo' ? 'Error al guardar el producto' : 'Error al actualizar el producto');
            console.error(error)
        }
    }


    return (
        <>
            <div className='flex flex-col flex-1 gap-6 p-6 min-h-full justify-center'>

                {/* Header */}
                <div className="flex items-center gap-3 w-3/4 mx-auto">
                    <IconBox size={18} className="text-(--color-text-muted)" />
                    <Badge 
                        label={mode === 'nuevo' ? 'Nuevo' : 'Editar'} 
                        variant={mode === 'nuevo' ? 'nuevo' : 'editando'} 
                    />

                    <ModeToggle 
                        mode={mode} 
                        onChange={setMode} 
                        hasSelection={id !== null}
                    />

                    <div className='ml-auto'>
                        <ActionButton 
                            label={mode === 'nuevo' ? 'Guardar producto' : 'Guardar cambios'} 
                            icon={mode === 'nuevo' ? <IconDeviceFloppy size={14} /> : <IconCheck size={14} />} 
                            onClick={handleSubmit(onSubmit)}
                            
                            variant="success" 
                        />
                    </div>

                </div>

                <SectionCard label="Datos del Producto" icon={<IconBarcode size={14} />}>
                    <FormInput {...register('codigobarras')} label="Código de Barras" icon={<IconBarcode size={13} />} required placeholder="Ej. 097339000177" width="1/3"/>
                    <FormInput {...register('nombre')} label="Nombre" icon={<IconBox size={13} />} required placeholder="Ej. Doritos Nacho 65g." width="1/3"/>
                    <FormInput {...register('unidadmedida')} label="Unidad de Medidad" icon={<IconBox size={13} />} placeholder="Ej. Pieza, Litro, Kg" width="1/3"/>
                    <FormInput {...register('idproveedor')} label="Id Proveedor" icon={<IconBox size={13} />} required placeholder="Ej. 5." width="1/2"/>
                    <FormInput {...register('iddepartamento')} label="Id Departamento" icon={<IconBox size={13} />} placeholder="Ej. 3" width="1/2"/>
                </SectionCard>

                <SectionCard label="Costos" icon={<IconCash size={14} />}>
                    <FormInput {...register('costo')} label="Costo" icon={<IconCash size={13} />} required placeholder="Ej. 10" width="1/3"/>
                    <FormInput {...register('ganancia')} label="Ganancia" icon={<IconTrendingUp size={13} />} success  placeholder="Ej. 20%" width="1/3"/>
                    <FormInput {...register('precio')} label="Precio" icon={<IconCoins size={13} />} placeholder="Ej. 12" width="1/3"/>
                </SectionCard>

                <SectionCard label="Stocks" icon={<IconStack size={14} />}>
                    <FormInput label="Stock Mínimo" icon={<IconStack size={13} />} required placeholder="Ej. 6" width="1/2"/>
                    <FormInput label="Stock Maximo" icon={<IconStack size={13} />} required placeholder="Ej. 32" width="1/2"/>
                </SectionCard>


            </div>
            <BottomBar 
                    btnsLeft={<>
                        <ActionButton 
                            label="Búsqueda" 
                            icon={<IconSearch size={14} />} 
                            variant="gWhite" 
                            onClick={async () => {
                                const data = await productosService.search('')
                            }}
                        />
                        <ActionButton 
                            label="Productos" 
                            icon={<IconTable size={14} />} 
                            variant="gWhite" 
                            onClick={() => 
                                navigate('/consultas/productos')
                            }
                        />
                        <ActionButton 
                            label="Cancelar" 
                            icon={<IconX size={14} />} 
                            variant="gWhite" 
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