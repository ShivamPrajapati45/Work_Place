import React from 'react'
import { IoArrowBack } from 'react-icons/io5'

const BackButton = ({setStep,setIsLoading}) => {
    return (
            <button 
                onClick={() => {
                    setStep(1)
                    setIsLoading(false)
                }}
                className='absolute top-5 left-0 hover:bg-gray-200 p-1 duration-500 transition-all rounded-full text-2xl text-gray-700 hover:text-gray-900'
            >
                <IoArrowBack/>
            </button>
    )
}

export default BackButton