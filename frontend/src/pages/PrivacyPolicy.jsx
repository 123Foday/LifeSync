import React, { useEffect } from 'react'
import { assets } from '../assets/assets'

const PrivacyPolicy = () => {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div className='max-w-4xl mx-auto px-6 py-12'>
            <div className='text-center mb-16'>
                <h1 className='text-4xl md:text-5xl font-bold text-neutral-800 dark:text-white mb-4'>Privacy Policy</h1>
                <p className='text-neutral-500 dark:text-gray-400'>Last updated: January 11, 2026</p>
                <div className='w-24 h-1 bg-[#5f6FFF] mx-auto mt-6 rounded-full'></div>
            </div>

            <div className='bg-white dark:bg-[#121212] rounded-3xl p-8 md:p-12 shadow-xl shadow-blue-50/50 dark:shadow-none border border-gray-100 dark:border-gray-800 space-y-10 text-neutral-700 dark:text-gray-300 leading-relaxed'>
                
                <section>
                    <h2 className='text-2xl font-bold text-neutral-800 dark:text-white mb-4 flex items-center gap-3'>
                        <span className='w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-[#5f6FFF] rounded-lg flex items-center justify-center text-sm font-bold'>1</span>
                        Information We Collect
                    </h2>
                    <p className='mb-4'>We collect information that you contribute directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us.</p>
                    <ul className='list-disc pl-6 space-y-2'>
                        <li>Name, email address, phone number, and mailing address.</li>
                        <li>Health-related information including medical history and appointment details.</li>
                        <li>Payment information and transaction history.</li>
                        <li>Log information, device information, and location data.</li>
                    </ul>
                </section>

                <section>
                    <h2 className='text-2xl font-bold text-neutral-800 dark:text-white mb-4 flex items-center gap-3'>
                        <span className='w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-[#5f6FFF] rounded-lg flex items-center justify-center text-sm font-bold'>2</span>
                        How We Use Your Information
                    </h2>
                    <p className='mb-4'>We use the information we collect to provide, maintain, and improve our services, including:</p>
                    <ul className='list-disc pl-6 space-y-2'>
                        <li>Facilitating doctor appointments and medical consultations.</li>
                        <li>Sending you technical notices, updates, and security alerts.</li>
                        <li>Responding to your comments, questions and requests.</li>
                        <li>Monitoring and analyzing trends, usage, and activities.</li>
                        <li>Personalizing and improving the services.</li>
                    </ul>
                </section>

                <section>
                    <h2 className='text-2xl font-bold text-neutral-800 dark:text-white mb-4 flex items-center gap-3'>
                        <span className='w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-[#5f6FFF] rounded-lg flex items-center justify-center text-sm font-bold'>3</span>
                        Sharing of Information
                    </h2>
                    <p>We may share the information we collect about you as described in this policy or at the time of collection or sharing, including sharing with vendors, consultants, and other service providers who need access to such information to carry out work on our behalf.</p>
                </section>

                <section>
                    <h2 className='text-2xl font-bold text-neutral-800 dark:text-white mb-4 flex items-center gap-3'>
                        <span className='w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-[#5f6FFF] rounded-lg flex items-center justify-center text-sm font-bold'>4</span>
                        Security
                    </h2>
                    <p>We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction. LifeSync uses industry-standard encryption and security protocols to safeguard your medical data.</p>
                </section>

                <section>
                    <h2 className='text-2xl font-bold text-neutral-800 dark:text-white mb-4 flex items-center gap-3'>
                        <span className='w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-[#5f6FFF] rounded-lg flex items-center justify-center text-sm font-bold'>5</span>
                        Data Retention & Deletion
                    </h2>
                    <p>You have the right to delete your account at any time through your profile settings. Upon deletion, your data is permanently removed from our active systems, and we will send you a confirmation email of the activity.</p>
                </section>

                <div className='pt-8 border-t dark:border-gray-800'>
                    <p className='text-sm text-neutral-500 italic'>If you have any questions about this Privacy Policy, please contact us at privacy@lifesync.com.</p>
                </div>
            </div>
        </div>
    )
}

export default PrivacyPolicy
