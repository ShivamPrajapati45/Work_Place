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
    const maxLength = 150;
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
        <div className='w-full px-2'>
            <h3 className='text-xl my-4 text-[#212121]'>
                Give Review
            </h3>
            <div className='flex flex-col items-start justify-start gap-2'>
                <div className='relative w-[18rem] h-24 border'>
                    <textarea 
                        name="reviewText"
                        id="reviewText"
                        minLength={0}
                        maxLength={maxLength}
                        value={data.reviewText}
                        onChange={(e) => setData({...data, reviewText: e.target.value})}
                        placeholder='Add review....'
                        className='block w-full p-3 h-full text-gray-500 bg-gray-50 rounded border border-gray-400 resize-none'
                    />
                    <span className='absolute bottom-2 right-1 text-sm text-gray-500'>
                        {data.reviewText.length}/{maxLength}
                    </span>
                </div>
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
                    className='flex items-center border border-gray-400 text-white bg-yellow-400 hover:bg-yellow-500/80 transition-all duration-300 justify-center rounded-sm relative py-2 px-3'
                    onClick={addReview}
                >
                    Add Review
                </button>
            </div>
            {/* <Reviews
                addReview={addReview}
                data={data}
                setData={setData}
            /> */}
        </div>
    )
}

export default AddReview