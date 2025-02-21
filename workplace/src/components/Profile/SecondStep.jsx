import React from 'react'
import ProfileInput from './ProfileInput'
import { experienceLevels, languageOptions } from '@/utils/categories';
import ReactSelect from 'react-select';
import ProfessionSelect from './ProfessionSelect';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import BackButton from './BackButton';
import NextBtn from './NextBtn';


const SecondStep = ({ data,handlers,state }) => {

    const inputClassName = 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500';

    return (
        <div className="flex relative items-center justify-center py-16">
            <div className="w-full max-w-3xl bg-white rounded-lg p-8">
                <div className="grid grid-cols-2 gap-6">
                    {/* Skills Input */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Skills</label>
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
                        <label className="block text-gray-700 font-medium mb-2">Languages</label>
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