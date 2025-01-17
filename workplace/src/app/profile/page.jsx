'use client'
import { reducerCases } from '@/context/constants';
import { useStateProvider } from '@/context/StateContext';
import { SET_USER_IMAGE, SET_USER_INFO } from '@/utils/constant';
import { IoArrowBack } from 'react-icons/io5'
import axios from 'axios';
import React, { useEffect, useState } from 'react'

const page = () => {

    const [{userInfo},dispatch] = useStateProvider();
    const [isLoaded, setIsLoaded] = useState(true);
    const [imageHover, setImageHover] = useState(false);
    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");
    const [step, setStep] = useState(1);
    const [skills, setSkills] = useState([]);
    const [socialLinkInput, setSocialLinkInput] = useState("");
    const [data, setData] = useState({
        userName: '',
        fullName: '',
        description: '',
        skills: [],
        location: '',
        portfolioLink: '',
        socialMediaLinks: []
    });

    const [allSkills] = useState([
        'JavaScript',
        'React',
        'Python',
    ])

    const [skillInput, setSkillInput] = useState('');

    useEffect(() => {
        const handleData = {...data};
        if(userInfo){
            if(userInfo?.userName) handleData.userName = userInfo.username;
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
        // if(step === 1){
        //     if(!data.userName || !data.fullName || !image){
        //         setErrorMsg('Username, Full Name and Image are required.');
        //         return;
        //     }
        // }
        // setErrorMsg('');
        setStep(step + 1);
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


    const inputClassName = 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500';
    const labelClassName = 'mb-2 text-base uppercase text-gray-900 dark:text-white'

    return (
        <>
                    {
                        isLoaded && (
                            <div className='border border-black rounded-lg mb-5 mx-auto flex items-center gap-4 justify-between max-w-[90vw] h-[100%] min-h-[100%]'>
                                {
                                    errorMsg && (
                                        <div>
                                            <span className='text-red-500 font-semibold text-sm'>{errorMsg}</span>
                                        </div>
                                    )
                                }

                                <div className="relative h-full flex items-center justify-center bg-gradient-to-r from-black via-gray-300 to-black px-3">
                                    <div className="absolute inset-0">
                                        <img 
                                            src="./images/profile2.jpg" 
                                            alt="Welcome Illustration" 
                                            className="w-full h-full object-cover opacity-60"
                                        />
                                    </div>

                                    <div className="relative bg-black/5 mx-auto py-2 z-10 text-center rounded-lg text-white px-6 md:px-12">
                                        <h2 className="text-5xl font-extrabold mb-4 text-shadow-md text-white">Welcome!</h2>
                                    </div>
                                </div>

                                <div className='flex h-full flex-col rounded-r-lg items-center w-full gap-5'>
                                    {step === 1 && (
                                        <>
                                            <div 
                                                className='flex justify-center gap-3 flex-col items-center cursor-pointer'
                                                onMouseEnter={() => setImageHover(true)}
                                                onMouseLeave={() =>
                                                    setImageHover(false)}
                                            >
                                                <label className='text-base uppercase text-gray-900 dark:text-white'>Select a Profile Picture</label>
                                                <div className='bg-purple-500 h-20 w-20 flex items-center justify-center rounded-full relative'>
                                                    {
                                                        previewImage ?  (
                                                            <img
                                                                src={previewImage}
                                                                alt='Profile'
                                                                className='rounded-full h-20 w-20'
                                                            />
                                                        ) : (
                                                            <img
                                                                src={`${userInfo?.profileImage ? userInfo.profileImage : '/images/avatar.png'}`}
                                                                alt='Profile'
                                                                className='rounded-full h-20 w-20'
                                                            />
                                                        )
                                                    }
                                                        <div className={`absolute bg-slate-400 h-full w-full rounded-full flex items-center justify-center transition-all duration-500 ${imageHover ? 'opacity-100' : 'opacity-0'}`}>
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
                                                                    className='opacity-0'
                                                                    name='profileImage'
                                                                    multiple={true}
                                                                />
                                                            </span>
                                                        </div>
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-2 gap-8 px-16'>
                                                <div>
                                                    <label className=' text-base uppercase text-gray-900 dark:text-white' htmlFor='username'>enter username</label>
                                                    <input 
                                                        type="text" 
                                                        className={inputClassName}
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
                                                        className={inputClassName}
                                                        name='fullName'
                                                        value={data.fullName}
                                                        onChange={handleChange}
                                                        placeholder='FullName'
                                                    />
                                                </div>
                                            </div>
                                            <div className='w-full px-16 flex flex-col'>
                                                <textarea 
                                                    id='description'
                                                    className='block w-full h-16 max-h-32 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500'
                                                    name='description'
                                                    value={data.description}
                                                    onChange={handleChange}
                                                    placeholder='Description'
                                                    minLength={5}
                                                    maxLength={40}
                                                />
                                            </div>
                                            <button 
                                                    className='border text-lg font-semibold px-5 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600'
                                                    onClick={handleNextStep}
                                                    type='button'
                                                >
                                                    Continue
                                            </button>
                                        </>
                                    )}
                                    {
                                        step === 2 && (
                                            <div className='grid relative grid-cols-2 gap-5 py-20'>
                                                <button 
                                                    onClick={() => setStep(1)}
                                                    className='absolute top-5 left-0 hover:bg-gray-200 p-1 duration-500 transition-all rounded-full text-2xl text-gray-700 hover:text-gray-900'
                                                >
                                                    <IoArrowBack/>
                                                </button>

                                                <div className=''>
                                                    <label htmlFor="skills" className='block text-lg font-semibold text-gray-700 mb-2'>
                                                        Skills
                                                    </label>
                                                    <div className="flex gap-3 items-center mb-2">
                                                        <input
                                                            type="text"
                                                            id="skills"
                                                            name="skillInput"
                                                            value={skillInput}
                                                            onChange={(e) => setSkillInput(e.target.value)}
                                                            className={inputClassName}
                                                            placeholder="Enter a skill"
                                                        />
                                                        <button
                                                            type="button"
                                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
                                                            onClick={() => handleAddSkill(skillInput)}
                                                        >
                                                            ADD
                                                        </button>
                                                    </div>
                                                    {skillInput && (
                                                        <div className="border border-gray-300 rounded-lg bg-white shadow-lg z-10 absolute w-1/2 max-h-40 overflow-y-auto">
                                                            {allSkills
                                                                .filter((skill) =>
                                                                    skill.toLowerCase().includes(skillInput.toLowerCase())
                                                                )
                                                                .map((skill, index) => (
                                                                    <div
                                                                        key={index}
                                                                        className="p-2 cursor-pointer hover:bg-gray-200"
                                                                        onClick={() => handleAddSkill(skill)}
                                                                    >
                                                                        {skill}
                                                                    </div>
                                                                ))}
                                                        </div>
                                                    )}

                                                    {/* Selected Skills List */}
                                                    <ul 
                                                        className="flex flex-wrap gap-3 rounded-lg p-2 overflow-y-auto"
                                                        style={{ maxHeight: '60px', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}
                                                    >
                                                        {data.skills.map((skill, index) => (
                                                            <li
                                                                key={`${skill}-${index}`}
                                                                className="flex items-center gap-2 px-4 py-1 bg-gray-200 rounded-full text-sm font-medium"
                                                            >
                                                                <span>{skill}</span>
                                                                <span
                                                                    className="text-red-500 cursor-pointer"
                                                                    onClick={() => handleRemoveSkill(skill)}
                                                                >
                                                                    x
                                                                </span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                
                                                {/* Social Links Input */}
                                                <div>
                                                    <label htmlFor="socialLinks" className='block text-lg font-semibold text-gray-700 mb-2'>
                                                        Social Media Links
                                                    </label>
                                                    <div className="flex gap-3 items-center mb-2">
                                                        <input
                                                            type="url"
                                                            id="socialLinks"
                                                            name="socialLinkInput"
                                                            value={socialLinkInput}
                                                            onChange={(e) => setSocialLinkInput(e.target.value)}
                                                            className={inputClassName}
                                                            placeholder="Enter a social media link"
                                                        />
                                                        <button
                                                            type="button"
                                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
                                                            onClick={() => handleAddSocialLink(socialLinkInput)}
                                                        >
                                                            ADD
                                                        </button>
                                                    </div>

                                                    {/* Added Links List */}
                                                    <ul 
                                                        className="flex flex-wrap gap-3 rounded-lg p-2 overflow-y-auto"
                                                        style={{ maxHeight: '60px', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}
                                                    >
                                                        {data.socialMediaLinks.map((link, index) => (
                                                            <li
                                                                key={`${link}-${index}`}
                                                                className="flex gap-2 items-center py-1 px-3 bg-gray-200 rounded-full text-sm font-medium"
                                                            >
                                                                <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                                                                    {link}
                                                                </a>
                                                                <span
                                                                    className="text-red-500 cursor-pointer"
                                                                    onClick={() => handleRemoveSocialLink(link)}
                                                                >
                                                                    x
                                                                </span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                {/* PortFolio Link Input */}
                                                <div>
                                                    <label className='block text-lg font-semibold text-gray-700 mb-2' htmlFor='portfolioLink'>PortfolioLink</label>
                                                    <input
                                                        type='text'
                                                        id='portfolioLink'
                                                        className={inputClassName}
                                                        name='portfolioLink'
                                                        value={data.portfolioLink}
                                                        onChange={handleChange}
                                                        placeholder='portfolioLink'
                                                    />
                                                </div>

                                                {/* Location Link Input */}
                                                <div>
                                                    <label className='block text-lg font-semibold text-gray-700 mb-2' htmlFor='location'>Location</label>
                                                    <input 
                                                        type='text'
                                                        id='location'
                                                        className={inputClassName}
                                                        name='location'
                                                        value={data.location}
                                                        onChange={handleChange}
                                                        placeholder='location'
                                                    />
                                                </div>

                                                        {/* Submit Button */}
                                                <button 
                                                    className='w-full px-4 py-2 mt-5 text-lg font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none'
                                                    onClick={setProfile}
                                                    type='button'
                                                >
                                                    Set Profile
                                                </button>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        )
                    }
        </>
    )
}

export default page