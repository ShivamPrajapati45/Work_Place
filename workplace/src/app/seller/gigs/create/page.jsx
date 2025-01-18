'use client'
import { categories } from '@/utils/categories';
import React, { useState } from 'react'
import ImageUpload from '@/components/ImageUpload';
import axios from 'axios';
import { ADD_GIG_ROUTE } from '@/utils/constant';
import { useRouter } from 'next/navigation';
import { FaAngleRight,FaAngleLeft } from 'react-icons/fa'
import Button from '@/components/seller/Button';

const page = () => {
    const router = useRouter();
    const [files, setFiles] = useState([]);
    const [features, setFeatures] = useState([]);
    const [step, setStep] = useState(0);
    const [isValid, setIsValid] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

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

    const validateStep = (currentData) => {
        let isStepValid = true;
        if (step === 0) {
            if (!currentData.title || !currentData.category) isStepValid = false;
        } else if (step === 1) {
            if (
                !currentData.description ||
                currentData.time <= 0 ||
                currentData.revisions <= 0
            )
                isStepValid = false;
        } else if (step === 2) {
            if (features.length === 0)
                isStepValid = false;
        } else if(step === 3){
            if(!currentData.shortDesc || currentData.price < 0){
                isStepValid = false;
            }
        }
        setIsValid(isStepValid); // Update button state
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setData({
            ...data,
            [name]: value,
        });

        setErrors((prev) => ({...prev, [name]: ''}));
        validateStep({...data, [name]: value})
    };
    const nextStep = () => {
        if(isValid){
            setIsLoading(true);
            setTimeout(() => {
                setStep((prev) => prev+1);
                setIsValid(false);
                setIsLoading(false)
            },2000)
            
        };
    };

    const prevStep = () => {
        setStep((prev) => Math.max(0, prev - 1));
    };

    // Adding feature function
    const addFeature = () => {
        if(data.feature){
            // first it is adding in features array and then clear it in data
            setFeatures([...features,data.feature]);
            setData({...data,feature:''});
            validateStep(data);
        }
    };

    const removeFeature = (index) => {
        const cloneFeatures = [...features];
        cloneFeatures.splice(index,1);
        setFeatures(cloneFeatures);
    };

    const addGig = async () => {
        try {
            setIsLoading(true);
            const { title, category, description, time, revisions, price, shortDesc } = data;
            if(title && category && description && time && revisions && price && shortDesc){
                const formData = new FormData();
                files.forEach((file) => formData.append('images', file));
                const gigData = {
                    title,
                    category,
                    description,
                    time,
                    revisions,
                    price,
                    shortDesc,
                    features
                };

                const response = await axios.post(ADD_GIG_ROUTE,formData,{
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    params: gigData
                });

                if(response?.data?.success){
                    setIsLoading(false);
                    router.push('/seller/gigs');

                }
            }
            
        } catch (error) {
            console.log('err', error);
        }finally{
            setIsLoading(false);
        }
    }

    const inputClassName = 'block p-4 w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500';
    const labelClassName = 'text-lg font-medium text-gray-900'

    return (
        <div className='min-h-[80vh] my-10 mt-0 px-32'>
            <h1 className='text-lg font-bold uppercase'>Create a new Gig</h1>
            <div className="relative w-full h-2 bg-gray-300 rounded-full overflow-hidden mb-4">
                <div 
                    className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300" 
                    style={{ width: `${(step / 3) * 100}%` }}
                ></div>
            </div>
            {/* Step Indicator */}
            <h3 className="text-2xl font-semibold text-slate-600 mb-4">
                Step {step + 1} of 4: Provide the Details of Your Gig
            </h3>
            <hr className="h-[1.5px] my-4 border-0 bg-black/50"/>
            <div className='flex flex-col gap-4 mt-10'>

                {/* step 0 Title and Category*/}
                {step === 0 && (
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
                            {errors.title && <p className='text-red-500'>{errors.title}</p> }
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
                            >
                                {categories.map(({ name }) => (
                                    <option key={name} value={name}>{name}</option>
                                ))}
                            </select>
                            {errors.category && <p className='text-red-500'>{errors.category}</p> }
                        </div>
                    </div>
                )}
                
                {/* step 1 Time, Description, Revisions */}
                {step === 1 && (
                    <div className='grid grid-cols-2 gap-10'>
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
                            />
                            {errors.description && <p className='text-red-500'>{errors.description}</p> }
                        </div>
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
                            {errors.time && <p className='text-red-500'>{errors.time}</p> }
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
                            {errors.revisions && <p className='text-red-500'>{errors.revisions}</p> }

                        </div>
                    </div>
                )}

                {/* step 2  Features, Images */}
                {step === 2 && (
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
                                    {errors.features && <p className='text-red-500'>{errors.features}</p> }
                            </div>
                            <div>
                                <label htmlFor="image" className={labelClassName}>
                                    Gig Images
                                </label>
                                <div>
                                    <ImageUpload files={files} setFile={setFiles} />
                                </div>
                            </div>
                    </div>
                )}

                {/* step 3 ShortDesc and Price */}
                {step === 3 && (
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
                                {errors.shortDesc && <p className='text-red-500'>{errors.shortDesc}</p> }
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
                            {errors.price && <p className='text-red-500'>{errors.price}</p> }
                        </div>
                    </div>
                )}

                {/* Buttons */}
                <div className='flex gap-4'>
                    {step > 0 && (
                        <Button
                            onclick={prevStep}
                            className={"bg-blue-500 text-white"}
                        >
                            <FaAngleLeft className='text-2xl'/>
                            Back
                        </Button>
                    )}

                    {step < 3 && (
                        <Button
                            onclick={nextStep}
                            isLoading={isLoading}
                            isDisabled={!isValid || isLoading}
                            className={`${isValid ? 'bg-blue-500' : 'bg-gray-300 cursor-not-allowed'} text-white`}
                        >
                            Continue
                            <FaAngleRight className='text-2xl'/>
                        </Button>
                    )}

                    {step === 3 && (
                        <Button
                            onclick={addGig}
                            isLoading={isLoading}
                            isDisabled={isLoading}
                            className={`${isValid ? 'bg-blue-500' : 'bg-gray-300 cursor-not-allowed'} text-white`}
                        >
                            Submit
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default page