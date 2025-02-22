import React from 'react'

const ProfileInput = ({inputClassName,input, setInput,handleAdd,handleRemove,all,data}) => {
    return (
        <div className=''>
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
                <div className="rounded-lg bg-white shadow-lg z-10 absolute w-[30%] max-h-40 overflow-y-auto">
                    {all
                        .filter((skill) => skill.toLowerCase().includes(input.toLowerCase()))
                        .map((skill, index) => (
                            <div
                                key={index}
                                className="p-1 border-b border-gray-300 cursor-pointer hover:bg-gray-200"
                                onClick={() => handleAdd(skill)}
                            >
                                {skill}
                            </div>
                        ))}
                </div>
            )}
            {/* Selected Skills List */}
            {data.skills.length > 0 && (
                <ul 
                    className="flex scrollbar-hide gap-3 rounded-lg p-1 overflow-y-auto"
                    style={{ maxHeight: '60px', maxWidth: '250px', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}
                >
                    {data.skills.map((skill, index) => (
                        <li
                            key={`${skill}-${index}`}
                            className="flex items-center gap-2 px-4 py-0.5 bg-gray-200 rounded-full text-sm font-medium"
                        >
                            <span className='text-xs'>{skill}</span>
                            <span
                                className="text-red-500  cursor-pointer"
                                onClick={() => handleRemove(skill)}
                            >
                                x
                            </span>
                        </li>
                    ))}
                </ul>
            )}
            
        </div>
    )
}

export default ProfileInput