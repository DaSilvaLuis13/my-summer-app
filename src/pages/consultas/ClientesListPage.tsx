// src/pages/catalogos/ClientesListPage.tsx
import { BottomBar } from "../../components/layout/BottomBar"
import { ActionButton } from "../../components/ui/ActionButton"
import { useEffect, useState } from "react"
import { IconArrowLeft, IconTrash } from "@tabler/icons-react"
import { useNavigate } from 'react-router-dom';
import { clientesService } from "../../services/clientesService"
import { DataTable } from "../../components/tables/DataTable"
import type { Cliente } from "../../types"
import toast from "react-hot-toast"

export const ClientesListPage = () => {
    
    const navigate = useNavigate();

    const [clientes, setClientes] = useState<Cliente[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    const cargarClientes = async () => {
        try {
            setLoading(true)
            const data = await clientesService.getAll()
            setClientes(data)
        } catch (error) {
            toast.error('Error al cargar la lista de clientes')
            console.error(error) // Corregido para que imprima el error real en consola
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        cargarClientes()
    }, [])

    // Columnas corregidas con los accesores exactamente en minúsculas
    const columnas = [
        { header: 'Nombre', accessor: 'nombre' as keyof Cliente},
        { header: 'Apellido Paterno', accessor: 'apellidopaterno' as keyof Cliente},
        { header: 'Apellido Materno', accessor: 'apellidomaterno' as keyof Cliente},
        { header: 'Domicilio', accessor: 'domicilio' as keyof Cliente},
        { header: 'Teléfono', accessor: 'telefono' as keyof Cliente},
        { header: 'Límite Crédito', accessor: 'limitecredito' as keyof Cliente},
        { header: 'Crédito disponible', accessor: 'creditodisponible' as keyof Cliente},
        { 
            header: 'Acción',   
            accessor: (row: Cliente) => (
                <button
                    onClick={() => console.log('eliminar', row.idcliente)} // row.idcliente ya en minúsculas
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
                    data={clientes}    
                    emptyText="No hay clientes registrados"
                    isLoading={loading} // Si tu DataTable soporta propiedad de carga, añade esto
                />
            </div>

            <BottomBar 
                btnsLeft={<>
                    <ActionButton 
                        label="Regresar" 
                        icon={<IconArrowLeft size={14} />} 
                        variant="gWhite" 
                        onClick={() => navigate('/catalogos/clientes')}
                    />
                </>}
            />
        </>
    )
}