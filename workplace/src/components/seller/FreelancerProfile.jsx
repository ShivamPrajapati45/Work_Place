import React from "react";
import { TiStar } from 'react-icons/ti';


export const FreelancerProfile = ({ gigData,averageRatings }) => {

    const formateDate = (isoDate) => {
        const date = new Date(isoDate);
        return new Intl.DateTimeFormat('en-US',{ month: 'short',year: 'numeric' }).format(date);
    }

return (
        <div className="max-w-xl w-full bg-slate-100/50  rounded-lg p-6">
            {/* Profile Header */}
            <div className="flex items-center gap-4">
                {gigData?.createdBy?.isProfileInfoSet ? (
                    <div className='h-20 w-20 overflow-hidden'>
                        <img
                            src={gigData?.createdBy?.profileImage}
                            alt='profile'
                            className='rounded-full h-full w-full object-cover'
                        />
                    </div>
                ) : (
                    <div className='bg-purple-500 h-16 w-16 flex items-center justify-center rounded-full relative'>
                        <span className='text-xl text-white'>
                            {gigData?.createdBy?.email[0].toUpperCase()}
                        </span>
                    </div>
                )}
                <div>
                
                <h2 className="text-lg font-semibold">{gigData?.createdBy?.fullName}</h2>
                <p className="text-gray-600">{gigData?.createdBy?.profession}</p>
                <div className="flex items-center">
                    {[1,2,3,4,5].map((star) => (
                        <TiStar
                            key={star}
                            className={`${Math.ceil(averageRatings) >= star ? 'text-yellow-400' : 'text-gray-400'}`}
                            size={22}
                        />
                    ))} 
                    <span className="text-gray-600 font-medium mx-1">
                        {averageRatings !== 'NaN' ? averageRatings : 0.0} ({gigData?.totalReviews} reviews)
                    </span>
                </div>
                {gigData?.badge && (
                    <span className="bg-yellow-300 text-sm px-2 py-1 rounded-md font-semibold">
                    {gigData?.badge}
                    </span>
                )}
                </div>
            </div>

            {/* Contact Button */}
            <button className="mt-4 w-full bg-black text-white py-2 rounded-md hover:bg-gray-800">
                Contact Me
            </button>

            {/* gigData Details */}
            <div className="border p-4 mt-4 bg-gray-100 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <p>
                        <span className="font-semibold">From:</span> {gigData?.createdBy?.location}
                    </p>
                    <p>
                        <span className="font-semibold">Member Since:</span> {formateDate(gigData?.createdBy?.createdAt)}
                    </p>
                    <p>
                        <span className="font-semibold">Email:</span> {gigData?.createdBy?.email}
                    </p>
                    <p>
                        <span className="font-semibold">Skills:</span> {gigData?.createdBy?.skills.join(", ")}
                    </p>
                </div>
                <hr className="my-3 border-1 border-gray-600" />
                <p className="mt-2 text-sm text-gray-700">{gigData?.createdBy?.description}</p>
            </div>
        </div>
    );
};


