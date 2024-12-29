import React from "react";
import Image from "next/image";

const Companies = () => {
    return (
    <div className="flex items-center justify-center text-gray-400 text-2xl font-bold min-h-[11vh] bg-[#121212]"> Trusted by:
        <ul className="flex justify-center gap-10 ml-10">
            {[1, 2, 3, 4, 5].map((num) => (
            <li key={num} className="relative h-[4.5rem] w-[4.5rem]">
                <Image  src={`/images/trusted${num}.png`} fill  alt="trusted brands" className="rounded-lg"/>
            </li>
            ))}
        </ul>
        </div>
    );
};

export default Companies;