import React from 'react'

const ProfileInput = ({inputClassName,input, setInput,handleAdd,handleRemove,all,data}) => {
    return (
        <>
            <label htmlFor="skills" className='block text-lg font-semibold text-gray-700 mb-2'>
                Skills
            </label>
            <div className="flex gap-3 items-center mb-2">
                <input
                    type="text"
                    id="skills"
                    name="skillInput"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className={inputClassName}
                    placeholder="Enter a skill"
                />
                <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
                    onClick={() => handleAdd(input)}
                >
                    ADD
                </button>
            </div>
            {input && (
                <div className="border border-gray-300 rounded-lg bg-white shadow-lg z-10 absolute w-1/2 max-h-40 overflow-y-auto">
                    {all
                        .filter((skill) => skill.toLowerCase().includes(input.toLowerCase()))
                        .map((skill, index) => (
                            <div
                                key={index}
                                className="p-2 cursor-pointer hover:bg-gray-200"
                                onClick={() => handleAdd(skill)}
                            >
                                {skill}
                            </div>
                        ))}
                </div>
            )}
            {/* Selected Skills List */}
            <ul 
                className="flex flex-wrap gap-3 rounded-lg p-2 overflow-y-auto"
                style={{ maxHeight: '60px', maxWidth: '250px', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}
            >
                {data.skills.map((skill, index) => (
                    <li
                        key={`${skill}-${index}`}
                        className="flex items-center gap-2 px-4 py-1 bg-gray-200 rounded-full text-sm font-medium"
                    >
                        <span>{skill}</span>
                        <span
                            className="text-red-500 cursor-pointer"
                            onClick={() => handleRemove(skill)}
                        >
                            x
                        </span>
                    </li>
                ))}
            </ul>
        </>
    )
}

export default ProfileInput