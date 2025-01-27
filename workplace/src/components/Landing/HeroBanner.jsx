"use client"
import React,{useEffect,useState} from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const HeroBanner = () => {
    const router = useRouter();
    const[image,setImage] = useState(3);
    const [search, setSearch] = useState('');
    const placeholders = [
        'Try building a mobile app',
        'Find a logo designer',
        'Get help with web development',
        'Hire a content writer',
        'Launch your marketing campaign',
    ];
    const [currentPlaceHolders, setCurrentPlaceHolders] = useState(placeholders[0]);
    const data = [
        {
            name: 'Website Design'
        },
        {
            name: 'Logo Design'
        },
        {
            name: 'UI/UX'
        },
        {
            name: 'Singer'
        }
    ]


    useEffect(()=>{
        const interval = setInterval(() => 
            setImage(image >= 5 ? 1 : image + 1),4000 
        );
        return () => clearInterval(interval);
    },[image]) 

        let index = 0;
    useEffect(() => {
        const interval = setInterval(() => {
            index = (index + 1) % placeholders.length;
            setCurrentPlaceHolders(placeholders[index]);
        },2000);
        return () => clearInterval(interval);
    },[]);

    return (
        <div className='h-screen relative bg-cover'>
            <div className='absolute top-0 right-0 w-[60vw] h-full transition-opacity z-0'>
                <Image alt='hero' fill src={"/images/second.png"} className={`${image === 1 ? "opacity-80" : "opacity-0"} transition-all duration-1000 object-contain`}></Image>
                <Image alt='hero' fill src={"/images/main_second.png"} className={`${image === 2 ? "opacity-80" : "opacity-0"} transition-all duration-1000 object-contain`}></Image>
                <Image alt='hero' fill src={"/images/fourth.png"} className={`${image === 3 ? "opacity-80" : "opacity-0"} transition-all duration-1000 object-contain`}></Image>
                <Image alt='hero' fill src={"/images/third.png"} className={`${image === 4 ? "opacity-80" : "opacity-0"} transition-all duration-1000 object-contain`}></Image>
                <Image alt='hero' fill src={"/images/fourth.png"} className={`${image === 5 ? "opacity-80" : "opacity-0"} transition-all duration-1000 object-contain`}></Image>
            </div>

            <div className='z-1 relative w-[650px] flex justify-center flex-col h-full gap-5 ml-10'>
                <h1 className='text-black text-4xl leading-snug'>Discover the perfect <strong>Freelancer</strong><br />Services for your business</h1>
                <form 
                    className='flex align-middle'
                    onSubmit={(e) => {
                        e.preventDefault()
                        router.push(`/search?q=${search}`)
                    }}
                >
                <div className='relative'>
                    <input 
                        type="text" 
                        className='h-14 w-[400px] text-xl pl-10 rounded-md rounded-r-none outline-none transition-all duration-300' 
                        placeholder={currentPlaceHolders} 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                    <button 
                        type='submit'
                        className='bg-[#34A853] text-white px-8 text-lg font-semibold rounded-r-md uppercase'
                    >search</button>
                </form>
                <div className='text-[#212121] flex gap-3 justify-center items-center'>
                    POPULAR:{" "}
                    <ul className='flex gap-5'>
                        {data.map(({name}) => (
                            <li
                                key={name}
                                className='text-sm py-1 px-3 border rounded-full hover:bg-gray-100 hover:text-black transition-all duration-300 cursor-pointer'
                                onClick={() => router.push(`/search?category=${name}`)}
                            >
                                {name}
                            </li>
                        ))}
                    </ul>
                </div> 
            </div>
        </div>
    )
    }

    export default HeroBanner