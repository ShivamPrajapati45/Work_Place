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
    const [{userInfo},dispatch] = useStateProvider();
    const [category, setCategory] = useState('');
    useAuth();
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

        if(userInfo) fetchAllGigs();

    },[userInfo,category]);
    const labelClassName = 'font-medium text-gray-900 text-sm'

    return (
        <div className='mx-8 my-4'>
            <div className='grid-cols-3 w-full items-center'>
                <div className='flex flex-col'>
                    <Select  value={category} onValueChange={(value) => setCategory(value)} >
                        <SelectTrigger className="w-[180px] transition-all " >
                            <SelectValue placeholder='Select a Category' />
                        </SelectTrigger>
                        <SelectContent >
                            <SelectGroup>
                                <SelectLabel>Category</SelectLabel>
                                {allCategories.map(({name}) => (
                                    <SelectItem className='' key={name} value={name} >
                                        {name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div></div>
                <div></div>
            </div>
            <hr className='mt-2 border-[1.3px] border-slate-500' />
            <div className='my-8'>
                <div className='grid grid-cols-4 px-4 bg-slate-100 gap-5 py-4 rounded-lg'>
                    {
                        allGigs?.length > 0 ? (
                            allGigs?.map((gig) => {
                                return(
                                    <AllGigsCard  gig={gig} key={gig?.id} />
                                )
                            })
                        ) : (
                            <div className='w-full flex justify-center items-center'>
                                <p className='text-xl'>No Services Available for selected category !</p>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default page