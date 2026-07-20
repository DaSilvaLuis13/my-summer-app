import { BottomBar } from "../../components/layout/BottomBar"
import { ActionButton } from "../../components/ui/ActionButton"
import { useEffect, useState } from "react"
import { IconArrowLeft, IconTrash } from "@tabler/icons-react"
import { useNavigate } from 'react-router-dom';
import { proveedoresService } from "../../services/proveedoresService"
import { DataTable } from "../../components/tables/DataTable"
import type { Proveedor } from "../../types"
import toast from "react-hot-toast"


export const ProveedorListPage = () => {

    const navigate = useNavigate();

    const [proveedores, setProveedores] = useState<Proveedor[]>([])

    const [loading, setLoading] = useState<boolean>(true)

    const cargarProveedores = async () => {
        try {
            setLoading(true)
            const data = await proveedoresService.getAll()
            setProveedores(data)
        } catch (error) {
            toast.error('Error al cargar la lista de proveedores')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        cargarProveedores()
    }, [])


    const columnas = [
        { header: 'Nombre', accessor: 'nombre' as keyof Proveedor },
        { header: 'Teléfono', accessor: 'telefono' as keyof Proveedor },
        { header: 'Dirección', accessor: 'direccion' as keyof Proveedor },
        { 
            header: 'Acción',   
            accessor: (row: Proveedor) => (
                <button
                    onClick={() => console.log('eliminar', row.idproveedor)} 
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
                    data={proveedores}
                    emptyText="No hay proveedores registrados"
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