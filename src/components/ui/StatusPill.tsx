import { IconClock, IconCheck, IconX} from '@tabler/icons-react'

interface StatusPillProps {
    label: string
    variant: 'pendiente' | 'aprobada' | 'rechazada' | 'completada' | 'cancelada'
}

const styles: Record<StatusPillProps['variant'], string> = {
    pendiente: 'bg-(--color-pending-bg) text-(--color-pending-text) border-(--color-pending-border)',
    aprobada: 'bg-(--color-success-bg) text-(--color-success-text) border-(--color-success-border)',
    completada: 'bg-(--color-success-bg) text-(--color-success-text) border-(--color-success-border)',
    rechazada: 'bg-(--color-danger-bg) text-(--color-danger-text) border-(--color-danger-border)',
    cancelada: 'bg-(--color-danger-bg) text-(--color-danger-text) border-(--color-danger-border)'
}

const icons: Record<StatusPillProps['variant'], React.ReactNode> = {
    pendiente: <IconClock size={12} />,
    aprobada: <IconCheck size={12} />,
    completada: <IconCheck size={12} />,
    rechazada: <IconX size={12} />,
    cancelada: <IconX size={12} />
}

export const StatusPill = ({ label, variant }: StatusPillProps) => {
    return (
        <span 
            className={`
            inline-flex items-center gap-1 px-2.5 py-0.5
            text-xs font-medium rounded-full border
            ${styles[variant]}
        `}
        >
            {icons[variant]}
            {label}
        </span>
    )
}