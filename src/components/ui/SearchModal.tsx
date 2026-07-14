//src/components/SearchModal.tsx

import { useState } from "react";
import { IconSearch, IconX, IconFilter } from "@tabler/icons-react";
import { DataTable } from "../tables/DataTable";

interface FilterOption {
    label: string
    value: string
}

interface FilterGroup {
    label: string
    key: string
    options: FilterOption[]
}

interface SearchModalProps<T extends object>{
    isOpen: boolean
    onClose: () => void
    onSelect: (item: T) => void
    onSearch?: (query: string) => void
    title: string
    placeholder?: string
    columns: { header: string; accessor: keyof T | ((row: T) => React.ReactNode); width?: string }[]
    data: T[]
    filters?: FilterGroup[]
    emptyText?: string
}

export const SearchModal = <T extends object>({
    isOpen,
    onClose,
    onSelect,
    onSearch,
    title,
    placeholder = 'Buscar...',
    columns,
    data,
    filters,
    emptyText = 'No se encontraron resultados',
}: SearchModalProps<T>) => {

    const [query, setQuery] = useState('')
    const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})
    const [showFilters, setShowFilters] = useState(false)

    if (!isOpen) return null

    const columnsWithSelect = [
        {
            header: '',
            width: 'w-10',
            accessor: (row: T) => (
                <button
                    onClick={() => { onSelect(row); onClose() }}
                    className="text-(--color-info-text) hover:text-(--color-info-border) transition-colors text-xs font-medium"
                >
                    Select.
                </button>
            ),
        },
        ...columns,
    ]

    const toggleFilter = (key: string, value: string) => {
        setActiveFilters(prev => ({
            ...prev,
            [key]: prev[key] === value ? '' : value,
        }))
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            <div className="relative z-10 bg-(--color-surface) rounded-2xl shadow-xl w-full max-w-2xl mx-4 flex flex-col max-h-[80vh]">
                
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-(--color-border)">
                    <span className="text-sm font-medium text-(--color-text-main)">{title}</span>
                    <button
                        onClick={onClose}
                        className="text-(--color-text-muted) hover: text-(--color-text-main) transition-colors"
                    >
                        <IconX size={18} />
                    </button>
                    
                </div>

                <div className="px-5 py-3 border-b border-(--color-border) flex items-center gap-2">
                    <div className="flex-1 flex items-center gap-2 bg-(--color-background) border border-(--color-border) rounded-lg px-3 py-2">
                        <IconSearch size={14} className="text-(--color-text-muted) shrink-0" />
                        <input
                            type="text"
                            value={query}
                            onChange={e => {
                                setQuery(e.target.value)
                                onSearch?.(e.target.value)
                            }}
                            placeholder={placeholder}
                            autoFocus
                            className="flex-1 bg-transparent text-sm text-(--color-text-main) placeholder:text-(--color-text-muted) outline-none"
                        />
                        {query && (
                            <button onClick={() => {
                                setQuery('')
                                onSearch?.('')
                            }}>
                                <IconX size={13} className="text-(--color-text-muted)" />
                            </button>
                        )}
                    </div>

                    {/* Botón filtros — solo si hay filtros definidos */}
                    {filters && filters.length > 0 && (
                        <button
                        onClick={() => setShowFilters(p => !p)}
                        className={`
                            flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition-colors
                            ${showFilters
                            ? 'bg-(--color-info-bg) border-(--color-info-border) text-(--color-info-text)'
                            : 'bg-(--color-background) border-(--color-border) text-(--color-text-muted) hover:text-(--color-text-main)'
                            }
                        `}
                        >
                        <IconFilter size={14} />
                        Filtros
                        {Object.values(activeFilters).some(Boolean) && (
                            <span className="bg-(--color-info-border) text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                            {Object.values(activeFilters).filter(Boolean).length}
                            </span>
                        )}
                        </button>
                    )}
                </div>
                
                {/* Filtros expandibles */}
                {showFilters && filters && (
                <div className="px-5 py-3 border-b border-(--color-border) flex flex-wrap gap-4">
                    {filters.map(group => (
                    <div key={group.key} className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-medium uppercase tracking-wide text-(--color-text-muted)">
                        {group.label}
                        </span>
                        <div className="flex gap-1.5 flex-wrap">
                        {group.options.map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => toggleFilter(group.key, opt.value)}
                                className={`
                                    px-2.5 py-1 rounded-full border text-xs transition-colors
                                    ${activeFilters[group.key] === opt.value
                                    ? 'bg-(--color-info-bg) border-(--color-info-border) text-(--color-info-text)'
                                    : 'bg-(--color-background) border-(--color-border) text-(--color-text-muted) hover:text-(--color-text-main)'
                                    }
                                `}
                            >
                            {opt.label}
                            </button>
                        ))}
                        </div>
                    </div>
                    ))}
                </div>
                )}

                {/* Tabla — scrolleable */}
                <div className="flex-1 overflow-y-auto">
                <DataTable
                    columns={columnsWithSelect}
                    data={data}
                    emptyText={emptyText}
                />
                </div>

                {/* Footer con conteo */}
                <div className="px-5 py-3 border-t border-(--color-border)">
                <span className="text-xs text-(--color-text-muted)">
                    {data.length} resultado{data.length !== 1 ? 's' : ''}
                </span>
                </div>

            </div>
        </div>
    )

}