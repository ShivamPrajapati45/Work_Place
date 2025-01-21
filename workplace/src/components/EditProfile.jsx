import React from 'react'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from '@/components/ui/sheet'
import { CiEdit } from 'react-icons/ci'
import { Button } from './ui/button'

const EditProfile = ({
    userInfo,
    edit,
    setEdit,
    imageHover,
    setImageHover,
    previewImage,
    handleFileChange,
    handleValueChange,
    data,
    handleEditProfile,
    logout,
    change

}) => {
    return (
            <Sheet>
                <SheetTrigger asChild>
                    <div className='rounded-full w-12 h-12 overflow-hidden'>
                        {
                            userInfo?.isProfileInfoSet ? (
                                
                                <img
                                src={userInfo?.profileImage}
                                alt='Profile'
                                className='rounded-full h-full w-full object-cover'
                                
                                />
                            ) : (
                                <div className='bg-purple-500 flex items-center justify-center h-10 w-10 rounded-full relative'>
                                    <span className='text-xl text-white'>
                                        {userInfo?.email[0].toUpperCase()}
                                    </span>
                                </div>
                            )
                        }
                    </div>
                </SheetTrigger>
                <SheetContent>
                        <SheetHeader>
                            <SheetTitle className="flex gap-3 items-center">
                                Edit Profile
                                <CiEdit 
                                    className='text-3xl w-8 hover:bg-gray-200 rounded-md hover:scale-110 duration-500 transition-all cursor-pointer' 
                                    onClick={() => setEdit(!edit)}
                                    title='edit'
                                />
                            </SheetTitle>
                            <SheetDescription>
                                Make changes to your profile here. Click save when you're done.
                            </SheetDescription>
                        </SheetHeader>
                        <div 
                            className='flex flex-col items-center'
                        >
                            <div 
                                className='h-20 w-20 cursor-pointer flex items-center justify-center rounded-full relative'
                                onMouseEnter={() => setImageHover(true)}
                                onMouseLeave={() => setImageHover(false)}
                            >
                                {
                                    previewImage ?  (
                                        <img
                                            src={previewImage}
                                            alt='Profile'
                                            className='rounded-full h-full w-full object-cover'
                                        />
                                    ) : (
                                        <img
                                            src={`${userInfo?.profileImage ? userInfo.profileImage : '/images/avatar.png'}`}
                                            alt='Profile'
                                            className='rounded-full h-full w-full object-cover'
                                        />
                                    )
                                }
                                <div className={`absolute bg-slate-400 h-20 w-20 rounded-full flex items-center justify-center transition-all duration-500 ${imageHover ? 'opacity-100' : 'opacity-0'}`}>
                                    <span className={'flex items-center justify-center relative cursor-pointer'}>
                                        <svg
                                            xmlns='http://www.w1.org/2000/svg'
                                            className='w-12 h-12 text-white absolute cursor-pointer'
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
                                            className='opacity-0 cursor-pointer'
                                            name='profileImage'
                                            multiple={true}
                                        />
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="fullName" className="text-right ">
                                    Name
                                </label>
                                <input 
                                    disabled={edit} 
                                    id="fullName" 
                                    name='fullName'
                                    value={data.fullName}
                                    onChange={handleValueChange}
                                    className={`${edit ? 'text-slate-400 cursor-not-allowed' : 'text-black'}  col-span-3 px-3 py-1 rounded-lg border-[1.5px] border-slate-400`} 
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="username" className="text-right">
                                    Username
                                </label>
                                <input 
                                    disabled={edit} 
                                    id="username" 
                                    name='username'
                                    value={data.username} 
                                    onChange={handleValueChange}
                                    className={`${edit ? 'text-slate-400 cursor-not-allowed' : 'text-black'}  col-span-3 px-3 py-1 rounded-lg border-[1.5px] border-slate-400`} 
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="email" className="text-right">
                                    Email
                                </label>
                                <input 
                                    disabled={edit} 
                                    id="email" 
                                    name='email'
                                    value={data.email}
                                    onChange={handleValueChange} 
                                    className={`${edit ? 'text-slate-400 cursor-not-allowed' : 'text-black'}  col-span-3 px-3 py-1 rounded-lg border-[1.5px] border-slate-400`}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="description" className="text-right">
                                    Description
                                </label>
                                <textarea 
                                    disabled={edit} 
                                    id="description" 
                                    name='description'
                                    value={data.description} 
                                    onChange={handleValueChange}
                                    minLength={10}
                                    maxLength={50}
                                    className={`${edit ? 'text-slate-400 cursor-not-allowed' : 'text-black'}  col-span-3 px-3 py-1 rounded-lg border-[1.5px] border-slate-400`}
                                />
                            </div>
                        </div>
                        <SheetFooter>
                            <SheetClose asChild>
                                <Button 
                                    type='submit' 
                                    className={`font-semibold text-white uppercase cursor-pointer bg-green-600 hover:bg-green-500`}
                                    onClick={handleEditProfile}
                                    disabled={!change || edit}
                                >
                                    Save Changes
                                    </Button>
                            </SheetClose>
                            
                            <SheetClose asChild>
                                <Button
                                    className='hover:shadow-md shadow-black transition-all duration-500'
                                    type='button'
                                    onClick={logout}
                                    >
                                    Logout
                                </Button>
                            </SheetClose>
                        </SheetFooter>
                </SheetContent>
            </Sheet>
    )
}

export default EditProfile