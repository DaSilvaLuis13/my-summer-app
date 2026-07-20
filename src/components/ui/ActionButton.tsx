//src/components/ui/ActionButton.tsx

interface ActionButtonProps {
    label?: string
    icon?: React.ReactNode
    variant?: 'success' | 'danger' | 'ghost' | 'gWhite'
    onClick?: () => void
    disabled?: boolean 
    fullWidth?: boolean
}

const styles: Record<NonNullable<ActionButtonProps['variant']>, string> = {
    success: 'bg-(--color-success-border) text-(--color-success-text) hover:bg-(--color-success-hover) hover:text-white',
    danger:  'bg-(--color-danger-border) text-(--color-danger-text) hover:bg-(--color-danger-hover) hover:text-white',
    ghost:   'bg-transparent hover:bg-(--color-danger-bg) text-(--color-danger-border) hover:text-(--color-danger-text) border border-(--color-danger-border)',
    gWhite:  'bg-transparent text-white hover:bg-white hover:text-(--color-primary) border border-white'
}

export const ActionButton = ({
    label,
    icon,
    variant = 'ghost',
    onClick,
    disabled = false,
    fullWidth = true,
}: ActionButtonProps) => {
    return (
        <button 
            onClick={onClick}
            disabled={disabled}
            className={`
                ${fullWidth ? 'w-full' : ''}
                flex items-center justify-center gap-2
                px-5 py-3 rounded-xl
                text-sm font-medium w-max
                transition-colors cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed
                ${styles[variant]}
            `}
        >
            {icon}
            {label}
        </button>
    )
}