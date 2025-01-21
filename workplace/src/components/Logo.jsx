import React from 'react'

const Logo = ({fillColor}) => {

    return (
        <div>
        <svg 
            width="120" 
            height="40" 
            viewBox="0 0 120 40" 
            xmlns="http://www.w3.org/2000/svg"
            fill='none' 
        >
            <text
                x={20}
                y={25}
                fill='#40bf1d'
                fontSize={18}
                fontFamily='Arial, sans-serif'
                fontWeight='bold'
            >
                WorkPlace
            </text>
            </svg>
        </div>
    )
    }

    export default Logo