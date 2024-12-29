import React from 'react'
import Link from 'next/link'
import {
    FiGithub,
    FiInstagram,
    FiYoutube,
    FiTwitter,
    FiLinkedin
} from "react-icons/fi"
import Logo from './Logo'
import { categories } from '@/utils/categories'


const Footer = () => {

    const socialLinks = [
        {name : 'Github' , icon : <FiGithub />, link:"#"},
        {name : 'Instagram' , icon : <FiInstagram />, link:"#"},
        {name : 'Youtube' , icon : <FiYoutube />, link:"#"},
        {name : 'Twitter' , icon : <FiTwitter />, link:"#"},
        {name : 'LinkedIn' , icon : <FiLinkedin />, link:"#"},
    ]

    const data = [
        {
            headerName : "Categories",
            links : [
                ...categories.map(({name})=>({
                    name,
                    link:`/search?category=${name}`,
                }))
            ],
        },
        {
            headerName : "About",
            links : [
                {name:"Careers", link : "#"},
                {name:"Press & News", link : "#"},
                {name:"Partnership", link : "#"},
                {name:"Privacy & Policy", link : "#"},
                {name:"Terms of Service", link : "#"},
                {name:"Claims", link : "#"},
                {name:"Investors", link : "#"},
            ],
        },
        {
            headerName : "Support",
            links : [
                {name:"Help & Support", link : "#"},
                {name:"trust & safety", link : "#"},
                {name:"selling on workplace", link : "#"},
                {name:"buying on workplace", link : "#"},
            ],
        },
        {
            headerName : "Community",
            links : [
                {name:"Community Success Stories", link : "#"},
                {name:"Community hub", link : "#"},
                {name:"Forum", link : "#"},
                {name:"Events", link : "#"},
                {name:"Blog", link : "#"},
                {name:"Influencers", link : "#"},
                {name:"Affiliates", link : "#"},
                {name:"Podcast", link : "#"},
                {name:"Invite a friend", link : "#"},
                {name:"Become a seller", link : "#"},
                {name:"Community Standards", link : "#"},
            ]
        },
        {
            headerName : "Move from Workplace",
            links : [
                {name:"Workplace Business", link : "#"},
                {name:"Workplace Pro", link : "#"},
                {name:"Workplace Logo Maker", link : "#"},
                {name:"Workplace Guides", link : "#"},
                {name:"Get Inspired", link : "#"},
                {name:"Workplace Select", link : "#"},
                {name:"ClearVoice", link : "#"},
                {name:"Workplace workspace", link : "#"},
                {name:"Learn", link : "#"},
            ]
        }
    ]

    return (
        <footer className='w-full mx-auto px-12 py-16 h-max border-t border-gray-200 bg-gray-100'>
            <ul className='flex justify-between'>
                {data.map(({headerName,links})=>{
                return (
                    <li key={headerName} className='flex flex-col  gap-2'>
                    <span className='font-bold text-black'>{headerName}</span>
                    <ul  className='flex flex-col gap-2'>
                        {links.map(({name,link})=>(
                        <li key={name} className='text-[#404145]'>
                            <Link href={link}>{name}</Link>
                        </li>
                        ))}
                    </ul>
                    </li>
                )
                })}
            </ul>
            <div className='mt-12 flex items-center justify-between'>
                <Logo/>
                <ul className='flex gap-5'>
                {socialLinks.map(({name,icon,link})=>{
                    return (
                        <li className='bg-black p-1 rounded-full w-full' key={name}>
                            <Link href={link}>{icon}</Link>
                        </li>
                    )
                })}
                </ul>
            </div>
        </footer>
    )
    }

    export default Footer