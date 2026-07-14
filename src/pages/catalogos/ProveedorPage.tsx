
import { BottomBar } from "../../components/layout/BottomBar"
import { SectionCard } from "../../components/ui/SectionCard"
import { FormInput } from "../../components/forms/FormInput"
import { ActionButton } from "../../components/ui/ActionButton"
import { Badge } from "../../components/ui/Badge"
import { useState } from "react"
import { IconUser, IconForms, IconPhone, IconCreditCard, IconCoin, IconCoins, IconSearch, IconTable, IconArrowLeft, IconX } from "@tabler/icons-react"
import { useNavigate } from 'react-router-dom';



export const ProveedorPage = () => {
    const [id, setId] = useState(null)

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
                    <p className="text-sm font-medium text-(--color-text-muted)">Nombre del Proveedor</p>
                    <p className="text-xs text-(--color-text-muted)">Completa el formulario para registrar</p>
                </div>
                <span className="text-xs text-(--color-text-muted) bg-(--color-background) border border-(--color-border) rounded-lg px-3 py-1.5">
                    ID: {displayId}
                </span>
                </div>

                <SectionCard label="Datos del Proveedor" icon={<IconUser size={14} />}>
                    <FormInput label="Nombre" icon={<IconForms size={13} />} required placeholder="Ej. Héctor" width="1/3"/>
                    <FormInput label="Teléfono" icon={<IconForms size={13} />} type="tel" required placeholder="Ej. 341 199 45 32" width="1/3"/>
                    <FormInput label="Domicilio" icon={<IconForms size={13} />} placeholder="Ej. Cananiro #13..." width="1/3"/>
                </SectionCard>


            </div>
            <BottomBar 
                    btnsLeft={<>
                        <ActionButton label="Búsqueda" icon={<IconSearch size={14} />} variant="gWhite" />
                        <ActionButton label="Proveedores" icon={<IconTable size={14} />} variant="gWhite" />
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