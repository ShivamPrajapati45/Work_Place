import React from 'react'
import { IoArrowBack } from 'react-icons/io5';
import Preview from './Preview';

const ThirdStep = ({ data,state,handlers }) => {

    const inputClassName = 'w-full px-4 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500';

    return (
        <div className="grid relative grid-cols-2 gap-6 py-16 px-6">
            {/* Back Button */}
            {state.errorMsg && <p className='text-red-500 lg:bottom-20 lg:left-10 text-sm absolute text-center'>{state.errorMsg}</p>}
            <button 
                onClick={() => {
                    handlers.setStep(2);
                    handlers.setIsLoading(false);
                }}
                className="absolute top-5 left-0 hover:bg-gray-200 p-2 transition-all rounded-full text-2xl text-gray-700 hover:text-gray-900"
            >
                <IoArrowBack />
            </button>
            {/* Social Links Input */}
            <div>
                <label htmlFor="socialLinks" className="block font-semibold text-gray-600 mb-2">
                    Social Links
                </label>
                <div className="flex gap-3 items-center">
                    <input
                        type="url"
                        id="socialLinks"
                        name="socialLinkInput"
                        value={state.socialLinkInput}
                        onChange={(e) => handlers.setSocialLinkInput(e.target.value)}
                        className={`${inputClassName} flex-1`}
                        placeholder="Instagram, facebook, any other"
                    />
                    <button
                        type="button"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 focus:outline-none transition-all"
                        onClick={() => handlers.handleAddSocialLink(state.socialLinkInput)}
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
                                    onClick={() => handlers.handleRemoveSocialLink(link)}
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
                <label htmlFor="portfolioLink" className="block text-base font-semibold text-gray-700 mb-2">
                    Portfolio Link
                </label>
                <input
                    type="url"
                    id="portfolioLink"
                    className={`${inputClassName} w-full`}
                    name="portfolioLink"
                    value={data.portfolioLink}
                    onChange={handlers.handleChange}
                    placeholder="Eg. https://chatgpt.com/"
                />
            </div>
            {/* Location Input */}
            <div>
                <label htmlFor="location" className="block text-base font-semibold text-gray-700 mb-2">
                    Location <span className='text-red-400'>*</span>
                </label>
                <input
                    type="text"
                    id="location"
                    className={`${inputClassName} w-full`}
                    name="location"
                    value={data.location}
                    onChange={handlers.handleChange}
                    placeholder="Eg. Mumbai, India"
                />
            </div>
            {/* Contact Inputs (Email & Phone) */}
            <div>
                <label htmlFor="email" className="block text-base font-semibold text-gray-700 mb-2">
                    Email Address <span className='text-red-400'>*</span>
                </label>
                <input
                    type="email"
                    id="email"
                    className={`${inputClassName} w-full`}
                    name="email"
                    value={data.email}
                    onChange={handlers.handleChange}
                    placeholder="Eg. user@gmail.com"
                />
            </div>
            {/* Submit Button */}
            <div className="col-span-2 flex justify-end gap-10 mt-5">
                <Preview data={state.previewData}/>
                <button
                    className="px-6 py-2 font-semibold bg-primary_button text-white rounded-lg hover:bg-primary_button_hover focus:outline-none transition-all"
                    onClick={handlers.setProfile}
                    type="button"
                >
                    Set Profile
                </button>
            </div>
        </div>
    )
}

export default ThirdStep