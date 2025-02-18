'use client'
import AllGigsCard from '@/components/Gigs/AllGigsCard';
import { useStateProvider } from '@/context/StateContext';
import { allCategories } from '@/utils/categories';
import { GET_GIGS } from '@/utils/constant';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import {Select, SelectContent,SelectItem, SelectGroup,SelectTrigger, SelectValue} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton';

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
        setIsLoading(true);
        try{
            console.log(searchTerm)
            if(searchTerm === ''){
                setError('Please enter a search term or select a suggestion.');
                return;
            }
            const response = await axios.get(`${GET_GIGS}?searchTerm=${searchTerm}`,{withCredentials: true});
            if(response.data.success){
                setTimeout(() => {
                    setAllGigs(response?.data?.gigs);
                    setIsLoading(false);
                }, 3000);
            }
        }catch(err){
            console.log(err);
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const fetchAllGigs = async () => {
            setIsLoading(true)
            try{
                const response = await axios.get(`${GET_GIGS}?category=${category === 'All' ? '' : `${category}`}`,{withCredentials: true});

                if(response.data.success){
                    setTimeout(() => {
                        setAllGigs(response?.data?.gigs || []);
                        setIsLoading(false);
                    }, 3000);
                }

            }catch(err){
                console.log(err);
                setIsLoading(false);
            }
        };

        fetchAllGigs();

    },[userInfo,category]);
    
    return (
        <div className='mx-8 bottom-10 my-3 h-[100vh] mb-20'>
            <div className='grid-cols-2 grid w-full items-center'>
                <div className='flex flex-col'>
                    <Select  
                        value={category} 
                        onValueChange={(value) => setCategory(value)} className='text-xl' 
                    >
                        <SelectTrigger className="w-[180px] h-[2.8rem] transition-all text-base" >
                            <SelectValue placeholder='Select a Category' />
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
                        Search
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

            
                <div className="flex h-[80vh] w-full overflow-auto px-4 my-4 rounded-lg">
                    {isLoading ? (
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 w-full'>
                            {Array.from({length: 16}).map((_, index) => (
                                <div 
                                    key={index} 
                                    className='flex flex-col items-center justify-center p-4 space-y-4 border border-gray-200 rounded-lg shadow-sm'
                                >
                                    <Skeleton className='h-[125px] w-full rounded-md bg-gray-200'/>
                                    <div className='space-y-2 flex flex-col gap-2'>
                                        <Skeleton className='h-4 w-[250px] bg-gray-200'/>
                                        <Skeleton className='h-4 w-[250px] bg-gray-200'/>
                                        <Skeleton className='h-4 w-2/4 rounded bg-gray-200'/>
                                        <Skeleton className="h-14 w-14 rounded-full bg-gray-200" />
                                    </div>

                                </div>
                            ))}
                        </div>
                    ):(
                        allGigs && allGigs?.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3  h-full gap-5 w-full">
                                {allGigs?.map((gig) => (
                                    <AllGigsCard gig={gig} key={gig?.id} />
                                ))}
                            </div>
                        ) : (
                            !isLoading && (
                                <p className="text-xl text-[#212121] font-semibold text-center">
                                    No Services Available for selected category..
                                </p>
                            )
                        )
                    )}
                </div>
        </div>
    )
}

export default page