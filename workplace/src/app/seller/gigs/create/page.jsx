'use client'
import { categories, serviceCategories } from '@/utils/categories';
import React, { useEffect, useState } from 'react'
import ImageUpload from '@/components/ImageUpload';
import axios from 'axios';
import { ADD_GIG_ROUTE, DESCRIPTION_SUGGESTION, FEATURES_SUGGESTION, TITLE_SUGGESTION } from '@/utils/constant';
import { useRouter } from 'next/navigation';
import { FaAngleRight,FaAngleLeft } from 'react-icons/fa'
import Button from '@/components/seller/Button';
import PreviewService from '@/components/Gigs/PreviewService';
import { AiOutlineClose } from 'react-icons/ai';
import { RiChatSmileAiFill } from 'react-icons/ri';
import { IoCopyOutline } from 'react-icons/io5';
import { IoMdSend } from 'react-icons/io';

const page = () => {
    const router = useRouter();
    const [files, setFiles] = useState([]);
    const [features, setFeatures] = useState([]);
    const [step, setStep] = useState(1);
    const [isValid, setIsValid] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [nextBtnHover,setNextBtnHover] = useState(false);
    const [prevBtnHover,setPrevBtnHover] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [chatOpen,setChatOpen] = useState(false);
    const [chatHistory,setChatHistory] = useState([]);
    const [query, setQuery] = useState('');
    const [titleSuggestions, setTitleSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [copiedText,setCopiedText] = useState(null);
    

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

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text)
        .then(() => {
            setCopiedText(text)
            setTimeout(() => setCopiedText(null), 1500);  // 1.5 baad reset
        })
        .catch(() => console.error("Copy failed", err))
    
};

    useEffect(() => {
        if(data.category){
            axios.post(TITLE_SUGGESTION, {category: data.category})
            .then(res => setTitleSuggestions(res.data.titles))
            .catch(err => console.error(err))
        };

    },[data.category])

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
            setIsSubmitting(true);
            // console.log(isSubmitting)
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
                    setIsSubmitting(false);
                    router.push('/seller/gigs');
                }
            }
            
        } catch (error) {
            console.log('err', error);
        }finally{
            setIsSubmitting(false);
        }
    }

    const handleGenerateDescription = async () => {
        setLoading(true);
        setChatOpen(true);

        try {
            if(data.title || data.category){
                const res = await axios.post(DESCRIPTION_SUGGESTION, {
                    title: data.title,
                    category: data.category
                },{
                    headers: {'Content-Type': 'application/json'}
                })
                if(res.data.success){
                    const aiResponse = { type:'response',text: res.data.description };
                    setData((prev) => ({...prev, description: res.data.response}));
                    setChatHistory(prev => [...prev, aiResponse]);
                }
            }
            
        } catch (error) {
            setChatHistory(prev => [...prev, { type: 'response', text: 'Error fetching response' }]);
        } finally{
            setLoading(false);
        }
    }

    const handleAskAI = async () => {
        if(!query.trim()) return;
        setLoading(true);

        const newChat = { type: 'query', text: query};
        setChatHistory(prev => [...prev, newChat]);
        setQuery('');

        // show loader for response
        setChatHistory((prev) => [...prev, { type: 'loading', text: '' }]);

        try {
            const res = await axios.post(DESCRIPTION_SUGGESTION, {query,previousDescription: data.description},{
                headers: {'Content-Type': 'application/json'}
            });

            if(res.data.success){
                const aiResponse = {type: 'response', text: res.data.description};
                setLoading(false);
                setChatHistory(prev => {
                    return prev.filter(msg => msg.type !== 'loading') // Remove loader
                              .concat(aiResponse); // Add AI response
                });
            }
            
        } catch (error) {
            // console.log('Ai', error);
            setChatHistory(prev => prev.filter(msg => msg.type !== 'loading')
                    .concat({ type: 'response', text: 'Error fetching response' }));
            
        }finally{
            setLoading(false);
        }
    }

    const handleSuggestFeatures = async () => {
        setChatOpen(true);
        setChatHistory(prev => [...prev, { type: 'query', text: 'Suggest features' }]);
    
        try {
            const res = await axios.post(FEATURES_SUGGESTION, { description: data.description }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        
            if (res.data.success) {
                const skills = res.data.features.split(',').map(skill => skill.trim()); // Comma se split karke array banao
    
                // Har skill ko alag message ke form me chat me add karo
                skills.forEach((skill, index) => {
                    setTimeout(() => {
                        setChatHistory(prev => [...prev, { type: 'response', text: skill }]);
                    }, index * 500); // Har skill ko 500ms delay ke sath show karo
                });
    
            } else {
                console.error('Error: AI did not return success');
            }
    
        } catch (error) {
            console.error("Error fetching skills:", error);
        }
    };

    const inputClassName = 'block px-2 text-base py-2 w-full text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-400 focus:border-blue-400';
    const labelClassName = 'text-lg text-[#212121]'

    return (
        <div className='w-full flex h-fit justify-center'>
            {/* Loader Overlay */}
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
                            Saving your service...
                        </p>
                        </div>
                    </div>
                )}

            <div className=''>
                {/* content part */}
                <div className='flex items-center justify-center flex-col gap-3 mt-2'>
                    <h1 className='text-lg font-bold uppercase text-center'>Create your new Service</h1>
                    <h3 className="text-lg mt-3  text-[#212121]">
                        Step <strong className='text-blue-600'>{step + 1}</strong> of 4:&nbsp;
                        <span className=''>
                            {step === 0 && "Give the Title and Category of Your Service"}
                            {step === 1 && "Describe Your Service, Set Time, and Define Revisions"}
                            {step === 2 && "Add Features and Upload Service Images"}
                            {step === 3 && "Set the Price and Provide a Short Description"}
                        </span>
                    </h3>
                    <div className="relative w-full h-1.5 mt-3  bg-gray-300 rounded-full overflow-hidden mb-3">
                        <div 
                            className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300" 
                            style={{ width: `${(step / 3) * 100}%` }}
                            ></div>
                    </div>
                </div>
                
                <div className='flex flex-col gap-10 h-full'>
                    {/* step 0 Title and Category*/}
                    {step === 0 && (
                        <div className={`grid grid-cols-1 lg:grid-cols-2 items-center gap-8 animate-in slide-in-from-left duration-500 transition-all `}>
                            <div>
                                <label htmlFor="category" className={labelClassName}>
                                    Select category of service
                                </label>
                                <select 
                                    name="category" 
                                    id="category"
                                    className='text-[#212121] mt-2 text-base w-full rounded-md focus:ring-blue-400 focus:border-blue-400 block '
                                    onChange={handleChange}
                                >
                                    {serviceCategories.map(({ name }) => (
                                        <option 
                                            key={name} 
                                            value={name}
                                            className='text-sm'
                                        >{name}</option>
                                    ))}
                                </select>
                                <p className='text-sm text-gray-500 mt-1'>
                                    Select the category that best fits your service.
                                </p>
                                {errors.category && <p className='text-red-500'>{errors.category}</p> }
                            </div>
                            <div className='relative'>
                                <label htmlFor="title" className={labelClassName}>
                                    Title
                                </label>
                                <input 
                                    type="text" 
                                    id='title'
                                    name='title'
                                    value={data.title}
                                    onChange={handleChange}
                                    className={`${inputClassName} mt-2`}
                                    required
                                    placeholder='Enter title..'
                                />
                                {/* AI Suggested Titles */}
                                {titleSuggestions.length > 0 && (
                                    <div className="absolute top-20 left-0 w-full bg-white border rounded-lg shadow-lg transition-all duration-300 max-h-48 overflow-y-auto p-3">
                                        {/* Header with Close Button */}
                                        <div className="flex justify-between items-center border-b pb-2 mb-2">
                                            <p className="text-gray-700 text-sm font-semibold">AI Suggested Titles</p>
                                            <button
                                                className="text-gray-500 hover:text-gray-800 transition-colors"
                                                onClick={() => setTitleSuggestions([])}
                                            >
                                                ✕
                                            </button>
                                        </div>

                                        {/* Suggested Titles List */}
                                        <ul className="space-y-2">
                                            {titleSuggestions.map((title, index) => (
                                                <li
                                                    key={index}
                                                    className="cursor-pointer text-sm p-2 bg-gray-100 hover:bg-blue-50 rounded-md transition-all"
                                                    onClick={() => setData({ ...data, title })}
                                                >
                                                    {title}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <p className='text-sm text-gray-500 mt-1'>
                                    Write a catchy and descriptive title that highlights your service.
                                </p>
                                {errors.title && <p className='text-red-500'>{errors.title}</p> }
                            </div>
                        </div>
                    )}
                    
                    {/* step 1 Time, Description, Revisions */}
                    {step === 1 && (
                        <div className={`grid grid-cols-1 gap-6 animate-in slide-in-from-right duration-500 transition-all`}>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-16'>
                                <div>
                                    <label htmlFor="delivery" className={labelClassName}>
                                        Service Delivery Time (In Days)
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
                                    <p className="text-sm text-gray-500 mt-1">
                                        Specify how many days it will take you to deliver the service. Be realistic to build trust.
                                    </p>
                                    {errors.time && <p className='text-red-500'>{errors.time}</p> }
                                </div>
                                <div>
                                    <label htmlFor="price" className={labelClassName}>
                                        Service Price ($)
                                    </label>
                                    <input 
                                        type="number" 
                                        id='price'
                                        name='price'
                                        value={data.price}
                                        onChange={handleChange}
                                        className={inputClassName}
                                        required
                                        placeholder='enter price'
                                    />
                                    <p className="text-sm text-gray-500 mt-3">
                                        Set a price that reflects the value of your service. Make sure it's competitive for your market.
                                    </p>
                                    {errors.price && <p className='text-red-500'>{errors.price}</p> }
                                </div>
                            </div>

                            <div> 
                                <label htmlFor="description" className='flex items-center gap-6 text-[#212121]'>
                                    <span>
                                        Gig Description
                                    </span>
                                    <button 
                                        type="button"
                                        onClick={handleGenerateDescription}
                                        className="text-xs bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 px-3 rounded-md transition-all"
                                        disabled={loading} // Disable when loading
                                    >
                                        {loading ? "Generating..." : "Generate with AI"}
                                    </button>
                                </label>
                                <textarea 
                                    name="description" 
                                    id="description"
                                    placeholder='Write description'
                                    className='block mt-2 text-base w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-400'
                                    value={data.description}
                                    onChange={handleChange}
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Write a detailed description of your service. Mention what you offer, your process, and what makes your service unique. Maximum 1500 characters.
                                </p>
                                {errors.description && <p className='text-red-500'>{errors.description}</p> }
                                
                            </div>
                        </div>
                    )}

                    {/* step 2  Features, Images */}
                    {step === 2 && (
                        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in slide-in-from-right duration-500 transition-all`}>
                            <div>
                                <label htmlFor="features" className='text-[#212121] flex gap-3 items-center'>
                                    <span>
                                        Service Features
                                    </span>
                                    <button
                                        type='button'
                                        className="mr-3 bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 text-xs px-3 rounded-md transition-all"
                                        onClick={handleSuggestFeatures}
                                    >
                                        Generate With AI
                                    </button>
                                </label>
                                <div className='flex w-full gap-3 mt-2 items-center mb-5'>
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
                                {features.length > 0 && (
                                        <ul 
                                            className="flex p-2 flex-wrap rounded-lg overflow-auto"
                                            style={{ maxHeight: '60px', maxWidth: '400px', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}
                                        >
                                            {features.map((feature, index) => (
                                                <li
                                                key={index + feature}
                                                className='flex gap-1 bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-blue-900 dark:text-blue-300'
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
                                        <p className="text-sm text-gray-500 mt-3">
                                            Add key features that make your Service stand out. Be specific.
                                        </p>
                                        {errors.features && <p className='text-red-500'>{errors.features}</p> }
                                </div>
                                <div>
                                    <div className='mt-1'>
                                        <ImageUpload files={files} setFile={setFiles} />
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Upload images that showcase your work. Add clear images to attract buyers.
                                    </p>
                                </div>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className='flex gap-4'>
                        {step > 0 && (
                            <button
                                onClick={prevStep}
                                onMouseEnter={() => setPrevBtnHover(true)}
                                onMouseLeave={() => setPrevBtnHover(false)}
                                className="bg-blue-500 text-white flex items-center justify-center gap-1.5 text-lg font-semibold px-5 py-1 rounded-lg"
                            >
                                <FaAngleLeft size={22} className={`${prevBtnHover ? 'translate-x-[-5px]' : ''} transition-all duration-300`}/>
                                Back
                            </button>
                        )}

                        {step < 2 && (
                            <Button
                                onclick={nextStep}
                                isLoading={isLoading}
                                isDisabled={!isValid || isLoading}
                                className={`${isValid ? 'bg-blue-500' : 'bg-gray-300 text-slate-500 cursor-not-allowed'} text-white`}
                                setBtnHover={setNextBtnHover}
                                
                            >
                                Continue
                                <FaAngleRight size={22} className={`${nextBtnHover ? 'translate-x-2 transition-all duration-300' : ''} transition-all duration-300`}/>
                            </Button>
                        )}

                        {step === 2 && (
                            <div className='flex w-full justify-between'>
                                <button
                                    onClick={addGig}
                                    className='bg-blue-500 text-white flex items-center justify-center gap-1.5 text-lg font-semibold px-5 py-2 rounded-lg'
                                    disabled={isLoading}
                                    >
                                    SUBMIT
                                </button>
                                <PreviewService
                                    data={data}
                                    files={files}
                                    features={features}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* below are chatBot implementation */}
                {step > 0 && (
                    <>
                        <div className='fixed bottom-6 right-6'>
                            <button
                                className='bg-blue-500 text-white p-3 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-all'
                                onClick={() => setChatOpen(!chatOpen)}
                            >
                                {chatOpen ? <AiOutlineClose size={30}/> : <RiChatSmileAiFill size={30}/>}
                            </button>
                        </div>
                        {/* Ai chatBox */}
                        {chatOpen && (
                            <div className='fixed transition-transform bg-white duration-500 bottom-20 right-10 shadow-lg border rounded-lg w-[22rem] px-4 py-2 flex flex-col'>
                                <h3 className='text-lg font-semibold mb-1 text-center'>Ask Me</h3>
                                <div className='h-56 flex flex-col overflow-y-auto border p-2 bg-slate-100 mb-2 custom-scrollbar'>
                                    {chatHistory?.map((msg, index) => (
                                        <div key={index} 
                                            className={`py-1.5 my-1 relative px-3 text-xs rounded-lg break-words shadow-md ${msg.type === 'query' ? 'bg-blue-500 text-white self-end' : 'bg-white text-black self-start'}`}
                                            style={{ alignSelf: msg.type === 'query' ? 'flex-end' : 'flex-start' }}
                                        > 
                                            {msg.type === 'loading' ? <span className='animate-pulse'>...</span> : msg.text}
                                            {msg.type !== 'query' && msg.type !== 'loading' && (
                                                <button
                                                    onClick={() => handleCopy(msg.text)}
                                                    className='absolute right-1 bottom-1 text-gray-500 hover:text-gray-700'
                                                >
                                                    {copiedText === msg.text ? <span className='text-xs p-1 text-green-400'>Copied</span> : <IoCopyOutline size={16}/>}
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className='flex items-center bg-slate-100 justify-around gap-2 rounded-md w-full p-2'>
                                    <input 
                                        className='w-full text-sm p-2 border rounded-md' 
                                        placeholder='Type your question...'
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                    ></input>
                                    <button 
                                        className='bg-blue-500 p-2 rounded-full text-white hover:bg-blue-600'
                                        onClick={handleAskAI}
                                    >
                                        <IoMdSend size={26}/>
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
                

            </div>
        </div>

    )
}

export default page