import React from 'react'
import './Loader.css'

const Loader = ({
    size = 'md',
    color = '#11b6a3',
    overlay = false,
    fullScreen = false,
    text = '',
    className = '',
    children,
    ...props
}) => {

    const spinnerClass =
        `loader-spinner loader-spinner-${size}`


    const wrapperClass = [
        'loader-wrapper',
        overlay ? 'loader-overlay' : '',
        fullScreen ? 'loader-fullscreen' : '',
        className,
    ]
        .filter(Boolean)
        .join(' ')


    const spinnerStyle = {
        borderColor:
            `${color} transparent transparent transparent`,
    }


    const spinner = (
        <div
            className={spinnerClass}
            style={spinnerStyle}
        />
    )


    const content = (
        <div className="loader-container">

            {spinner}

            {text && (
                <p className="loader-text">
                    {text}
                </p>
            )}

        </div>
    )


    if (overlay) {

        return (
            <div
                className={wrapperClass}
                {...props}
            >

                {children}

                <div className="loader-backdrop">

                    <div className="loader-container">

                        {spinner}

                        {text && (
                            <p className="loader-text">
                                {text}
                            </p>
                        )}

                    </div>

                </div>

            </div>
        )
    }


    return (
        <div
            className={wrapperClass}
            {...props}
        >
            {content}
        </div>
    )
}


export default Loader