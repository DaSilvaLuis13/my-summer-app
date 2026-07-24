// src/components/pos/QtyValue.tsx
import { IconMoneybag, IconWeight, IconFileText } from '@tabler/icons-react'
import { FormInput } from '../forms/FormInput'

interface QtyValueProps {
    precio:        number 
    datoextra:          number | string
    onPrecioChange: (value: number) => void
    onDatoExtraChange:   (value: number | string) => void
}


export const QtyValue = ({ 
    precio, 
    datoextra, 
    onPrecioChange, 
    onDatoExtraChange 
}: QtyValueProps) => {

    const esPeso = typeof datoextra === 'number'

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
                label={ esPeso ? 'Peso' : 'Descripcion'}
                icon={ esPeso ? <IconWeight size={13} /> : <IconFileText size={13} />}
                type={ esPeso ? 'number' : 'text'}
                placeholder={ esPeso ? '0.00' : 'producto generico'}
                width="1/2"
                value={datoextra || ''}
                onChange={(e) => 
                    onDatoExtraChange(esPeso ? Number(e.target.value) : e.target.value)
                }
            />
        </>
    )
}