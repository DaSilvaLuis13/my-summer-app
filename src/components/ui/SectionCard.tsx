//src/components/ui/SectionCard.tsx

interface SectionCardProps {
    label: string
    icon?: React.ReactNode
    children: React.ReactNode
}

export const SectionCard = ({ 
    label, 
    icon, 
    children 
}: SectionCardProps) => {
    return (
        <div className="bg-(--color-surface) border border-(--color-border) rounded-xl overflow-hidden w-3/4 mx-auto">

            <div className="flex items-center gap-2 px-4 py-2.5 bg-(--color-background) border-b border-(--color-border)">
                {icon}
                <span className="text-xs font-medium uppercase tracking-wide text-(--color-text-muted)">
                    {label}
                </span>
            </div>

            <div className={`flex flex-wrap divide-(--color-border)`}>
                {children}
            </div>

        </div>
    )
}
