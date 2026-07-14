//src/components/forms/FormInout.tsx
import React, { forwardRef } from "react"

interface FormInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'width'> {
    label: string
    hint?: string
    icon?: React.ReactNode
    width: '1/3' | '2/3' | 'full' | '1/2'
    success?: boolean
    error?: string
}

const widthStyles: Record<NonNullable<FormInputProps['width']>, string> = {
    '1/3': 'w-1/3',
    '2/3': 'w-2/3',
    'full': 'w-full',
    '1/2': 'w-1/2'
}


export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(({ 
    label, 
    hint, 
    required = false, 
    icon, 
    type = 'text',
    placeholder,
    width = 'full',
    success = false,
    error,
    ...props
}, ref) => {
    return (
        <div className={`
            flex flex-col gap-1.5 p-3
            border-b border-r border-(--color-border)
            ${widthStyles[width]}
            `}>

            {/* Label */}
            <div className="flex items-center gap-1.5">
                {icon && <span className="text-(--color-text-muted)">{icon}</span>}
                <span className="text-xs font-medium text-(--color-text-muted)">{label}</span>
                {required && <span className="text-red-500 text-xs">*</span>}
            </div>

            {/* Input */}
            <input
                ref={ref}
                type={type}
                placeholder={placeholder}
                required={required}
                {...props}
                className={`
                w-full px-3 py-2 rounded-lg
                border text-sm
                placeholder:text-(--color-text-muted)
                focus:outline-none
                ${success
                    ? 'bg-(--color-success-bg) border-(--color-success-border) text-(--color-success-text) focus:border-(--color-success-text)'
                    : 'bg-(--color-background) border-(--color-border) text-(--color-text-main) focus:border-(--color-info-border)'
                }
                `}
            />

            {/* Hint o Mensaje de Error */}
            {error ? (
                <p className="text-xs text-red-500 font-medium">{error}</p>
            ) : hint ? (
                <p className="text-xs text-(--color-text-muted)">{hint}</p>
            ) : null}
            </div>
    )
})

FormInput.displayName = 'FormInput'