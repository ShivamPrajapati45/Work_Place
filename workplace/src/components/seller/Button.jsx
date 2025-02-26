import React from 'react'

const Button = ({
        onclick, 
        isLoading, 
        isDisabled,
        className,
        setBtnHover,
        children
    }) => {
    return (
        <button
            onClick={onclick}
            className={`${className} flex items-center justify-center gap-2 text-lg font-semibold px-5 py-2 rounded-lg disabled:opacity-70`}
            type='button'
            disabled={isDisabled || isLoading}
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
        >
            {
                isLoading ? (
                    <div className='flex gap-1.5 items-center justify-center px-5 py-2'>
                        <div className='h-2.5 w-2.5 bg-[#212121] rounded-full animate-[bounce_1s_infinite] [animation-delay:-0.1s]'></div>
                        <div className='h-2.5 w-2.5 bg-[#212121] rounded-full animate-[bounce_1s_infinite] [animation-delay:-0.20s]'></div>
                        <div className='h-2.5 w-2.5 bg-[#212121] rounded-full animate-[bounce_1s_infinite]'></div>
                    </div>
                ) : (
                    children
                )
            }
            </button>
    )
}

export default Button