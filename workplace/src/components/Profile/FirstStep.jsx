import React from 'react'
import NextBtn from './NextBtn'
import ProfessionSelect from './ProfessionSelect'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { experienceLevels } from '@/utils/categories';


const FirstStep = ({ data,handlers,state }) => {

    const labelClassName = 'mb-2 text-base uppercase text-gray-900 dark:text-white'
    const inputClass = 'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'

    return (
        <div className=''>
            <div 
                className='flex gap-1 flex-col items-center cursor-pointer'
            >
                <label className='text-lg font-semibold text-gray-800'>Select a Profile Picture</label>
                <div 
                    onMouseEnter={() => handlers.setImageHover(true)}
                    onMouseLeave={() => handlers.setImageHover(false)}
                    className='relative h-24 w-24 flex items-center justify-center rounded-full overflow-hidden cursor-pointer border border-gray-300 shadow-sm'>
                    {
                        state.previewImage ?  (
                            <img
                                src={state.previewImage}
                                alt='Profile'
                                className='h-full w-full object-cover rounded-full'
                            />
                        ) : (
                            <img
                                src={`${state.userInfo?.profileImage ? state.userInfo.profileImage : '/images/avatar.png'}`}
                                alt='Profile'
                                className='h-full w-full object-cover rounded-full'
                            />
                        )
                    }
                        <div className={`absolute bg-black bg-opacity-50 h-full w-full  flex items-center justify-center transition-opacity duration-300 ${state.imageHover ? 'opacity-100' : 'opacity-0'}`}>
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
                                    onChange={handlers.handleFileChange}
                                    className='opacity-0 h-20 w-20 rounded-full cursor-pointer'
                                    name='profileImage'
                                    multiple={true}
                                />
                            </span>
                        </div>
                </div>
            </div>
            {state.errorMsg && <span className='text-red-500 text-sm'>{state.errorMsg}</span>}

            <div className='grid grid-cols-2 gap-8 px-5 my-2 items-center'>
                <div>
                    <label className={labelClassName} htmlFor='userName'>enter username</label>
                    <input 
                        type="text" 
                        className={inputClass}
                        name='userName'
                        value={data.userName}
                        onChange={handlers.handleChange}
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
                        onChange={handlers.handleChange}
                        placeholder='FullName'
                    />
                </div>

                {/* Profession Input */}
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Profession</label>
                    <ProfessionSelect
                        open={state.open}
                        setOpen={handlers.setOpen}
                        profession={state.profession}
                        setProfession={handlers.setProfession}
                    />
                </div>
                    {/* Experience Input */}
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Experience Level</label>
                    <Select value={state.experienceLevel} onValueChange={(value) => handlers.setExperienceLevel(value)}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Experience Level" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {experienceLevels.map((level) => (
                                    <SelectItem key={level.value} value={level.label}>
                                        {level.label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <NextBtn
                state={state}
                handlers={handlers}
                className={'mt-4 px-6 mx-5 w-auto py-1 text-lg font-semibold text-white bg-blue-600 rounded-md flex items-center justify-center gap-4 disabled:opacity-50'}
            />
        </div>
    )
}

export default FirstStep