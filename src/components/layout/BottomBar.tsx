//src/components/layout/BottomBar.tsx

interface BottomBarProps {
    btnsLeft: React.ReactNode
    btnsRight?: React.ReactNode
}

export const BottomBar = ({btnsLeft, btnsRight}: BottomBarProps) => {
    return (
        <footer className="bg-(--color-primary) flex items-center justify-between px-3 h-14 shrink-0">
            <div className="flex items-center gap-2">
                {btnsLeft}
            </div>
            
            {btnsRight && (
                <div className="flex items-center gap-2">
                    {btnsRight}
                </div>
            )}
        </footer>
    )
}