'use client'
import { categories } from '@/utils/categories';
import React, { useEffect, useState } from 'react'
import ImageUpload from '@/components/ImageUpload';
import axios from 'axios';
import { ADD_GIG_ROUTE, EDIT_GIG, GET_GIG_DATA, HOST } from '@/utils/constant';
import { useRouter,useParams } from 'next/navigation';


const page = () => {
    const router = useRouter();
    const { id } = useParams(); // or you can use const params = useParams(); and then use params.id
    const [files, setFiles] = useState([]);
    const [features, setFeatures] = useState([]);
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
                setData({...gig, time: gig?.revisions});
                setFeatures(gig?.features);

                gig.images.forEach((image) => {
                    const url = HOST + '/uploads/' + image;
                    const fileName = image;
                    fetch(url).then(async (res) => {
                        const contentType = res.headers.get('content-type');
                        const blob = await res.blob();
                        const files = new File([blob], fileName, {contentType});
                        setFiles([files]);
                    });
                })
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
            const { title, category, description, time, revisions, price, shortDesc } = data;
            if(title && category && description && time > 0 && revisions > 0 && price > 0 && shortDesc){
                const formData = new FormData();
                files.forEach((file) => {
                    formData.append('images', file);
                });
                const gigData = {
                    title,
                    category,
                    description,
                    time,
                    revisions,
                    price,
                    shortDesc,
                    features,
                };

                const response = await axios.put(`${EDIT_GIG}/${id}`,formData,{
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    params: gigData
                });

                if(response?.data?.success){
                    router.push('/seller/gigs');
                }
            }
            
        } catch (error) {
            console.log('err', error);
        }
    }

    const inputClassName = 'block p-4 w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500';
    const labelClassName = 'mb- text-lg font-medium text-gray-900 dark:text-white'

    return (
        <div className='min-h-[80vh] my-10 mt-0 px-32'>
            <h1 className='text-lg font-bold'>Edit or Update Your Gig</h1>
            <div className='flex flex-col gap-4 mt-10'>
                <div className='grid grid-cols-2 gap-10'>
                    <div>
                        <label htmlFor="title" className={labelClassName}>
                            Gig title
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
                            select a category
                        </label>
                        <select 
                            name="category" 
                            id="category"
                            className='text-gray-400 text-sm focus:ring-blue-400 focus:border-blue-400 block p-4'
                            onChange={handleChange}
                            value={data.category}
                        >
                            {categories.map(({ name }) => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div> 
                    <label htmlFor="description" className={labelClassName}>
                        Gig Description
                    </label>
                    <textarea 
                        name="description" 
                        id="description"
                        placeholder='write a short description'
                        className='block p-2 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-400'
                        value={data.description}
                        onChange={handleChange}
                    ></textarea>
                </div>
                <div className='grid grid-cols-2 gap-10'>
                    <div>
                        <label htmlFor="delivery" className={labelClassName}>
                            Gig Delivery
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
                        <label htmlFor="revision" className={labelClassName}>
                            Gig Revision
                        </label>
                        <input 
                            type="number" 
                            id='revision'
                            name='revisions'
                            value={data.revisions}
                            onChange={handleChange}
                            className={inputClassName}
                            required
                            placeholder='max number of revisions'
                        />
                    </div>
                </div>
                <div className='grid grid-cols-2 gap-10'>
                    <div>
                        <label htmlFor="features" className={labelClassName}>
                            Gig Features
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
                                <ul className='flex '>
                                    {features.map((feature, index) => (
                                        <li
                                        key={index + feature}
                                        className='flex gap-2 items-center py-2 px-5 mb-2 text-sm font-medium'
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
                        </div>
                        <div>
                            <label htmlFor="image" className={labelClassName}>
                                Gig Images
                            </label>
                            <div>
                                <ImageUpload 
                                    files={files} 
                                    setFile={setFiles} 
                                />
                            </div>
                        </div>
                </div>
                <div className='grid grid-cols-2 gap-10'>
                    <div>
                        <label htmlFor="shortDesc" className={labelClassName}>
                            Short Description
                        </label>
                        <input 
                            type="text" 
                            name='shortDesc'
                            className={inputClassName}
                            value={data.shortDesc}
                            onChange={handleChange}
                            placeholder='Enter short description'
                            id='shortDesc'
                            required
                            />
                    </div>
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
            </div>
            <div>
                <button 
                    className='border text-lg font-semibold px-5 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600'
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