'use client'
import Footer from '@/components/Footer';
import { Select,SelectContent,SelectGroup,SelectItem,SelectValue,SelectTrigger } from '@/components/ui/select';
import { allCategories } from '@/utils/categories';
import { SEARCH_GIGS_ROUTE } from '@/utils/constant';
import axios from 'axios';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'


const page = () => {
    const [gigs, setGigs] = useState([]);
    const router = useRouter();
    const search = useSearchParams();  // search is an object that contains the query parameters
    const query = search.get('q');
    const searchCategory = search.get('category');
    const [category, setCategory] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    console.log(search, query);

    useEffect(() => {
        // this function will get the data from the server based on the search term and category
        const getData = async () => {
            try {
                const response = await axios.get(`${SEARCH_GIGS_ROUTE}?searchTerm=${query}&category=${category ? category : searchCategory}`,{withCredentials: true});
                // console.log('data', response?.data?.gigs);
                setGigs(response?.data?.gigs);

            } catch (error) {
                console.log('error', error);
            }
        };

        // if the search term or category is provided then we will call the getData function
        if(query || searchCategory) getData();

    },[search,query,category])


    return (
            <div className='bottom-10 my-3 h-[100vh] mb-20'>
                <div className='grid-cols-2 px-16 grid w-full items-center'>
                    <div className='flex flex-col'>
                        <Select  
                            value={category} 
                            onValueChange={(value) => setCategory(value)} className='text-xl' 
                        >
                            <SelectTrigger className="w-[180px] border h-[2.8rem] transition-all text-base" >
                                <SelectValue placeholder='Select a Category' />
                            </SelectTrigger>
                            <SelectContent>
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

                </div>
                <hr className='mt-2 mx-5 border-[1.3px] border-slate-500' />
                <div className="flex h-[80vh] w-full overflow-auto px-4 my-4 rounded-lg">
                    {isLoading ? (
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 w-full'>
                            {Array.from({length: 8}).map((_, index) => (
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
                        gigs && gigs?.length > 0 ? (
                            <div className="grid mx-8 grid-cols-1 lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 h-full gap-5 w-full">
                                {gigs?.map((gig) => (
                                    <AllGigsCard gig={gig} key={gig?.id} />
                                ))}
                            </div>
                        ) : (
                            !isLoading && (
                                <div className="w-full h-full flex flex-col items-center justify-start mt-5 gap-10">
                                    <p className='text-xl text-[#212121] font-semibold text-center'>
                                        No Services Available for selected category..
                                    </p>
                                    <button
                                        onClick={() => router.push('/gigs')}
                                        className='px-2 py-2 rounded-md bg-blue-500 hover:bg-blue-500/80 transition-all duration-300 text-white font-semibold'
                                    >
                                        Explore More Services
                                    </button>
                                </div>
                            )
                        )
                    )}
                </div>
                <Footer/>
            </div>
    )
}

export default page