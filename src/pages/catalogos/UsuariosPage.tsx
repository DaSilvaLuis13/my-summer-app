
import { BottomBar } from "../../components/layout/BottomBar"
import { SectionCard } from "../../components/ui/SectionCard"
import { FormInput } from "../../components/forms/FormInput"
import { ActionButton } from "../../components/ui/ActionButton"
import { Badge } from "../../components/ui/Badge"
import { useState } from "react"
import { IconUser, IconForms, IconPhone, IconCreditCard, IconCoin, IconCoins, IconSearch, IconTable, IconArrowLeft, IconX, IconShield, IconSettings, IconCashRegister, IconPackage } from "@tabler/icons-react"
import { useNavigate } from 'react-router-dom';


export const UsuariosPage = () => {

    const [id, setId] = useState(null)

    const [rol, setRol] = useState<1 | 2 | 3>(2) // 1=admin, 2=cajero, 3=almacen

    const displayId = id != null ? id : '--'

    const navigate = useNavigate();

    
    return (
        <>
            <div className='flex flex-col flex-1 gap-6 p-6 min-h-full justify-center'>

                {/* Header */}
                <div className="flex items-center gap-3 w-3/4 mx-auto">
                <IconUser size={18} className="text-(--color-text-muted)" />
                <Badge label="Nuevo" variant="nuevo" />
                </div>

                {/* Tarjeta de perfil — fuera del SectionCard */}
                <div className="bg-(--color-surface) border border-(--color-border) rounded-xl px-5 py-4 flex items-center gap-4 w-3/4 mx-auto">
                <div className="w-12 h-12 rounded-full bg-(--color-info-bg) border border-(--color-info-border) flex items-center justify-center text-lg font-medium text-(--color-info-text) shrink-0">
                    ?
                </div>
                <div className="flex-1">
                    <p className="text-sm font-medium text-(--color-text-muted)">Nombre del usuario</p>
                    <p className="text-xs text-(--color-text-muted)">Completa el formulario para registrar</p>
                </div>
                <span className="text-xs text-(--color-text-muted) bg-(--color-background) border border-(--color-border) rounded-lg px-3 py-1.5">
                    ID: {displayId}
                </span>
                </div>

                <SectionCard label="Datos Personales" icon={<IconUser size={14} />}>
                    <FormInput label="Nombre" icon={<IconForms size={13} />} required placeholder="Ej. Héctor" width="1/3"/>
                    <FormInput label="Usuario" icon={<IconForms size={13} />} required placeholder="Ej. Fran404" width="1/3"/>
                    <FormInput label="Cotraseña" icon={<IconForms size={13} />} placeholder="Ej. 12563487" width="1/3"/>                        
                </SectionCard>

                <SectionCard label="Rol de Usuario" icon={<IconShield size={14} />}>
                    <div className="p-4 flex gap-3 w-full">

                        <button
                            onClick={() => setRol(1)}
                            className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors cursor-pointer
                                ${rol === 1
                                ? 'border-(--color-info-border) bg-(--color-info-bg) text-(--color-info-text)'
                                : 'border-(--color-border) bg-(--color-background) text-(--color-text-muted) hover:border-(--color-info-border) hover:text-(--color-info-text)'
                                }`}
                        >
                            <IconSettings size={20} />
                            <span className="text-xs font-medium">Admin</span>
                            <span className="text-[10px] text-(--color-text-muted)">Acceso total</span>
                        </button>

                        <button
                            onClick={() => setRol(2)}
                            className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors cursor-pointer
                                ${rol === 2
                                ? 'border-(--color-info-border) bg-(--color-info-bg) text-(--color-info-text)'
                                : 'border-(--color-border) bg-(--color-background) text-(--color-text-muted) hover:border-(--color-info-border) hover:text-(--color-info-text)'
                                }`}
                        >
                            <IconCashRegister size={20} />
                            <span className="text-xs font-medium">Cajero</span>
                            <span className="text-[10px] text-(--color-text-muted)">Ventas y cobros</span>
                        </button>

                        <button
                            onClick={() => setRol(3)}
                            className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors cursor-pointer
                                ${rol === 3
                                ? 'border-(--color-info-border) bg-(--color-info-bg) text-(--color-info-text)'
                                : 'border-(--color-border) bg-(--color-background) text-(--color-text-muted) hover:border-(--color-info-border) hover:text-(--color-info-text)'
                                }`}
                        >
                            <IconPackage size={20} />
                            <span className="text-xs font-medium">Almacén</span>
                            <span className="text-[10px] text-(--color-text-muted)">Inventario y entradas</span>
                        </button>

                    </div>
                </SectionCard>

                

            </div>
            <BottomBar 
                    btnsLeft={<>
                        <ActionButton label="Búsqueda" icon={<IconSearch size={14} />} variant="gWhite" />
                        <ActionButton label="Usuarios" icon={<IconTable size={14} />} variant="gWhite" />
                        <ActionButton label="Cancelar" icon={<IconX size={14} />} variant="gWhite" />
                    </>}
                    btnsRight={
                        <ActionButton 
                            label="Regresar" 
                            icon={<IconArrowLeft size={14} />} 
                            variant='ghost' 
                            onClick={() => navigate('/')}
                        />
                    }

                />
        </>
    )
}