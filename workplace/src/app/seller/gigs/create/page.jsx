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

    const inputClassName = 'block px-2 text-base mt-2 py-2 w-full text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-400 focus:border-blue-400';
    const labelClassName = 'text-lg  text-[#212121]'

    return (
        <div className='w-full flex min-h-[100vh] mx-4 '>
            <div className=''>

                {/* content part */}
                <div className='flex items-center justify-center w-full flex-col'>
                    <h1 className='text-lg font-bold uppercase text-center'>Create a new Gig</h1>
                    <h3 className="text-base mt-3  text-[#212121]">
                        Step <strong className='text-blue-600'>{step + 1}</strong> of 4:&nbsp;
                        <span className=''>
                            {step === 0 && "Provide the Title and Category for Your Gig"}
                            {step === 1 && "Describe Your Gig, Set Time, and Define Revisions"}
                            {step === 2 && "Add Features and Upload Gig Images"}
                            {step === 3 && "Set the Price and Provide a Short Description"}
                        </span>
                    </h3>
                    <div className="relative w-full  h-1 mt-3 bg-gray-300 rounded-full overflow-hidden mb-2">
                        <div 
                            className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300" 
                            style={{ width: `${(step / 3) * 100}%` }}
                            ></div>
                    </div>
                </div>
                
                <div className='flex flex-col gap-10 mt-5'>
                    {/* step 0 Title and Category*/}
                    {step === 0 && (
                        <div className={`grid grid-cols-1 gap-4 animate-in slide-in-from-left duration-500 transition-all `}>
                            <div className=''>
                                <label htmlFor="title" className={labelClassName}>
                                    Title
                                </label>
                                <input 
                                    type="text" 
                                    id='title'
                                    name='title'
                                    value={data.title}
                                    onChange={handleChange}
                                    className={inputClassName}
                                    required
                                    placeholder='Enter title..'
                                />
                                {errors.title && <p className='text-red-500'>{errors.title}</p> }
                            </div>
                            <div>
                                <label htmlFor="category" className={labelClassName}>
                                    Select a category
                                </label>
                                <select 
                                    name="category" 
                                    id="category"
                                    className='text-[#212121] text-base mt-2 w-full rounded-md focus:ring-blue-400 focus:border-blue-400 block '
                                    onChange={handleChange}
                                >
                                    {categories.map(({ name }) => (
                                        <option 
                                            key={name} 
                                            value={name}
                                            className='text-sm'
                                        >{name}</option>
                                    ))}
                                </select>
                                {errors.category && <p className='text-red-500'>{errors.category}</p> }
                            </div>
                        </div>
                    )}
                    
                    {/* step 1 Time, Description, Revisions */}
                    {step === 1 && (
                        <div className={`grid grid-cols-1 gap-6 animate-in slide-in-from-right duration-500 transition-all`}>
                            <div className='flex items-center w-full gap-4'>
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

                            <div> 
                                <label htmlFor="description" className={labelClassName}>
                                    Gig Description
                                </label>
                                <textarea 
                                    name="description" 
                                    id="description"
                                    placeholder='Write description'
                                    className='block mt-2 text-lg w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-400'
                                    value={data.description}
                                    onChange={handleChange}
                                />
                                {errors.description && <p className='text-red-500'>{errors.description}</p> }
                            </div>
                        </div>
                    )}

                    {/* step 2  Features, Images */}
                    {step === 2 && (
                        <div className={`grid grid-cols-1 gap-6 animate-in slide-in-from-right duration-500 transition-all`}>
                            <div>
                                <label htmlFor="features" className={labelClassName}>
                                    Gig Features
                                </label>
                                <div className='flex w-full gap-3 items-center mb-5'>
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
                                        className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
                                        onClick={addFeature}
                                    >
                                        ADD
                                    </button>
                                </div>
                                        <ul 
                                            className="flex flex-wrap rounded-lg overflow-auto"
                                            style={{ maxHeight: '60px', maxWidth: '400px', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}
                                        >
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
                                    <div className='mt-1'>
                                        <ImageUpload files={files} setFile={setFiles} />
                                    </div>
                                </div>
                        </div>
                    )}

                    {/* step 3 ShortDesc and Price */}
                    {step === 3 && (
                        <div className={`grid grid-cols-1 gap-6 animate-in slide-in-from-right duration-500 transition-all`}>
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
                                className={`${isValid ? 'bg-blue-500' : 'bg-gray-300 text-slate-500 cursor-not-allowed'} text-white`}
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
                                className={`${isValid ? 'bg-blue-500' : 'bg-gray-300 text-slate-500 cursor-not-allowed'} text-white`}
                            >
                                Submit
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>

    )
}

export default page