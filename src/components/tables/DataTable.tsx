// src/components/tables/DataTable.tsx

interface Column<T> {
    header: string
    accessor: keyof T | ((row: T) => React.ReactNode)
    width?: string
}

interface DataTableProps<T> {
    columns: Column<T>[]
    data: T[]
    emptyText?: string
    isLoading?: boolean // <-- Agregado para controlar el estado de espera
}

export const DataTable = <T extends object>({
    columns,
    data,
    emptyText = 'No hay registros para mostrar',
    isLoading = false // <-- Por defecto es false
}: DataTableProps<T>) => {
    return (
        <div className="w-full overflow-auto">

            <table className="w-full border-collapse text-sm">

                <thead>
                    <tr className="bg-(--color-background) border-b border-(--color-border)">
                        {columns.map((col, i) => (
                            <th
                                key={i}
                                className={`
                                    px-3 py-2.5 text-left text-xs font-medium
                                    text-(--color-text-muted) whitespace-nowrap
                                    ${col.width ?? ''}
                                `}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {/* 1. Si está cargando, muestra un indicador de carga animado */}
                    {isLoading ? (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="px-3 py-12 text-center text-xs text-(--color-text-muted)"
                            >
                                <div className="flex flex-col items-center justify-center gap-2.5">
                                    <div className="w-5 h-5 border-2 border-(--color-text-muted) border-t-transparent rounded-full animate-spin" />
                                    <span>Cargando información...</span>
                                </div>
                            </td>
                        </tr>
                    ) : data.length === 0 ? (
                        /* 2. Si ya terminó de cargar y no hay datos, muestra el texto vacío */
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="px-3 py-10 text-center text-xs text-(--color-text-muted)"
                            >
                                {emptyText}
                            </td>
                        </tr>
                    ) : (
                        /* 3. Si hay datos, renderiza las filas normalmente */
                        data.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className="border-b border-(--color-border) hover:bg-(--color-background) transition-colors"
                            >
                                {columns.map((col, colIndex) => (
                                    <td
                                        key={colIndex}
                                        className="px-3 py-2.5 text-(--color-text-main)"
                                    >
                                        {typeof col.accessor === 'function'
                                            ? col.accessor(row)
                                            : String(row[col.accessor] ?? '-')
                                        }
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>

            </table>

        </div>
    )
}