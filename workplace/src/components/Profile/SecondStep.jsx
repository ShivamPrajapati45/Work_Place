import React from 'react'
import ProfileInput from './ProfileInput'
import { languageOptions } from '@/utils/categories';
import ReactSelect from 'react-select';
import BackButton from './BackButton';
import NextBtn from './NextBtn';


const SecondStep = ({ data,handlers,state,handleGenerateBio }) => {

    const inputClassName = 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500';

    return (
        <div className="relative py-12">
                {state.errorMsg && <span className='text-red-500 text-sm'>{state.errorMsg}</span>}
            <div className="w-full max-w-3xl bg-white rounded-lg p-4">
                <div className="grid grid-cols-1 gap-6 w-full rounded-lg">
                    <div className='relative'>
                        {/* <label className='block mb-2 text-sm font-medium text-gray-700' htmlFor='description'>Bio</label> */}
                        <textarea 
                            id='description'
                            className='block text-sm w-full h-24 max-h-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                            name='description'
                            value={data.description}
                            onChange={handlers.handleChange}
                            placeholder='write professional summary or ASK AI'
                            minLength={5}
                            maxLength={100}
                        />
                        <button
                            onClick={handleGenerateBio}
                            className='absolute right-2 bottom-2 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 text-sm'
                        >
                            Generate Bio
                        </button>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 items-center justify-center'>
                        {/* Skills Input */}
                        <div>
                            <label className="block text-gray-700 font-medium">Skills</label>
                            <ProfileInput
                                inputClassName={inputClassName}
                                input={state.skillInput}
                                setInput={handlers.setSkillInput}
                                data={data}
                                handleAdd={handlers.handleAddSkill}
                                handleRemove={handlers.handleRemoveSkill}
                                all={state.allSkills}
                            />
                        </div>
                        {/* Languages Input */}
                        <div>
                            <label className=" text-gray-700 font-medium mb-4">Languages</label>
                            <ReactSelect 
                                options={languageOptions} 
                                isMulti
                                closeMenuOnSelect={false}
                                components={state.animatedComponents}
                                value={state.selectedLanguages}
                                onChange={handlers.handleLanguage}
                                name="languages"
                                className="w-full"
                            />
                        </div>
                    </div>

                </div>
                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                    <BackButton 
                        handlers={handlers}
                    />
                    <NextBtn
                        state={state}
                        handlers={handlers}
                        className={'mt-4 px-6 w-auto py-1 text-lg font-semibold text-white bg-blue-600 rounded-md flex items-center justify-center gap-4 disabled:opacity-50'}
                    />
                </div>
            </div>
        </div>
    )
}

export default SecondStep