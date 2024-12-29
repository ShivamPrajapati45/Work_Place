'use client'
import SearchGridItem from '@/components/search/SearchGridItem';
import { SEARCH_GIGS_ROUTE } from '@/utils/constant';
import axios from 'axios';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'


const page = () => {
    const [gigs, setGigs] = useState([]);
    const router = useRouter();
    const search = useSearchParams();  // search is an object that contains the query parameters
    const query = search.get('q');
    const category = search.get('category');

    useEffect(() => {
        
    
        // console.log('s', query);
        // this function will get the data from the server based on the search term and category
        const getData = async () => {
            try {
                const response = await axios.get(`${SEARCH_GIGS_ROUTE}?searchTerm=${query}&category=${category}`,{withCredentials: true});
                console.log('data', response?.data?.gigs);
                setGigs(response?.data?.gigs);
                // console.log('d',gig);

            } catch (error) {
                console.log('error', error);
            }
        };

        // if the search term or category is provided then we will call the getData function
        if(query || category) getData();

    },[search,query,category])
    // console.log('gig', gigs)


    return (
        <div className='mx-24 mb-24'>
            {query || category && (
                <h3 className='text-4xl mb-10 text-white bg-white'>
                    Results For <strong>{query || category}</strong>
                </h3>
            )}
            <div>
                <button className='py-3 px-5 border border-gray-400 rounded-lg font-medium'>
                    Category
                </button>
                <button className='py-3 px-5 border border-gray-400 rounded-lg font-medium'>
                    Budget
                </button>
                <button className='py-3 px-5 border border-gray-400 rounded-lg font-medium'>
                    Price
                </button>
            </div>
            <div>
                <div className='my-4'>
                    <span className='font-medium text-purple-400'>
                        {gigs?.length} services available
                    </span>
                </div>
                <div className='grid grid-cols-4'>
                    {gigs?.map((gig) => {
                        return(
                            <SearchGridItem  gig={gig} key={gig?.id} />
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default page