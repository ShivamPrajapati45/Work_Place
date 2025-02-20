import React from 'react'
import { GrFormNext } from 'react-icons/gr'

const NextBtn = ({handleNextStep,isLoading,setBtnHover,btnHover,className}) => {
    return (
        <button 
            className={className}
            onClick={handleNextStep}
            type='button'
            disabled={isLoading}
            onMouseEnter={() => setBtnHover(!btnHover)}
            onMouseLeave={() => setBtnHover(!btnHover)}
        >
            {
                isLoading ? (
                    <div className='flex py-2 px-8 gap-1.5 items-center justify-center'>
                        <div className='h-2.5 w-2.5 bg-gray-100 rounded-full animate-[bounce_1s_infinite] [animation-delay:-0.1s]'></div>
                        <div className='h-2.5 w-2.5 bg-gray-100 rounded-full animate-[bounce_1s_infinite] [animation-delay:-0.20s]'></div>
                        <div className='h-2.5 w-2.5 bg-gray-100 rounded-full animate-[bounce_1s_infinite]'></div>
                    </div>
                ) : <>
                        <p>Continue</p>
                        <GrFormNext 
                            className={` ${btnHover ? 'translate-x-3' : ''} transition-all duration-300`} 
                            size={22}
                        />
                    </>
            }
        </button>
    )
}

export default NextBtn