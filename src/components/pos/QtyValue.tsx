// src/components/pos/QtyValue.tsx
import { IconMoneybag, IconWeight } from '@tabler/icons-react'
import { FormInput } from '../forms/FormInput'

interface QtyValueProps {
    precio:        number
    peso:          number
    onPrecioChange: (value: number) => void
    onPesoChange:   (value: number) => void
}

export const QtyValue = ({ 
    precio, 
    peso, 
    onPrecioChange, 
    onPesoChange 
}: QtyValueProps) => {

    return (
        <>
            <FormInput
                label="Precio"
                icon={<IconMoneybag size={13} />}
                type="number"
                placeholder="0.00"
                width="1/2"
                value={precio || ''}
                onChange={(e) => onPrecioChange(Number(e.target.value))}
            />
            <FormInput
                label="Peso"
                icon={<IconWeight size={13} />}
                type="number"
                placeholder="0.00"
                width="1/2"
                value={peso || ''}
                onChange={(e) => onPesoChange(Number(e.target.value))}
            />
        </>
    )
}