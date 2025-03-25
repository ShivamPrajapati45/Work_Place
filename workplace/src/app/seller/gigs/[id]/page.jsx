'use client'
import { categories,serviceCategories } from '@/utils/categories';
import React, { useEffect, useState } from 'react'
import ImageUpload from '@/components/ImageUpload';
import axios from 'axios';
import { ADD_GIG_ROUTE, EDIT_GIG, GET_GIG_DATA, HOST } from '@/utils/constant';
import { useRouter,useParams } from 'next/navigation';
import toast from 'react-hot-toast';


const page = () => {
    const router = useRouter();
    const { id } = useParams(); // or you can use const params = useParams(); and then use params.id
    const [files, setFiles] = useState([]);
    const [features, setFeatures] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [data, setData] = useState({
        title: '',
        category: '',
        description: '',
        time: 0,
        revisions: 0,
        feature: '',
        price: 0,
        shortDesc: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const {data: {gig}} = await axios.get(`${GET_GIG_DATA}/${id}`,{withCredentials: true})
                setData({...gig, time: gig?.deliveryTime});
                setFeatures(gig?.features);

                // gig.images.forEach((image) => {
                //     const url = HOST + '/uploads/' + image;
                //     const fileName = image;
                //     fetch(url).then(async (res) => {
                //         const contentType = res.headers.get('content-type');
                //         const blob = await res.blob();
                //         const file = new File([blob], fileName, {contentType});
                //         setFiles((prevFiles) => [...prevFiles, file])
                //         // setFiles([file]);
                //     });
                // });
                // console.log('gig: ', gig)

                const filePromises = gig.images.map(async (image) => {
                    const url = HOST + '/uploads/' + image;
                    const fileName = image;
                    const res = await fetch(url);
                    const contentType = res.headers.get('content-type');
                    const blob = await res.blob();
                    return new File([blob], fileName, { contentType });
                });

                const allFiles = await Promise.all(filePromises);
                setFiles(allFiles)
            } catch (error) {
                console.log('err', error);
            }
        };

        if(id) fetchData();

    },[id]);

    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    };

    // Adding feature function
    const addFeature = () => {
        if(data.feature){
            // first it is adding in features array and then clear it in data
            setFeatures([...features,data.feature]);
            setData({...data,feature:''});
        }
    };

    const removeFeature = (index) => {
        const cloneFeatures = [...features];
        cloneFeatures.splice(index,1);
        setFeatures(cloneFeatures);
    };

    const editGig = async () => {
        try {
            setIsSubmitting(true);
            const { title, category, description, time, price } = data;
            if(title && category && description && time > 0  && price > 0){
                const formData = new FormData();
                files.forEach((file) => {
                    formData.append('images', file);
                });
                const gigData = {
                    title,
                    category,
                    description,
                    time,
                    price,
                    features
                };

                const response = await axios.put(`${EDIT_GIG}/${id}`,formData,{
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    params: gigData
                });

                if(response?.data?.success){
                    console.log('response',response);
                    toast.success('Service updated successfully');
                    router.push('/seller/gigs');
                    setIsSubmitting(false);
                }
            }
            
        } catch (error) {
            console.log('err', error);
        }finally{
            setIsSubmitting(false);
        }
    }

    const inputClassName = 'block p-4 w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500';
    const labelClassName = 'mb- text-lg font-medium text-gray-900 dark:text-white'

    return (
        <div className='min-h-[80vh] my-10 mt-0 px-32'>

            {isSubmitting && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
                        <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center">
                        {/* Loader */}
                        <div className="relative flex items-center justify-center">
                            <div className="absolute w-20 h-20 border-4 border-blue-500 border-t-transparent border-b-transparent rounded-full animate-spin"></div>
                            <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent border-b-transparent rounded-full animate-spin-slow"></div>
                        </div>

                        {/* Text */}
                        <p className="text-xl font-semibold text-gray-800 mt-5 animate-pulse">
                            Updating your service...
                        </p>
                        </div>
                    </div>
            )}
            <h1 className='text-lg font-bold'>Edit or Update Your Service</h1>
            <div className='flex flex-col gap-4 mt-10'>
                <div className='grid grid-cols-2 gap-10'>
                    <div>
                        <label htmlFor="title" className={labelClassName}>
                            Service title
                        </label>
                        <input 
                            type="text" 
                            id='title'
                            name='title'
                            value={data.title}
                            onChange={handleChange}
                            className={inputClassName}
                            required
                            placeholder='enter title'
                        />
                    </div>
                    <div>
                        <label htmlFor="category" className={labelClassName}>
                            Select a category
                        </label>
                        <select 
                            name="category" 
                            id="category"
                            className='text-gray-400 rounded-lg border-2 cursor-pointer text-sm focus:ring-blue-400 focus:border-blue-400 block p-4'
                            onChange={handleChange}
                            value={data.category}
                        >
                            {serviceCategories.map(({ name }) => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div> 
                    <label htmlFor="description" className={labelClassName}>
                        Service Description
                    </label>
                    <textarea 
                        name="description" 
                        id="description"
                        placeholder='write a short description'
                        className='block p-2 w-full h-48 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-400'
                        value={data.description}
                        onChange={handleChange}
                    ></textarea>
                </div>
                <div className='grid grid-cols-2 gap-10'>
                    <div>
                        <label htmlFor="delivery" className={labelClassName}>
                            Service Delivery Time (in days)
                        </label>
                        <input 
                            type="number" 
                            id='delivery'
                            name='time'
                            value={data.time}
                            onChange={handleChange}
                            className={inputClassName}
                            required
                            placeholder='Minimum delivery time'
                        />
                    </div>
                    <div>
                        <label htmlFor="" className={labelClassName}>
                            Service Price ($)
                        </label>
                        <input 
                            type="number" 
                            name='price'
                            className={inputClassName}
                            value={data.price}
                            onChange={handleChange}
                            placeholder='Enter price'
                            id='price'
                            required
                        />
                    </div>
                </div>
                <div className='grid grid-cols-2 gap-10'>
                    <div>
                        <label htmlFor="features" className={labelClassName}>
                            Service Features
                        </label>
                        <div className='flex gap-3 items-center mb-5'>
                            <input 
                                type="text" 
                                id='features'
                                name='feature'
                                value={data.feature}
                                onChange={handleChange}
                                className={inputClassName}
                                required
                                placeholder='Enter feature'
                            />
                            <button
                                type='button'
                                className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
                                onClick={addFeature}
                            >
                                ADD
                            </button>
                            </div>
                            {features?.length > 0 && (
                                <ul 
                                    className='flex p-2 flex-wrap rounded-lg overflow-auto'
                                    style={{ maxHeight: '60px', maxWidth: '400px', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}
                                >
                                    {features.map((feature, index) => (
                                        <li
                                        key={index + feature}
                                        className='flex gap-1 bg-blue-100 m-1 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-blue-900 dark:text-blue-300'
                                        >
                                            <span>{feature}</span>
                                            <span
                                                className='text-red-400 cursor-pointer'
                                                onClick={() => removeFeature(index)}
                                                >
                                                x
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}

                    </div>
                    <div>
                        <label htmlFor="image" className={labelClassName}>
                            Service Images
                        </label>
                        <div>
                            <ImageUpload 
                                files={files} 
                                setFile={setFiles} 
                            />
                        </div>
                    </div>
                </div>
                {/* <div className='grid grid-cols-2 gap-10'>
                    <div>
                        <label htmlFor="" className={labelClassName}>
                            Gig Price ($)
                        </label>
                        <input 
                            type="number" 
                            name='price'
                            className={inputClassName}
                            value={data.price}
                            onChange={handleChange}
                            placeholder='Enter price'
                            id='price'
                            required
                        />
                    </div>
                </div> */}
            <div>
                <button 
                    className='border text-lg font-semibold px-5 py-3 text-white bg-primary_button rounded-lg hover:bg-primary_button_hover'
                    onClick={editGig}
                    type='button'
                >
                    UPDATE
                </button>
                </div>
            </div>
        </div>
    )
}

export default page