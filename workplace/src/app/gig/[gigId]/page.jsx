'use client'
import Details from '@/components/Gigs/Details';
import Pricing from '@/components/Gigs/Pricing';
import { reducerCases } from '@/context/constants';
import { useStateProvider } from '@/context/StateContext';
import { CHECK_USER_ORDERED_GIG_ROUTE, GET_GIG_DATA } from '@/utils/constant';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const page = () => {
    const { gigId } = useParams();
    const router = useRouter();
    const [{userInfo}, dispatch] = useStateProvider();

    useEffect(() => {
        const fetchGigData = async () => {
            try {
                const {data: {gig}} = await axios.get(`${GET_GIG_DATA}/${gigId}`,{withCredentials: true});
                dispatch({ type: reducerCases.SET_GIG_DATA,gigData: gig });
                
            } catch (error) {
                console.log(error)
            }
        }

        if(gigId) fetchGigData();
    },[gigId, dispatch]);

    useEffect(() => {
        const checkGigOrdered = async () => {
            try {
                const {data: {hasUserOrderedGig}} = await axios.get(`${CHECK_USER_ORDERED_GIG_ROUTE}/${gigId}`,{withCredentials: true});
                
                dispatch({
                    type: reducerCases.HAS_USER_ORDERED_GIG,
                    hasOrdered: hasUserOrderedGig
                })
            } catch (error) {
                console.log(error)
            }
        };

        if(userInfo) checkGigOrdered();
    },[dispatch, gigId, userInfo])

    return (
        <div className='grid grid-cols-3 mx-32 gap-20'>
            <Details/>
            <Pricing/>
        </div>
    )
}

export default page