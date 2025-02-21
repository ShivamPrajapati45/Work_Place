import React from 'react'
import { GrFormNext } from 'react-icons/gr'

const NextBtn = ({className,state,handlers}) => {
    return (
        <button 
            className={className}
            onClick={handlers.handleNextStep}
            type='button'
            disabled={state.isLoading}
            onMouseEnter={() => handlers.setBtnHover(!state.btnHover)}
            onMouseLeave={() => handlers.setBtnHover(!state.btnHover)}
        >
            {
                state.isLoading ? (
                    <div className='flex py-2 px-8 gap-1.5 items-center justify-center'>
                        <div className='h-2.5 w-2.5 bg-gray-100 rounded-full animate-[bounce_1s_infinite] [animation-delay:-0.1s]'></div>
                        <div className='h-2.5 w-2.5 bg-gray-100 rounded-full animate-[bounce_1s_infinite] [animation-delay:-0.20s]'></div>
                        <div className='h-2.5 w-2.5 bg-gray-100 rounded-full animate-[bounce_1s_infinite]'></div>
                    </div>
                ) : <>
                        <p>Continue</p>
                        <GrFormNext 
                            className={` ${state.btnHover ? 'translate-x-3' : ''} transition-all duration-300`} 
                            size={22}
                        />
                    </>
            }
        </button>
    )
}

export default NextBtn