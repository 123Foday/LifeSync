import React, { useEffect } from 'react'

const TermsAndConditions = () => {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div className='max-w-4xl mx-auto px-6 py-12'>
            <div className='text-center mb-16'>
                <h1 className='text-4xl md:text-5xl font-bold text-neutral-800 dark:text-white mb-4'>Terms & Conditions</h1>
                <p className='text-neutral-500 dark:text-gray-400'>Effective Date: January 11, 2026</p>
                <div className='w-24 h-1 bg-[#5f6FFF] mx-auto mt-6 rounded-full'></div>
            </div>

            <div className='bg-white dark:bg-[#121212] rounded-3xl p-8 md:p-12 shadow-xl shadow-blue-50/50 dark:shadow-none border border-gray-100 dark:border-gray-800 space-y-10 text-neutral-700 dark:text-gray-300 leading-relaxed'>
                
                <section>
                    <h2 className='text-2xl font-bold text-neutral-800 dark:text-white mb-4'>1. Acceptance of Terms</h2>
                    <p>By accessing or using the LifeSync platform, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree to these terms, please do not use our services.</p>
                </section>

                <section>
                    <h2 className='text-2xl font-bold text-neutral-800 dark:text-white mb-4'>2. Description of Service</h2>
                    <p>LifeSync provides an online marketplace that connects patients with doctors and healthcare providers for booking and managing medical appointments. We are a facilitator and do not provide direct medical care.</p>
                </section>

                <section>
                    <h2 className='text-2xl font-bold text-neutral-800 dark:text-white mb-4'>3. User Accounts</h2>
                    <p>To use certain features of the service, you must register for an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
                    <ul className='list-disc pl-6 mt-4 space-y-2'>
                        <li>You must provide accurate and complete information.</li>
                        <li>You must be at least 18 years old to create an account.</li>
                        <li>You are responsible for all actions taken by your account.</li>
                    </ul>
                </section>

                <section>
                    <h2 className='text-2xl font-bold text-neutral-800 dark:text-white mb-4'>4. Appointments & Cancellations</h2>
                    <p>Users can book appointments based on real-time availability. LifeSync reserves the right to cancel or reschedule appointments in coordination with healthcare providers. Users may cancel appointments through the platform, subject to individual provider policies.</p>
                </section>

                <section>
                    <h2 className='text-2xl font-bold text-neutral-800 dark:text-white mb-4'>5. SSO Authentication</h2>
                    <p>LifeSync supports Single Sign-On (SSO) through third-party providers including Google, Apple, and Microsoft. By using SSO, you authorize LifeSync to access certain profile information from these providers as described in our Privacy Policy.</p>
                </section>

                <section>
                    <h2 className='text-2xl font-bold text-neutral-800 dark:text-white mb-4'>6. Account Deletion</h2>
                    <p>You may request account deletion at any time. For SSO users, this may require verification via a one-time code sent to your email. Following deletion, all personal data is purged from our systems as outlined in our Privacy Policy.</p>
                </section>

                <section>
                    <h2 className='text-2xl font-bold text-neutral-800 dark:text-white mb-4'>7. Limitation of Liability</h2>
                    <p>LifeSync shall not be liable for any indirect, incidental, special, consequential or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.</p>
                </section>

                <div className='pt-8 border-t dark:border-gray-800'>
                    <p className='text-sm text-neutral-500 italic'>By using LifeSync, you acknowledge that you have read and understood these terms.</p>
                </div>
            </div>
        </div>
    )
}

export default TermsAndConditions
