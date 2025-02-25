import React from 'react'
import { Dialog, DialogContent, DialogTrigger,DialogHeader,DialogTitle,DialogDescription } from '../ui/dialog'
import { Mail, Globe, User, Briefcase, MapPin, Languages, Star } from "lucide-react";

const Preview = ({ data }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button 
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
                >
                    Preview
                </button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-slate-100 backdrop-blur-md border border-gray-100 shadow-xl rounded-xl p-6">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-800 text-center">✨ Profile Preview</DialogTitle>
                    <DialogDescription className="text-gray-500 text-center">
                        Review your details before saving
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                    {/* Left Side: Basic Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-500" /> Basic Details
                        </h3>
                        <p><strong className="text-gray-600">Full Name:</strong> {data.fullName || "N/A"}</p>
                        <p><strong className="text-gray-600">Username:</strong> @{data.userName || "N/A"}</p>
                        <p><strong className="text-gray-600">Profession:</strong> {data.profession || "N/A"}</p>
                        <p><strong className="text-gray-600">Experience:</strong> {data.experienceLevel || "N/A"}</p>
                        <p><strong className="text-gray-600">Location:</strong> <MapPin className="inline w-4 h-4 text-red-500" /> {data.location || "N/A"}</p>
                    </div>

                    {/* Right Side: Other Details */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-green-500" /> Professional Summary
                        </h3>
                        <div className="text-gray-600 max-h-32 overflow-y-auto p-3 border rounded-md shadow-inner bg-gray-100">
                            {data.description || "No description provided"}
                        </div>

                        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                            <Star className="w-5 h-5 text-yellow-500" /> Skills
                        </h3>
                        <p>{data.skills.length > 0 ? data.skills.join(", ") : "No skills added"}</p>

                        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                            <Languages className="w-5 h-5 text-purple-500" /> Languages
                        </h3>
                        <p>{data.languages.length > 0 ? data.languages.join(", ") : "No languages selected"}</p>
                    </div>
                </div>

                {/* Contact & Social Links */}
                <div className="p-4 border-t mt-4 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                        <Mail className="w-5 h-5 text-indigo-500" /> Contact & Social Links
                    </h3>
                    <p><strong className="text-gray-600">Email:</strong> {data.email || "Not provided"}</p>
                    <p><strong className="text-gray-600">Portfolio:</strong> {data.portfolioLink ? <a href={data.portfolioLink} target="_blank" title={data.portfolioLink} className="text-blue-500 hover:underline">View Portfolio</a> : "Not provided"}</p>
                    <p><strong className="text-gray-600">Social Links:</strong> {data.socialMediaLinks.length > 0 ? data.socialMediaLinks.map((link, index) => (
                        <a key={index} href={link} target="_blank" className="text-blue-500 hover:underline block">{link}</a>
                    )) : "No social links added"}</p>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default Preview