import React from 'react'
import { Dialog, DialogContent, DialogTrigger,DialogHeader,DialogTitle,DialogDescription } from '../ui/dialog'


const PreviewService = ({data, files, features}) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button 
                    className="px-4 py-2 bg-primary_button text-white rounded-lg hover:bg-primary_button_hover focus:outline-none"
                >
                    Preview
                </button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-slate-100 backdrop-blur-md border border-gray-100 shadow-xl rounded-xl p-6">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-800 text-center">✨ Service Preview</DialogTitle>
                    <DialogDescription className="text-gray-500 text-center">
                        Review your details before saving
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                    {/* Title & Category Section */}
                    <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                        <div className="grid grid-cols-3 gap-4 items-center">
                            <p className="text-gray-500 font-medium">📌 Title:</p>
                            <h2 className="col-span-2 text-xl font-bold text-gray-800">{data.title}</h2>
                        </div>
                        <div className="grid grid-cols-3 gap-4 items-center mt-2">
                            <p className="text-gray-500 font-medium">📂 Category:</p>
                            <span className="col-span-1 text-center text-sm text-white bg-blue-600 px-3 py-1 rounded-full">
                                {data.category}
                            </span>
                        </div>
                    </div>

                    {/* Short Description */}
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                        <p className="text-gray-500 font-medium">📝 Description:</p>
                        <p className="text-gray-700 mt-1">{data.shortDesc}</p>
                    </div>

                    {/* Features List */}
                    {features.length > 0 && (
                        <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">✅ Features:</h3>
                            <ul className="grid grid-cols-2 gap-2 text-gray-700">
                                {features.map((feature, index) => (
                                    <li key={index} className="flex items-center gap-2">
                                        <span className="text-green-600">✔</span> {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Price & Revisions */}
                    <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg shadow-sm">
                        <p className="text-lg font-semibold text-blue-600 flex items-center gap-2">
                            💰 <span className="text-gray-800">₹${data.price}</span>
                        </p>
                        <p className="text-gray-700 flex items-center gap-2">
                            🔄 <span className="text-gray-800">{data.revisions} Revisions</span>
                        </p>
                    </div>

                    {/* Images Preview */}
                    {files.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">🖼️ Service Images:</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {files.map((file, index) => (
                                    <img 
                                        key={index} 
                                        src={URL.createObjectURL(file)} 
                                        alt="Preview"
                                        className="w-full h-24 object-cover rounded-lg shadow-md border"
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>


            </DialogContent>
        </Dialog>
    )
}

export default PreviewService