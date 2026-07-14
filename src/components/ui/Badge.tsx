// src/components/ui/Badge.tsx

interface BadgeProps {
  label:   string
  variant: 'nuevo' | 'editando' | 'pendiente' | 'aprobada' | 'rechazada' | 'completada' | 'cancelada'
}

export const Badge = ({ label, variant }: BadgeProps) => {

  const base = 'inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border'

  const styles: Record<string, string> = {
    nuevo:      'bg-(--color-info-bg)    text-(--color-info-text)    border-(--color-info-border)',
    editando:   'bg-(--color-pending-bg) text-(--color-pending-text) border-(--color-pending-border)',
    pendiente:  'bg-(--color-pending-bg) text-(--color-pending-text) border-(--color-pending-border)',
    aprobada:   'bg-(--color-success-bg) text-(--color-success-text) border-(--color-success-border)',
    completada: 'bg-(--color-success-bg) text-(--color-success-text) border-(--color-success-border)',
    rechazada:  'bg-(--color-danger-bg)  text-(--color-danger-text)  border-(--color-danger-border)',
    cancelada:  'bg-(--color-danger-bg)  text-(--color-danger-text)  border-(--color-danger-border)',
  }

  return (
    <span className={`${base} ${styles[variant]}`}>
      {label}
    </span>
  )
}