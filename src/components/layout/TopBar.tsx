//src/components/layout/TopBar.tsx

import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { IconBuildingStore, IconUser, IconLogout,
         IconCategory, IconTag, IconPackage,
         IconFileInvoice, IconChartBar, IconSettings } from '@tabler/icons-react'


interface NavItem {
    label: string
    icon: React.ReactNode
    to?: string
    children?: { label: string; to: string}[]
}

const navItems = [
    { 
        label: 'Catálogos',     
        icon: <IconCategory    size={18} />, 
        children: [
            {   label: 'Roles', to: '/catalogos/roles' },
            {   label: 'Usuarios', to: '/catalogos/usuarios' },
            {   label: 'Departamentos', to: '/catalogos/departamentos' },
            {   label: 'Proveedores', to: '/catalogos/proveedores' },
            {   label: 'Productos', to: '/catalogos/productos' },
            {   label: 'Clientes', to: '/catalogos/clientes' }

        ]
    },
    { label: 'Promociones',   icon: <IconTag         size={18} />, to: '/promociones'   },
    { label: 'Inventario',    icon: <IconPackage     size={18} />, to: '/inventario'    },
    { label: 'Fiado',         icon: <IconFileInvoice size={18} />, to: '/fiado'         },
    { label: 'Reportes',      icon: <IconChartBar    size={18} />, to: '/reportes'      },
    { label: 'Configuración', icon: <IconSettings    size={18} />, to: '/configuracion' },
]         

interface TopBarProps {
    username: string
    onLogout: () => void
}

export const TopBar = ({ username, onLogout}: TopBarProps) => {
    
    const [openMenu, setOpenMenu] = useState<string | null>(null)
    
    return (
        <nav className='bg-(--color-primary) flex items-center h-16 shrink-0'>

            <div className='flex items-center gap-2 px-4 h-full bg-white/10 shrink-0'>
                <IconBuildingStore size={22}  className='text-white'/>
                <span className='text-white font-medium text-2xl'>SisInVe</span>
            </div>

            {/* Nav items */}
            <div className='flex flex-1 h-full'>
                {navItems.map((item) => (
                    <div
                        key={item.label}
                        className='relative h-full'
                        onMouseEnter={() => item.children && setOpenMenu(item.label)}
                        onMouseLeave={() => setOpenMenu(null)}
                    >

                    {/* Botón principal */}
                    {item.to ? (
                        <NavLink
                            to={item.to}
                            className={({ isActive }) => `
                                flex flex-col items-center justify-center gap-0.5
                                px-4 h-full text-[12px] transition-colors
                                ${isActive
                                    ? 'bg-white/15 text-white'
                                    : 'text-white/50 hover:bg-white/10 hover:text-white/80'
                                }
                            `}
                        >
                            {item.icon}
                            {item.label}
                        </NavLink>
                    ) : (
                        <button
                            className={`
                                flex flex-col items-center justify-center gap-0.5
                                px-4 h-full text-[12px] transition-colors
                                ${openMenu === item.label
                                    ? 'bg-white/15 text-white'
                                    : 'text-white/50 hover:bg-white/10 hover:text-white/80'
                                }
                            `}
                        >
                            {item.icon}
                            <span className='flex items-center gap-0.5'>
                                {item.label}
                            </span>
                        </button>
                    )}

                    {/* Dropdown */}
                    {item.children && openMenu === item.label && (
                        <div className='absolute top-full left-0 bg-(--color-surface) border border-(--color-border) rounded-xl shadow-lg overflow-hidden min-w-44 z-50'>

                            {item.children.map((child) => (
                                <NavLink
                                    key={child.to}
                                    to={child.to}
                                    className={({ isActive }) => `
                                        block px-4 py-2.5 text-sm transition-colors
                                        ${isActive
                                            ? 'bg-(--color-info-bg) text-(--color-info-text)'
                                            : 'text-(--color-text-main) hover:bg-(--color-background)'
                                        }
                                    `}
                                >
                                    {child.label}
                                </NavLink>
                            ))}

                        </div>
                    )}

                    </div>
                ))}
            </div>


            {/* Usuario y Salir */}
            <div className='flex items-center h-full shrink-0'>
                <div className='flex flex-col items-center justify-center gap-0.5 px-4 h-full text-white/50 text-[18px]'>
                    <IconUser size={22} />
                    {username}
                </div>
                <button
                    onClick={onLogout}
                    className="flex flex-col items-center justify-center gap-0.5 px-4 h-full text-white/50 hover:bg-white/10 hover:text-white/80 text-[18px] transition-colors"
                >
                    <IconLogout size={22} />
                    Salir
                </button>
            </div>

        </nav>
    )
}