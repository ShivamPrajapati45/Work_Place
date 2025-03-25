'use client'
import { reducerCases } from '@/context/constants';
import { useStateProvider } from '@/context/StateContext';
import { BIO_SUGGESTION, SET_USER_IMAGE, SET_USER_INFO, SKILLS_SUGGESTION } from '@/utils/constant';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation';
import makeAnimated from 'react-select/animated'
import { IoMdSend } from "react-icons/io";
import FirstStep from '@/components/Profile/FirstStep';
import SecondStep from '@/components/Profile/SecondStep';
import ThirdStep from '@/components/Profile/ThirdStep';
import { RiChatSmileAiFill } from "react-icons/ri";
import { AiOutlineClose } from "react-icons/ai";
import { IoCopyOutline } from 'react-icons/io5';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { ubuntu } from '@/utils/fonts';

const animatedComponents = makeAnimated();
const steps = [
    { id: 1, title: "Basic Details" },
    { id: 2, title: "Professional Details" },
    { id: 3, title: "Contact & Social Links" }
];

const page = () => {

    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [{userInfo},dispatch] = useStateProvider();
    const [isLoaded, setIsLoaded] = useState(true);
    const [imageHover, setImageHover] = useState(false);
    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");
    const [step, setStep] = useState(1);
    const [socialLinkInput, setSocialLinkInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [selectedLanguages, setSelectedLanguages] = useState([]);
    const [experienceLevel, setExperienceLevel] = useState('');
    const [profession, setProfession] = useState('');
    const [skillInput, setSkillInput] = useState('');
    const [chatOpen,setChatOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [chatHistory,setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [btnHover, setBtnHover] = useState(false);
    const [copiedText,setCopiedText] = useState(null);
    const [isSubmitting,setIsSubmitting] = useState(false);

    const handleCopy = (text) => {
            navigator.clipboard.writeText(text)
            .then(() => {
                setCopiedText(text)
                setTimeout(() => setCopiedText(null), 1500);  // 1.5 baad reset
            })
            .catch(() => console.error("Copy failed", err))
        
    };

    const [data, setData] = useState({
        userName: '',
        fullName: '',
        description: '',
        skills: [],
        location: '',
        email: '',
        portfolioLink: '',
        socialMediaLinks: [],
        profession: '',
        experienceLevel: '',
        languages: [],
    });

    const [allSkills] = useState([
        'JavaScript',
        'React',
        'Python',
    ]);

    useEffect(() => {
        const handleData = {...data};
        if(userInfo){
            if(userInfo?.username) handleData.userName = userInfo.username;
            if(userInfo?.fullName) handleData.fullName = userInfo.fullName;
            if(userInfo?.description) handleData.description = userInfo.description;
        }
        setData(handleData);
        setIsLoaded(true);
    },[userInfo]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];  // single file selection
        if(file){
            const fileType = file.type;
            const validImageTypes = ['image/png', 'image/jpeg', 'image/jpg'];
            if (validImageTypes.includes(fileType)) {
                const imageUrl = URL.createObjectURL(file);
                setImage(file); // store file for backend upload
                setPreviewImage(imageUrl);
            }else{
                console.error('Invalid File Type');
                
            }
        }else{
            console.error('No File Selected');
            
        }
    };

    const handleChange = (e) => {
        setErrorMsg('')
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    };

    const handleAddSkill = (skill) => {
        if(!data.skills.includes(skill)){
            setData({...data, skills: [...data.skills, skill]})
        }
        setSkillInput('');
    };

    const handleRemoveSkill = (skill) => {
        setData({...data, skills: data.skills.filter((s) => s !== skill)})
    };

    const handleAddSocialLink = (link) => {
        if (link && !data.socialMediaLinks.includes(link)) {
            setData((prevData) => ({
                ...prevData,
                socialMediaLinks: [...prevData.socialMediaLinks, link],
            }));
            setSocialLinkInput(""); // Clear input field
        }
    };
    
    const handleRemoveSocialLink = (link) => {
        setData((prevData) => ({
            ...prevData,
            socialMediaLinks: prevData.socialMediaLinks.filter((item) => item !== link),
        }));
    };

    const handleNextStep = () => {
        setErrorMsg('');
        if(step === 1){
            if(!data.userName || !data.fullName || !image || !experienceLevel || !profession){
                setErrorMsg('All Field Required.');
                return;
            }else{
                setErrorMsg('');
            }
        }else if(step === 2){
            if(!data.description || data.description.length < 5){
                setErrorMsg('Bio must be at least 5 characters long.');
                return;
            }else if(data.skills.length === 0){
                setErrorMsg('Add at least one skill.');
                return;
            }else if(!selectedLanguages || selectedLanguages.length === 0){
                setErrorMsg('Add at least one language.');
                return;
            }else{
                setErrorMsg('');
            }
        }

        setIsLoading(true);
        setErrorMsg('');
        setTimeout(() => {
            setStep(step + 1);
            setIsLoading(false)
        }, 3000);

    }

    const handleLanguage = (selectedOptions) => {
        setSelectedLanguages(selectedOptions);
        const selectedValues = selectedOptions?.map(option => option?.value);
        setData(prevData => ({
            ...prevData,
            languages: selectedValues,
        }))
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
            const res = await axios.post(BIO_SUGGESTION, {query,previousBio: data.description},{
                headers: {'Content-Type': 'application/json'}
            });

            if(res.data.success){
                const aiResponse = {type: 'response', text: res.data.response};
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

    const handleGenerateBio = async () => {
        setLoading(true);
        setChatOpen(true);

        try {
            if(profession || experienceLevel || data.fullName){
                const res = await axios.post(BIO_SUGGESTION, {
                    profession,
                    experienceLevel,
                    fullName: data.fullName
                },{
                    headers: {'Content-Type': 'application/json'}
                })
                if(res.data.success){
                    const aiResponse = { type:'response',text: res.data.response };
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

    const handleSuggestSkills = async () => {
        setChatHistory(prev => [...prev, { type: 'query', text: 'Suggest skills based on my bio' }]);
    
        try {
            const res = await axios.post(SKILLS_SUGGESTION, { bio: data.description }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        
            if (res.data.success) {
                const skills = res.data.skills.split(',').map(skill => skill.trim()); // Comma se split karke array banao
    
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
            alert("Something went wrong.");
        }
    };
    
    const setProfile = async () => {
        try {
            if(!data.location){
                setErrorMsg('Location is required.');
                return;
            }else if(!data.email){
                setErrorMsg('Email is required.');
                return;
            }

            setIsSubmitting(true);
            setErrorMsg(""); // Error message reset
    
            const payload = {
                ...data,
                skills: data.skills,
                socialLinks: data.socialMediaLinks,
                profession: profession,
                experienceLevel: experienceLevel
            };
    
            const res = await axios.post(SET_USER_INFO, payload, {
                withCredentials: true
            });
    
            if (res.data.success) {
                if (image) {
                    // अगर image है तो पहले profile image upload होगा
                    const formData = new FormData();
                    formData.append('profileImage', image);
    
                    const { data } = await axios.post(SET_USER_IMAGE, formData, {
                        withCredentials: true,
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
    
                    if (data.success) {
                        dispatch({
                            type: reducerCases.SET_USER,
                            userInfo: {
                                ...userInfo,
                                ...data,
                            },
                        });
                        toast.success('Profile Created Successfully')
                        router.push('/gigs');
                    }
                } else {
                    // अगर कोई image नहीं है तो सीधे redirect कर दो
                    dispatch({
                        type: reducerCases.SET_USER,
                        userInfo: {
                            ...userInfo,
                            ...data,
                        },
                    });
                    router.push('/gigs');
                }
            } else if (res.data.userNameError) {
                setErrorMsg(res.data.msg);
            }
        } catch (error) {
            console.log(error);
            toast.error('Profile Updation Failed');
        } finally {
            setIsSubmitting(false); // अब loading हर condition में properly reset होगा
        }
    };
    const previewData = {
        ...data,
        profession: profession,
        experienceLevel: experienceLevel
    };
    const handlers = {
        handleAddSkill,
        handleAddSocialLink,
        handleRemoveSocialLink,
        handleChange,
        handleFileChange,
        setImage,
        setImageHover,
        handleNextStep,
        handleRemoveSkill,
        handleLanguage,
        setStep,
        setExperienceLevel,
        setProfession,
        setSkillInput,
        setIsLoading,
        setOpen,
        setProfile,
        setSocialLinkInput,
        setBtnHover,
        setQuery,
    }
    const state = {
        query,
        errorMsg,
        previewImage,
        imageHover,
        userInfo,
        btnHover,
        isLoading,
        allSkills,
        selectedLanguages,
        animatedComponents,
        experienceLevel,
        open,
        profession,
        skillInput,
        socialLinkInput,
        previewData
    }

    

    return (
        <>
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
                            Setting up your profile...
                        </p>
                        </div>
                    </div>
                )}


                {/* Main Content */}
                <div className={` ${ubuntu.className} relative rounded-lg mx-auto my-6 flex flex-col md:flex-row  justify-center max-w-[90vw] h-auto md:h-[75vh] p-4`}>

                        <div className="w-full md:w-[30%] flex flex-col items-center border-r-2 shadow-md shadow-purple-300 p-4 relative  justify-center rounded-md">
                            <div className="relative flex flex-col items-start gap-20 w-full">
                                
                                {/* Progress Line (Full Gray, Changes to Blue on Step) */}
                                <div className="absolute left-[22px] top-[40px] w-[4px] h-[240px] bg-gray-300 rounded-full"></div>
                                
                                {/* Dynamic Progress Line */}
                                <motion.div 
                                    className="absolute left-[22px] top-[40px] w-[4px] bg-primary_text rounded-full" 
                                    initial={{ height: 0 }} 
                                    animate={{ height: step === 1 ? "0px" : step === 2 ? "90px" : "240px" }}
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                ></motion.div>

                                {steps.map((item, index) => (
                                    <div key={item.id} className="flex items-center gap-4 relative">
                                        
                                        {/* 🔹 Step Circle (With Hover & Animation) */}
                                        <motion.div 
                                            className={`w-12 h-12 flex items-center justify-center rounded-full font-bold text-lg shadow-md transition-all duration-300 
                                                ${step >= item.id ? "bg-primary_text text-white" : "bg-gray-300 text-gray-700"}
                                            `}
                                            whileHover={{ scale: 1.1 }}
                                            animate={{ scale: step === item.id ? 1.2 : 1 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {item.id}
                                        </motion.div>
                                        
                                        {/* 🔹 Step Title */}
                                        <motion.p 
                                            className={`text-lg font-semibold transition-all duration-300 
                                                ${step === item.id ? "text-primary_text" : step > item.id ? "text-primary_text" : "text-gray-500"}`}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: 0.1 }}
                                        >
                                            {item.title}
                                        </motion.p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className='w-full md:w-[70%] rounded-lg'>
                            {/* Step 1: Basic Detail */}
                            {step === 1 && (
                                <FirstStep
                                    data={data}
                                    state={state}
                                    handlers={handlers}
                                />
                            )}
                            {/* Step 2 : Professional Details */}
                            {step === 2 && (
                                <SecondStep
                                    data={data}
                                    state={state}
                                    handlers={handlers}
                                    handleGenerateBio={handleGenerateBio}
                                />
                            )}
                            {/* Step 3: Contact & Social Links */}
                            {step === 3 && (
                                <ThirdStep
                                    data={data}
                                    state={state}
                                    handlers={handlers}
                                />
                            )}
                        </div>

                        {/* below are chatBot implementation */}
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
                                {data.description !== '' && (
                                    <button
                                        className='bg-green-500 text-white mt-2 p-2 rounded-lg w-full text-sm hover:bg-green-600'
                                        onClick={handleSuggestSkills}
                                    >
                                        Suggest Skills
                                    </button>
                                )}
                                
                            </div>
                        )}
                </div>
        </>
    )
}

export default page