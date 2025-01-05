'use client'
import AllGigsCard from '@/components/Gigs/AllGigsCard';
import { useStateProvider } from '@/context/StateContext';
import useAuth from '@/hooks/useAuth';
import { categories } from '@/utils/categories';
import { GET_GIGS } from '@/utils/constant';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

const page = () => {

    const [allGigs, setAllGigs] = useState([]);
    const [{userInfo},dispatch] = useStateProvider();
    const [category, setCategory] = useState('');
    useAuth();
    useEffect(() => {
        const fetchAllGigs = async () => {
            try{
                const response = await axios.get(`${GET_GIGS}?category=${category === 'All' ? '' : `${category}`}`,{withCredentials: true});
                // console.log('AllGigs',response?.data?.gigs);
                if(response.data.success){
                    setAllGigs(response?.data?.gigs);
                }

            }catch(err){
                console.log(err)
            }
        };

        if(userInfo) fetchAllGigs();

    },[userInfo,category]);
    const labelClassName = 'text-lg font-medium text-gray-900'

    return (
        <div className='mx-8 my-4'>
            <div className='grid-cols-3 w-full items-center'>
                <div className='flex flex-col'>
                    <label htmlFor="category" className={labelClassName}>
                        Select By Category
                    </label>
                    <select 
                        name="category"
                        id="category"
                        className='border cursor-pointer border-gray-300 bg-gray-50 transition-all hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-400 rounded-lg px-3 py-2 w-64 outline-none'
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        {
                            categories.map(({ name }) => (
                                <option 
                                    value={name} 
                                    key={name}
                                >
                                    {name}
                                </option>
                            ))
                        }
                    </select>
                </div>
                <div></div>
                <div></div>

                
            </div>
            <div className='my-8'>
                <div className='grid grid-cols-4 px-4 bg-gray-200 gap-8 py-3 rounded-lg'>
                    {allGigs?.map((gig) => {
                        return(
                            <AllGigsCard  gig={gig} key={gig?.id} />
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default page