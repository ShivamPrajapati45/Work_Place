"use client"
import React,{useEffect,useState} from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const HeroBanner = () => {
    const router = useRouter();
    const[image,setImage] = useState(3);

    useEffect(()=>{
        const interval = setInterval(() => 
            setImage(image >= 6 ? 1 : image + 1),3000 
        );
        return () => clearInterval(interval);
    },[image]) 

    return (
        <div className='h-[680px] relative bg-cover'>
        <div className='absolute top-0 right-0 w-[110vw] h-full transition-opacity z-0'>
            <Image alt='hero' fill src={"/images/bg-hero1.webp"} className={`${image === 1 ? "opacity-100" : "opacity-0"} transition-all duration-1000`}></Image>
            <Image alt='hero' fill src={"/images/bg-hero2.webp"} className={`${image === 2 ? "opacity-100" : "opacity-0"} transition-all duration-1000`}></Image>
            <Image alt='hero' fill src={"/images/bg-hero3.webp"} className={`${image === 3 ? "opacity-100" : "opacity-0"} transition-all duration-1000`}></Image>
            <Image alt='hero' fill src={"/images/bg-hero4.webp"} className={`${image === 4 ? "opacity-100" : "opacity-0"} transition-all duration-1000`}></Image>
            <Image alt='hero' fill src={"/images/bg-hero5.webp"} className={`${image === 5 ? "opacity-100" : "opacity-0"} transition-all duration-1000`}></Image>
            <Image alt='hero' fill src={"/images/bg-hero6.webp"} className={`${image === 6 ? "opacity-100" : "opacity-0"} transition-all duration-1000`}></Image>
        </div>


        <div className='z-1 relative w-[650px] flex justify-center flex-col h-full gap-5 ml-20'>
            <h1 className='text-white text-5xl leading-snug'>find the perfect &nbsp; <i>Freelancer</i><br />Services for your business</h1>
            <div className='flex align-middle'>
            <div className='relative'>
                <input type="text" className='h-14 w-[450px] pl-10 rounded-md rounded-r-none outline-none' placeholder='Try building mobile App' />
            </div>
                <button className='bg-[#1dbf73] text-white px-12 text-lg font-semibold rounded-r-md'>search</button>
            </div>
            <div className='text-white flex gap-4'>
                popular:{" "}
                <ul className='flex gap-5'>
                <li className='text-sm py-1 px-3 border rounded-full hover:bg-white hover:text-black transition-all duration-300 cursor-pointer'>Website Design</li>
                <li className='text-sm py-1 px-3 border rounded-full hover:bg-white hover:text-black transition-all duration-300 cursor-pointer'>WordPress</li>
                <li className='text-sm py-1 px-3 border rounded-full hover:bg-white hover:text-black transition-all duration-300 cursor-pointer'>Logo Design</li>
                <li className='text-sm py-1 px-3 border rounded-full hover:bg-white hover:text-black transition-all duration-300 cursor-pointer'>Ai Services</li>
                </ul>
            </div> 
        </div>
        </div>
    )
    }

    export default HeroBanner