'use client'
import Image from 'next/image';
import React, { useState } from 'react'

const imageUpload = ({ files, setFile }) => {

    const [msg, setMsg] = useState('');
    console.log('files',files)
    
    const handleFile = (e) => {
        setMsg('');
        let file = e.target.files;

        for(let i=0; i < file.length; i++){
            const fileType = file[i].type;
            const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if(validImageTypes.includes(fileType)){
                setFile([...files, file[i]]);
            }else{
                setMsg('Please select valid image type (jpg, jpeg, png)');
            }
        }
    };
    // console.log('files: ', files)
    const removeImage = (fileName) => {
        setFile(files.filter((x) => x.name !== fileName));
    }

    return (
        <div>
            <div className='flex items-center px-3'>
                <div className='rounded-lg bg-gray-50 w-full'>
                    <div className='m-4'>
                    {msg && (
                            <span className="flex justify-center items-center text-lg mb-1 text-red-500">
                                {msg}
                            </span>
                    )}
                        <div className='flex items-center justify-center w-full'>
                            <label htmlFor="" className='flex cursor-pointer flex-col w-full h-20 border-2 rounded-md border-dashed hover:bg-gray-100 hover:border-gray-300'>
                                <div className='flex flex-col items-center justify-center pt-3.5'>
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        className='h-10 w-10 text-gray-400 group-hover:text-gray-600' 
                                        fill="currentColor" 
                                        viewBox="0 0 24 24" 
                                        stroke="currentColor"
                                    >
                                        <path   
                                            fillRule='evenodd'
                                            d='M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z'
                                            clipRule={'evenodd'}
                                        />
                                    </svg>
                                    <p className=' text-sm tracking-wider text-gray-400 group-hover:text-gray-600'>
                                        Select a photo
                                    </p>
                                </div>
                                <input 
                                    type="file" 
                                    onChange={handleFile}
                                    multiple={true}
                                    className='opacity-0' 
                                    name='files[]'
                                />
                            </label>
                        </div>
                        <div className='flex flex-wrap gap-2 mt-2'>
                            {files?.map((file, key) => (
                                    <div key={key} className='relative overflow-hidden border border-black'>
                                        <i
                                            onClick={() => {
                                                removeImage(file.name);
                                            }}
                                            className='mdi mdi-close absolute right-1 hover:text-white cursor-pointer z-20'
                                        >
                                            X
                                        </i>
                                        <div className='relative h-20 w-20 rounded-md'>
                                            <img
                                                src={URL.createObjectURL(file)}
                                                className='h-full w-full object-cover rounded-md'
                                                alt='Gigs'
                                            />
                                        </div>
                                    </div>
                            )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default imageUpload