import { reducerCases } from '@/context/constants';
import { useStateProvider } from '@/context/StateContext';
import { ADD_REVIEW } from '@/utils/constant';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { FaStar } from 'react-icons/fa';
import Reviews from './Reviews';

const AddReview = () => {
    const [{},dispatch] = useStateProvider();
    const [{}] = useStateProvider();
    const [data, setData] = useState({
        reviewText: '',
        rating: 0
    });
    const {gigId} = useParams();
    // console.log('p',params)


    const addReview = async () => {
        try {
            const res = await axios.post(`${ADD_REVIEW}/${gigId}`,{...data},{withCredentials: true});
            if(res?.data?.success){
                setData({
                    reviewText: '',
                    rating: 0
                });
                dispatch({
                    type: reducerCases.ADD_REVIEW,
                    newReview: res?.data?.newReview
                })
            }

            
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className=''>
            <h3 className='text-xl my-5 font-semibold text-gray-500'>
                Give Review
            </h3>
            <div className='flex flex-col items-start justify-start gap-2'>
                    <textarea 
                        name="reviewText"
                        id="reviewText"
                        minLength={0}
                        maxLength={40}
                        value={data.reviewText}
                        onChange={(e) => setData({...data, reviewText: e.target.value})}
                        placeholder='Add review....'
                        className='block p-3 w-4/5 text-gray-500 bg-gray-50 rounded border border-gray-400'
                    />
                <div className='flex gap-2 mt-1'>
                    {[1,2,3,4,5].map((star) => (
                        <FaStar
                            key={star}
                            className={`cursor-pointer text-2xl ${data.rating >= star ? 'text-yellow-300' : 'text-gray-200'}`}
                            onClick={() => setData({...data, rating: star})}
                        />
                    ))}
                </div>
                <button
                    className='flex items-center border border-gray-400 bg-green-400 justify-center rounded-sm relative py-2 px-3'
                    onClick={addReview}
                >
                    Add Review
                </button>
            </div>
            <Reviews
                addReview={addReview}
                data={data}
                setData={setData}
            />
        </div>
    )
}

export default AddReview