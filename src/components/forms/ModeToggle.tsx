//src/components/forms/ModeToggle.tsx

import { IconEdit, IconPlus } from "@tabler/icons-react"

interface ModeToggleProps {
    mode:     'nuevo' | 'editar'
    onChange: (mode: 'nuevo' | 'editar') => void
    hasSelection?: boolean   
}

export const ModeToggle = ({ mode, onChange, hasSelection = false }: ModeToggleProps) => {
    return (
        <div className="flex border border-(--color-border) rounded-lg overflow-hidden">
            
            {/* Nuevo — siempre clickeable */}
            <button
                onClick={() => onChange('nuevo')}
                className={`
                    flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors
                    ${mode === 'nuevo'
                        ? 'bg-(--color-navbar) text-white'
                        : 'bg-(--color-surface) text-(--color-text-muted) hover:bg-(--color-background)'
                    }   
                `}
            >
                <IconPlus size={13} />
                Nuevo
            </button>

            {/* Editar — solo visible y activo cuando hay selección */}
            <button
                disabled={!hasSelection}
                className={`
                    flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors
                    ${mode === 'editar'
                        ? 'bg-(--color-navbar) text-white'
                        : hasSelection
                            ? 'bg-(--color-surface) text-(--color-text-muted) hover:bg-(--color-background)'
                            : 'bg-(--color-surface) text-(--color-border) cursor-not-allowed'
                    }   
                `}
            >
                <IconEdit size={13} />
                Editar
            </button>
        </div>
    )
}