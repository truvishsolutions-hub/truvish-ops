import React from 'react'
import './Button.css'

const Button = ({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    icon = null,
    iconPosition = 'left',
    onClick = null,
    disabled = false,
    type = 'button',
    className = '',
    children,
    ...props
}) => {

    const classes = [
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        fullWidth ? 'btn-full' : '',
        icon ? 'btn-with-icon' : '',
        icon ? `btn-icon-${iconPosition}` : '',
        className,
    ]
        .filter(Boolean)
        .join(' ')


    return (
        <button
            className={classes}
            onClick={onClick}
            disabled={disabled}
            type={type}
            {...props}
        >

            {icon && iconPosition === 'left' && (
                <span className="btn-icon">
                    {icon}
                </span>
            )}

            {children && (
                <span className="btn-label">
                    {children}
                </span>
            )}

            {icon && iconPosition === 'right' && (
                <span className="btn-icon">
                    {icon}
                </span>
            )}

        </button>
    )
}


export default Button