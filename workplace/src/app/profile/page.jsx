'use client'
import { reducerCases } from '@/context/constants';
import { useStateProvider } from '@/context/StateContext';
import { BIO_SUGGESTION, SET_USER_IMAGE, SET_USER_INFO } from '@/utils/constant';
import { IoArrowBack } from 'react-icons/io5'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import ReactSelect from 'react-select';
import makeAnimated from 'react-select/animated'
import { experienceLevels, languageOptions, professionOptions } from '@/utils/categories';
import { Select,SelectContent,SelectGroup,SelectItem,SelectLabel,SelectTrigger,SelectValue } from '@/components/ui/select';
import ProfileInput from '@/components/Profile/ProfileInput';
import BackButton from '@/components/Profile/BackButton';
import ProfessionSelect from '@/components/Profile/ProfessionSelect';
import { IoMdSend } from "react-icons/io";
import NextBtn from '@/components/Profile/NextBtn';
import { GrFormNext } from 'react-icons/gr';


const animatedComponents = makeAnimated();

const page = () => {

    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [{userInfo},dispatch] = useStateProvider();
    const [isLoaded, setIsLoaded] = useState(true);
    const [imageHover, setImageHover] = useState(false);
    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");
    const [step, setStep] = useState(3);
    const [socialLinkInput, setSocialLinkInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [selectedLanguages, setSelectedLanguages] = useState([]);
    const [experienceLevel, setExperienceLevel] = useState('');
    const [profession, setProfession] = useState('');
    const [skillInput, setSkillInput] = useState('');
    const [languages,setLanguages] = useState('');
    const [chatOpen,setChatOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [aiRes, setAiRes] = useState('');
    const [chatHistory,setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [btnHover, setBtnHover] = useState(false);

    const [data, setData] = useState({
        userName: '',
        fullName: '',
        description: '',
        skills: [],
        location: '',
        portfolioLink: '',
        socialMediaLinks: [],
        profession: '',
        experienceLevel: '',
        languages: [],
        hourlyRate: '',
        availability: '',
        responseTime: '',
        phoneNumber: ''
    });

    const [allSkills] = useState([
        'JavaScript',
        'React',
        'Python',
    ])

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
        // if(step === 1){
        //     if(!data.userName || !data.fullName || !image){
        //         setErrorMsg('Username, Full Name and Image are required.');
        //         return;
        //     }
        // }

        setIsLoading(true);
        setErrorMsg('');
        setTimeout(() => {
            setStep(step + 1);
            setIsLoading(false)
        }, 3000);

    }

    const setProfile = async () => {
        try {

            const payload = {
                ...data,
                skills: data.skills,
                socialLinks: data.socialMediaLinks
            }


            const res = await axios.post(SET_USER_INFO,payload,{
                withCredentials: true
            });
            
            if(res.data.userNameError){
                setErrorMsg(res.data.msg);
            }else{
                setErrorMsg("");
                if(image){
                    const formData = new FormData();
                    formData.append('profileImage', image);
                    const {data: { user,img }} = await axios.post(SET_USER_IMAGE,formData,{
                        withCredentials: true,
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    if(data.success){
                        router.push('/gigs');
                    }
                }
                dispatch({
                    type: reducerCases.SET_USER,
                    userInfo: {
                        ...userInfo,
                        ...data,
                    },
                })
            }

        } catch (error) {
            console.log(error);
        }
    };

    const handleLanguage = (selectedOptions) => {
        setSelectedLanguages(selectedOptions);
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
            const res = await axios.post(BIO_SUGGESTION, {query},{
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
            setChatHistory(prev => {
                return prev.filter(msg => msg.type !== 'loading')
                            .concat({ type: 'response', text: 'Error fetching response' });
            });      
        }finally{
            setLoading(false);
        }
    }

    const inputClassName = 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500';
    const labelClassName = 'mb-2 text-base uppercase text-gray-900 dark:text-white'
    const inputClass = 'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'

    return (
        <>
                {
                    isLoaded && (
                        <div className='relative rounded-lg mx-auto my-8 flex flex-col md:flex-row items-center max-w-[90vw] h-auto md:h-[75vh] p-6 shadow-xl'>

                                <div className='w-full md:w-[40%] flex items-center justify-center p-4'>
                                    <div className='bg-gray-100 rounded-lg overflow-hidden w-full h-full flex items-center justify-center relative'>
                                        <img 
                                            key={step}
                                            src={step === 1 ? "./images/Basic_detail.jpg" : 
                                                step === 2 ? "./images/professional_detail.jpg" : 
                                                step === 3 ? "./images/Basic_detail.jpg" : 
                                                "./images/Basic_detail.jpg"} 
                                            alt="side-image" 
                                            className="w-full h-full object-cover rounded-lg transition-opacity  duration-700 ease-in-out opacity-100 scale-100 animate-fadeSlide"
                                        /> 
                                    </div>
                                </div>

                                <div className='w-full md:w-[60%] rounded-lg'>

                                    {/* Step 1: Basic Detail */}
                                    {step === 1 && (
                                        <div className=''>
                                            <div 
                                                className='flex gap-1 flex-col items-center cursor-pointer'
                                            >
                                                <label className='text-lg font-semibold text-gray-800'>Select a Profile Picture</label>
                                                <div 
                                                    onMouseEnter={() => setImageHover(true)}
                                                    onMouseLeave={() =>setImageHover(false)}
                                                    className='relative h-24 w-24 flex items-center justify-center rounded-full overflow-hidden cursor-pointer border border-gray-300 shadow-sm'>
                                                    {
                                                        previewImage ?  (
                                                            <img
                                                                src={previewImage}
                                                                alt='Profile'
                                                                className='h-full w-full object-cover rounded-full'
                                                            />
                                                        ) : (
                                                            <img
                                                                src={`${userInfo?.profileImage ? userInfo.profileImage : '/images/avatar.png'}`}
                                                                alt='Profile'
                                                                className='h-full w-full object-cover rounded-full'
                                                            />
                                                        )
                                                    }
                                                        <div className={`absolute bg-black bg-opacity-50 h-full w-full  flex items-center justify-center transition-opacity duration-300 ${imageHover ? 'opacity-100' : 'opacity-0'}`}>
                                                            <span className={'flex items-center justify-center relative'}>
                                                                <svg
                                                                    xmlns='http://www.w1.org/2000/svg'
                                                                    className='w-12 h-12 text-white absolute'
                                                                    fill='currentColor'
                                                                    viewBox='0 0 20 20'
                                                                >
                                                                    <path
                                                                        fillRule='evenodd'
                                                                        clipRule='evenodd'
                                                                        d='M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z'
                                                                    />
                                                                </svg>
                                                                <input 
                                                                    type="file" 
                                                                    onChange={handleFileChange}
                                                                    className='opacity-0 h-20 w-20 rounded-full cursor-pointer'
                                                                    name='profileImage'
                                                                    multiple={true}
                                                                />
                                                            </span>
                                                        </div>
                                                </div>
                                            </div>
                                            {errorMsg && <span className='text-red-500 text-sm'>{errorMsg}</span>}

                                            <div className='grid grid-cols-2 gap-8 px-5 my-2 items-center'>
                                                <div>
                                                    <label className={labelClassName} htmlFor='userName'>enter username</label>
                                                    <input 
                                                        type="text" 
                                                        className={inputClass}
                                                        name='userName'
                                                        value={data.userName}
                                                        onChange={handleChange}
                                                        placeholder='Username'
                                                    />
                                                </div>
                                                <div>
                                                    <label className={labelClassName} htmlFor='fullName'>enter fullName</label>
                                                    <input 
                                                        type="text" 
                                                        className={inputClass}
                                                        name='fullName'
                                                        value={data.fullName}
                                                        onChange={handleChange}
                                                        placeholder='FullName'
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div className='mt-3 px-5'>
                                                <label className='block text-sm font-medium text-gray-700' htmlFor='description'>Bio</label>
                                                <textarea 
                                                    id='description'
                                                    className='mt-1 block w-full  h-24 max-h-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                                                    name='description'
                                                    value={data.description}
                                                    onChange={handleChange}
                                                    placeholder='Write a catchy bio... or Ask AI'
                                                    minLength={5}
                                                    maxLength={100}
                                                />
                                            </div>

                                            <NextBtn
                                                btnHover={btnHover}
                                                setBtnHover={setBtnHover}
                                                handleNextStep={handleNextStep}
                                                isLoading={isLoading}
                                                className={'mt-4 px-6 mx-5 w-auto py-1 text-lg font-semibold text-white bg-blue-600 rounded-md flex items-center justify-center gap-4 disabled:opacity-50'}
                                            />
                                        </div>
                                    )}

                                    {/* Step 2 : Professional Details */}
                                    {step === 2 && (
                                        <div className="flex relative items-center justify-center py-16">
                                            <div className="w-full max-w-3xl bg-white rounded-lg p-8">
                                                <div className="grid grid-cols-2 gap-6">
                                                    {/* Skills Input */}
                                                    <div>
                                                        <label className="block text-gray-700 font-medium mb-2">Skills</label>
                                                        <ProfileInput
                                                            inputClassName={inputClassName}
                                                            input={skillInput}
                                                            setInput={setSkillInput}
                                                            data={data}
                                                            handleAdd={handleAddSkill}
                                                            handleRemove={handleRemoveSkill}
                                                            all={allSkills}
                                                        />
                                                    </div>

                                                    {/* Languages Input */}
                                                    <div>
                                                        <label className="block text-gray-700 font-medium mb-2">Languages</label>
                                                        <ReactSelect 
                                                            options={languageOptions} 
                                                            isMulti
                                                            closeMenuOnSelect={false}
                                                            components={animatedComponents}
                                                            value={selectedLanguages}
                                                            onChange={handleLanguage}
                                                            name="languages"
                                                            className="w-full"
                                                        />
                                                    </div>

                                                    {/* Profession Input */}
                                                    <div>
                                                        <label className="block text-gray-700 font-medium mb-2">Profession</label>
                                                        <ProfessionSelect
                                                            open={open}
                                                            profession={profession}
                                                            setOpen={setOpen}
                                                            setProfession={setProfession}
                                                        />
                                                    </div>

                                                    {/* Experience Input */}
                                                    <div>
                                                        <label className="block text-gray-700 font-medium mb-2">Experience Level</label>
                                                        <Select value={experienceLevel} onValueChange={(value) => setExperienceLevel(value)}>
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Select Experience Level" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectGroup>
                                                                    {experienceLevels.map((level) => (
                                                                        <SelectItem key={level.value} value={level.value}>
                                                                            {level.label}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectGroup>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>

                                                {/* Navigation Buttons */}
                                                <div className="flex justify-between mt-8">
                                                    <BackButton 
                                                        setIsLoading={setIsLoading} 
                                                        setStep={setStep} 
                                                    />
                                                    <NextBtn
                                                        btnHover={btnHover}
                                                        setBtnHover={setBtnHover}
                                                        handleNextStep={handleNextStep}
                                                        isLoading={isLoading}
                                                        className={'mt-4 px-6 w-auto py-1 text-lg font-semibold text-white bg-blue-600 rounded-md flex items-center justify-center gap-4 disabled:opacity-50'}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 3: Contact & Social Links */}
                                    {step === 3 && (
                                        <div className="grid relative grid-cols-2 gap-6 py-16 px-6">
                                            {/* Back Button */}
                                            <button 
                                                onClick={() => {
                                                    setStep(2);
                                                    setIsLoading(false);
                                                }}
                                                className="absolute top-5 left-0 hover:bg-gray-200 p-2 transition-all rounded-full text-2xl text-gray-700 hover:text-gray-900"
                                            >
                                                <IoArrowBack />
                                            </button>

                                            {/* Social Links Input */}
                                            <div>
                                                <label htmlFor="socialLinks" className="block text-lg font-semibold text-gray-700 mb-2">
                                                    Social Links
                                                </label>
                                                <div className="flex gap-3 items-center">
                                                    <input
                                                        type="url"
                                                        id="socialLinks"
                                                        name="socialLinkInput"
                                                        value={socialLinkInput}
                                                        onChange={(e) => setSocialLinkInput(e.target.value)}
                                                        className={`${inputClassName} flex-1`}
                                                        placeholder="Enter a social media link"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none transition-all"
                                                        onClick={() => handleAddSocialLink(socialLinkInput)}
                                                    >
                                                        ADD
                                                    </button>
                                                </div>
                                                {/* Added Links List */}
                                                {data.socialMediaLinks.length > 0 && (
                                                    <ul className="mt-3 flex flex-wrap gap-3 bg-gray-100 rounded-lg p-3 max-h-24 overflow-y-auto border border-gray-300">
                                                        {data.socialMediaLinks.map((link, index) => (
                                                            <li
                                                                key={`${link}-${index}`}
                                                                className="flex gap-2 items-center py-1 px-3 bg-gray-200 rounded-full text-sm font-medium shadow-sm"
                                                            >
                                                                <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline truncate max-w-[150px]">
                                                                    {link}
                                                                </a>
                                                                <span
                                                                    className="text-red-500 cursor-pointer hover:text-red-700"
                                                                    onClick={() => handleRemoveSocialLink(link)}
                                                                >
                                                                    ✕
                                                                </span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>

                                            {/* Portfolio Link Input */}
                                            <div>
                                                <label htmlFor="portfolioLink" className="block text-lg font-semibold text-gray-700 mb-2">
                                                    Portfolio Link
                                                </label>
                                                <input
                                                    type="url"
                                                    id="portfolioLink"
                                                    className={`${inputClassName} w-full`}
                                                    name="portfolioLink"
                                                    value={data.portfolioLink}
                                                    onChange={handleChange}
                                                    placeholder="Enter your portfolio link"
                                                />
                                            </div>

                                            {/* Location Input */}
                                            <div>
                                                <label htmlFor="location" className="block text-lg font-semibold text-gray-700 mb-2">
                                                    Location
                                                </label>
                                                <input
                                                    type="text"
                                                    id="location"
                                                    className={`${inputClassName} w-full`}
                                                    name="location"
                                                    value={data.location}
                                                    onChange={handleChange}
                                                    placeholder="Enter your city, country"
                                                />
                                            </div>

                                            {/* Contact Inputs (Email & Phone) */}
                                            <div>
                                                <label htmlFor="email" className="block text-lg font-semibold text-gray-700 mb-2">
                                                    Email Address
                                                </label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    className={`${inputClassName} w-full`}
                                                    name="email"
                                                    value={data.email}
                                                    onChange={handleChange}
                                                    placeholder="Enter your email"
                                                />
                                            </div>

                                            {/* Submit Button */}
                                            <div className="col-span-2 flex justify-end mt-5">
                                                <button
                                                    className="px-6 py-2 text-lg font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none transition-all"
                                                    onClick={setProfile}
                                                    type="button"
                                                >
                                                    Set Profile
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                </div>

                                {/* below are chatBot implementation */}
                                <div className='fixed bottom-6 right-6'>
                                    <button
                                        className='w-14 h-14 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-all'
                                        onClick={() => setChatOpen(!chatOpen)}
                                    >
                                        {chatOpen ? '✖' : '💬'}
                                    </button>
                                </div>

                                {/* Ai chatBox */}
                                {chatOpen && (
                                    <div className='fixed bottom-20 right-6 bg-white shadow-lg border rounded-lg w-[22rem] p-4 flex flex-col'>

                                        <h3 className='text-lg font-semibold mb-1 text-center'>Ask Me</h3>

                                        <div className='h-56 flex flex-col overflow-y-auto border p-2 bg-gray-100 mb-2 custom-scrollbar'>
                                            {chatHistory?.map((msg, index) => (
                                                <div key={index} 
                                                    className={`py-1 my-1 px-2 text-xs rounded-lg break-words shadow-md ${msg.type === 'query' ? 'bg-blue-500 text-white self-end' : 'bg-white text-black self-start'}`}
                                                    style={{ alignSelf: msg.type === 'query' ? 'flex-end' : 'flex-start' }}
                                                > 
                                                    {msg.type === 'loading' ? <span className='animate-pulse'>...</span>:msg.text}
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
                        </div>
                    )
                }
        </>
    )
}

export default page