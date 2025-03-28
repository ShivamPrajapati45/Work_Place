'use client'
import { CREATE_ORDER, GET_GIG_DATA } from '@/utils/constant';
import axios from 'axios';
import 'flowbite'
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react'
import { useFormik} from 'formik'
import * as Yup from 'yup';
import toast from 'react-hot-toast';


const page = () => {
    const [gig, setGig] = useState(null);
    const router = useSearchParams();
    const gigId = router.get('gigId');
    const orderId = router.get('orderId');
    const [err, setErr] = useState('');
    const route = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    


    useEffect(() => {
        const fetchGigDetail = async () => {
            try {
                const res = await axios.get(`${GET_GIG_DATA}/${gigId}`,{withCredentials: true});
                if(res.data.success){
                    setGig(res.data.gig);
                    // route.push(`/success?orderId=${res?.data?.order?.id}`);
                }
            }catch(err){
                setErr(err)
                console.log('err: ', err)
            }   
        };

        fetchGigDetail();
    },[router, gigId])

    const formIk = useFormik({
        initialValues: {
            fullName: "",
            cardNumber: "",
            expirationDate: "",
            cvv: ""
        },
        validationSchema: Yup.object({
            fullName: Yup.string()
                .required('FullName is Required')
                .min(5, 'Full Name must be at least 5 Character'),
            cardNumber: Yup.string()
                .required('Card Number id Required')
                .matches(/^\d{16}$/, 'Card Number must be 16 Digits'),
            expirationDate: Yup.string()
                .required('Expiration Date is Required')
                .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiration date must be in MM/YY format"),
            cvv: Yup.string()
                .required("CVV is required")
                .matches(/^\d{3}$/, "CVV must be 3 digits"),
        }),
        onSubmit: async (values, { setSubmitting, setErrors, resetForm }) => {
            try{
                setIsSubmitting(true);
                const { fullName,cardNumber,cvv,expirationDate } = values;
                const upfrontPayment = gig?.price/2;
                const remainingAmount = gig?.price - upfrontPayment;

                const payload = {
                    gigId: parseInt(gigId),
                    price: gig?.price,
                    upfrontPayment,
                    remainingAmount,
                    paymentDetails: {
                        fullName,
                        cardNumber,
                        expirationDate,
                        cvv
                    }
                };

                const response = await axios.post(CREATE_ORDER, payload,{ withCredentials: true })
                if(response?.data?.success){
                    toast.success('Payment Done Successfully');
                    route.push('/success?payment_status=success');
                    setSubmitting(false);
                    // resetForm();
                }

            }catch(err){
                console.error(err);
                setErrors({error: 'Payment Failed. Please try again later'})

            }finally{
                setSubmitting(false);
                setIsSubmitting(false);
            }
        }
    })

    

    return (
        <>
            <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
            {isSubmitting && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
                        <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center">
                        {/* Loader */}
                        <div className="relative flex items-center justify-center">
                            <div className="absolute w-20 h-20 border-4 border-blue-500 border-t-transparent border-b-transparent rounded-full animate-spin"></div>
                            <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent border-b-transparent rounded-full animate-spin-slow"></div>
                        </div>

                        {/* Text */}
                        <p className="text-xl font-semibold text-gray-800 mt-5 animate-pulse">
                            Creating your service...
                        </p>
                        </div>
                    </div>
            )}
            <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
                <div className="mx-auto max-w-5xl">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">Payment</h2>

                <div className="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-12">

                    <form 
                        onSubmit={formIk.handleSubmit}
                        className="w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6 lg:max-w-xl lg:p-8">
                    <div className="mb-6 grid grid-cols-2 gap-4">
                        <div className="col-span-2 sm:col-span-1">
                        <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Full name (as displayed on card)* </label>
                        <input 
                            type="text" 
                            id="fullName" 
                            {...formIk.getFieldProps('fullName')}
                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" 
                            placeholder="Bonnie Green" required />
                            {formIk.touched.fullName && formIk.errors.fullName && (
                                <p className='text-red-400 text-sm'>{formIk.errors.fullName}</p>
                            )}
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <label htmlFor="cardNumber" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Card number* </label>
                            <input 
                                type="text" 
                                id="cardNumber" 
                                {...formIk.getFieldProps('cardNumber')}
                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pe-10 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" placeholder="xxxx-xxxx-xxxx-xxxx" 
                                required />
                                {formIk.touched.cardNumber && formIk.errors.cardNumber && (
                                    <p className='text-red-400 text-sm'>{formIk.errors.cardNumber}</p>
                                )}
                        </div>

                        <div>
                            <label 
                                htmlFor="expirationDate" 
                                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Card expiration* 
                            </label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5">
                                <svg className="h-4 w-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path
                                        fill-rule="evenodd"
                                        d="M5 5a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1h1a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1h1a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1 2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a2 2 0 0 1 2-2ZM3 19v-7a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Zm6.01-6a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm2 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm6 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm-10 4a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm6 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm2 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z"
                                        clip-rule="evenodd"
                                    />
                                </svg>
                                </div>
                                <input datepicker datepicker-format="mm/yy" 
                                    id="expirationDate" 
                                    {...formIk.getFieldProps('expirationDate')}
                                    type="text" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 ps-9 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500" placeholder="12/23" required />
                                    {formIk.touched.expirationDate && formIk.errors.expirationDate && (
                                        <p className="text-red-500 text-sm">{formIk.errors.expirationDate}</p>
                                    )}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="cvv" className="mb-2 flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-white">
                                CVV*
                                <button data-tooltip-target="cvv-desc" data-tooltip-trigger="hover" className="text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white">
                                <svg className="h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                    <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm9.408-5.5a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2h-.01ZM10 10a1 1 0 1 0 0 2h1v3h-1a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2h-1v-4a1 1 0 0 0-1-1h-2Z" clip-rule="evenodd" />
                                </svg>
                                </button>
                                <div id="cvv-desc" role="tooltip" className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700">
                                The last 3 digits on back of card
                                <div className="tooltip-arrow" data-popper-arrow></div>
                                </div>
                            </label>
                            <input type="number" id="cvv" 
                            {...formIk.getFieldProps('cvv')}
                            aria-describedby="helper-text-explanation" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" placeholder="•••" required />
                            {formIk.touched.cvv && formIk.errors.cvv && (
                                <p className="text-red-500 text-sm">{formIk.errors.cvv}</p>
                            )}
                        </div>
                    </div>

                        <button type="submit" className="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4  focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                            Pay now
                        </button>
                    </form>

                    <div className="mt-6 grow sm:mt-8 lg:mt-0">
                        <div className="space-y-4 rounded-lg border border-gray-100 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
                            <div className="space-y-2">
                                <dl className="flex items-center justify-between gap-4">
                                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Original price</dt>
                                    <dd className="text-base font-medium text-gray-900 dark:text-white">₹{gig?.price?.toLocaleString()}</dd>
                                    {/* ₹{gig?.price.toLocaleString()} */}
                                </dl>

                                {/* <dl className="flex items-center justify-between gap-4">
                                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Savings</dt>
                                    <dd className="text-base font-medium text-green-500"></dd>
                                </dl> */}

                                <dl className="flex items-center justify-between gap-4">
                                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Upfront Payment</dt>
                                    <dd className="text-base font-medium text-gray-900 dark:text-white">₹{gig?.price/2}</dd>
                                </dl>
                            </div>

                            <dl className="flex items-center justify-between gap-4 border-t-[2px] border-gray-200 pt-2 dark:border-gray-700">
                                <dt className="text-base font-bold text-gray-900 dark:text-white">Total</dt>
                                <dd className="text-base font-bold text-gray-900 dark:text-white">₹{gig?.price}</dd>
                            </dl>
                        </div>

                        <div className="mt-6 flex items-center justify-center gap-8">
                            <img className="h-8 w-auto dark:hidden" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/paypal.svg" alt="" />
                            <img className="hidden h-8 w-auto dark:flex" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/paypal-dark.svg" alt="" />
                            <img className="h-8 w-auto dark:hidden" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/visa.svg" alt="" />
                            <img className="hidden h-8 w-auto dark:flex" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/visa-dark.svg" alt="" />
                            <img className="h-8 w-auto dark:hidden" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/mastercard.svg" alt="" />
                            <img className="hidden h-8 w-auto dark:flex" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/mastercard-dark.svg" alt="" />
                        </div>
                    </div>
                </div>
                </div>
            </div>
            </section>
        </>
    )
}

export default page