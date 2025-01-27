import React from "react";
import Image from "next/image";
import './index.css'

const Companies = () => {
    return (
        <div className="flex items-center text-gray-400 text-sm min-h-[11vh] bg-[#121212] px-10">
        <span className="whitespace-nowrap text-2xl font-bold">Trusted by:</span>
        <div className="carousel-container ml-10 flex-grow overflow-hidden">
            <ul className="carousel flex gap-10 items-center">
                {[1, 2, 3, 4, 5, 1, 2, 3, 4, 5].map((num, index) => (
                <li key={index} className="relative h-[4.5rem] w-[4.5rem] flex-shrink-0">
                    <Image
                    src={`/images/trusted${num}.png`}
                    fill
                    alt="trusted brands"
                    className="rounded-lg object-contain transition-all"
                    />
                </li>
                ))}
            </ul>
            </div>
        </div>
    );
};

export default Companies;
