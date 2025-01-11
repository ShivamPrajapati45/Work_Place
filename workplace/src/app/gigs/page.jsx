'use client'
import AllGigsCard from '@/components/Gigs/AllGigsCard';
import { useStateProvider } from '@/context/StateContext';
import useAuth from '@/hooks/useAuth';
import { allCategories } from '@/utils/categories';
import { GET_GIGS } from '@/utils/constant';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import {Select, SelectContent,SelectItem, SelectGroup,SelectLabel,SelectTrigger, SelectValue} from '@/components/ui/select'

const page = () => {

    const [allGigs, setAllGigs] = useState([]);
    const [{userInfo}] = useStateProvider();
    const [category, setCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);


    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        // setCategory(value);
        setError('');
        
        const suggestions =
        value.length > 0
            ? allGigs.filter((gig) =>
                gig?.title?.toLowerCase().includes(value.toLowerCase()),
                // gig?.category?.toLowerCase().includes(value.toLowerCase())
            )
            : [];
        setFilteredSuggestions(suggestions);

    }
    const handleSuggestionClick = (title) => {
        setSearchTerm(title); // Set the selected suggestion in the input
        setFilteredSuggestions([]); // Clear the suggestions list
    };

    const handleBtn = async () => {
        try{
            setIsLoading(true);
            console.log(searchTerm)
            if(searchTerm === ''){
                setError('Please enter a search term or select a suggestion.');
                return;
            }
            const response = await axios.get(`${GET_GIGS}?searchTerm=${searchTerm}`,{withCredentials: true});
            if(response.data.success){
                setAllGigs(response?.data?.gigs);
                setIsLoading(false);
            }
        }catch(err){
            console.log(err);
        }finally{
            setIsLoading(false);
        }
    }

    useEffect(() => {
        const fetchAllGigs = async () => {
            try{
                const response = await axios.get(`${GET_GIGS}?category=${category === 'All' ? '' : `${category}`}`,{withCredentials: true});

                if(response.data.success){
                    setAllGigs(response?.data?.gigs);
                }

            }catch(err){
                console.log(err)
            }
        };

        fetchAllGigs();

    },[userInfo,category]);

    return (
        <div className='mx-8 my-3'>
            <div className='grid-cols-2 grid w-full items-center'>
                <div className='flex flex-col'>
                    <Select  value={category} onValueChange={(value) => setCategory(value)} className='font-semibold text-xl' >
                        <SelectTrigger className="w-[180px] h-[2.8rem] transition-all font-semibold text-base" >
                            <SelectValue className='font-semibold' placeholder='Select a Category' />
                        </SelectTrigger>
                        <SelectContent >
                            <SelectGroup>
                                {allCategories.map(({name}) => (
                                    <SelectItem className='' key={name} value={name} >
                                        {name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className='relative flex items-center gap-3 justify-center'>   
                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={handleInputChange}
                        placeholder='Search..'
                        className='w-full font-semibold border-[1.5px] rounded-md px-4 py-2.5 outline-slate-900 '
                    />
                    
                    <button 
                        type="button" 
                        className="text-white flex items-center justify-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        onClick={handleBtn}
                    >
                        {
                            isLoading ? (
                            <svg aria-hidden="true" className="inline w-6 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                            </svg>
                            ) : (
                                <span>Search</span>
                            )
                        }
                    </button>
                    {filteredSuggestions.length > 0 && (
                        <ul className="absolute z-10 bg-white border left-1 rounded-md mt-44 max-h-44 max-w-52 overflow-auto">
                            {filteredSuggestions.map((gig, index) => (
                            <li
                                key={gig.id || index}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleSuggestionClick(gig.title)}
                            >
                                {gig.title}
                            </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            <hr className='mt-2 border-[1.3px] border-slate-500' />
            <div className='my-4'>
                {/* <div className='grid grid-cols-4 px-4 bg-slate-100 gap-5 py-4 rounded-lg'>
                    {
                        allGigs?.length > 0 ? (
                            allGigs?.map((gig) => {
                                return(
                                    <AllGigsCard  gig={gig} key={gig?.id} />
                                )
                            })
                        ) : (
                            <div className="flex items-center justify-center h-[300px] w-full">
                                <p className='text-xl text-[#212121] font-semibold'>
                                    No Services Available for selected category..
                                </p>
                            </div>
                        )
                    }
                </div> */}
                <div className="flex items-center justify-center px-4  rounded-lg">
                    {
                        allGigs?.length > 0 ? (
                            <div className="grid grid-cols-4 mt-6 gap-5 w-full">
                                {allGigs?.map((gig) => (
                                    <AllGigsCard gig={gig} key={gig?.id} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-xl text-[#212121] font-semibold text-center">
                                No Services Available for selected category..
                            </p>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default page