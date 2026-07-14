//src/pages/consultas/ProductosListPage.tsx
import { BottomBar } from "../../components/layout/BottomBar"
import { ActionButton } from "../../components/ui/ActionButton"
import { useEffect, useState } from "react"
import { IconArrowLeft, IconTrash } from "@tabler/icons-react"
import { useNavigate } from 'react-router-dom';
import { productosService } from "../../services/productosService"
import { DataTable } from "../../components/tables/DataTable"
import type { Producto } from "../../types"
import toast from "react-hot-toast"


export const ProductosListPage = () => {

    const navigate = useNavigate();

    const [productos, setProductos] = useState<Producto[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    const cargarProductos = async () => {
        try {
            setLoading(true)
            const data = await productosService.getAll()
            setProductos(data)
        } catch (error) {
            toast.error('Error al cargar la lista de productos')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        cargarProductos()
    }, [])

    const columnas = [
        { header: 'Código de Barras', accessor: 'codigobarras' as keyof Producto },
        { header: 'Nombre', accessor: 'nombre' as keyof Producto},
        { header: 'Departamento', accessor: 'iddepartamento' as keyof Producto},
        { header: 'Costo', accessor: 'costo' as keyof Producto },
        { header: 'Precio', accessor: 'precio' as keyof Producto},
        { header: 'Unidadmedida', accessor: 'unidadmedida' as keyof Producto},
        { header: 'Stock Actual', accessor: 'stockactual' as keyof Producto},
        { 
            header: 'Acción',   
            accessor: (row: Producto) => (
                <button
                    onClick={() => console.log('eliminar', row.idproducto)} 
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
            <div className='flex flex-col flex-1 min-h-full mb-16'>

                <DataTable
                    columns={columnas}
                    data={productos}
                    emptyText="No hay productos registrados"
                    isLoading={loading}
                />

            </div>

            <BottomBar 
                btnsLeft={<>
                    <ActionButton 
                        label="Regresar" 
                        icon={<IconArrowLeft size={14} />} 
                        variant="gWhite" 
                        onClick={() => navigate('/catalogos/productos')}
                    />
                </>}
            />
        </>
    )
}