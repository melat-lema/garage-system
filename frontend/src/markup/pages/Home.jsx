import React from 'react';
import LayOut from '../components/LayOut';
import { SiYoutubemusic } from "react-icons/si";
import { IoIosArrowRoundForward } from "react-icons/io";
import { motion } from "framer-motion";

import banner from '../../assets/images/banner1.jpg';
import banner1 from '../../assets/images/vban1.jpg';
import banner2 from '../../assets/images/vban2.jpg';
import img1 from '../../assets/images/img1.png';
import img2 from '../../assets/images/img2.png';
import img3 from '../../assets/images/img3.png';

export default function Home() {
    return(
        <LayOut>
            <div>
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                    className="bg-cover bg-center w-full text-white px-6 md:px-20 lg:pl-40"
                    style={{ backgroundImage: `url(${banner})`, minHeight: '100vh', paddingTop: '200px' }}
                >
                    <h6>
                        Working since 1992 <span className='text-red-600'>_______</span>
                    </h6>
                    <h1 className='text-3xl md:text-5xl font-bold'>Tuneup Your Car<br/>to Next Level</h1>
                    <div className='flex gap-4 mt-6 items-center'>
                        <span><SiYoutubemusic style={{color: "red", fontSize: "30px"}}/></span>
                        <p className='text-xs'>WATCH INTRO VIDEO<br/>ABOUT US</p>
                    </div>
                </motion.div>

                {/* About Section */}
                <div className='flex flex-col lg:flex-row justify-between items-center m-10 md:m-20 lg:ml-40 lg:pl-20 lg:pr-20 gap-10' id="about">
                    {/* left side */}
                    <motion.div
                        initial={{ opacity: 0, x: -100 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="flex gap-3 p-4 md:p-10"
                    >
                        <img src={banner1} alt="Banner" className="w-40 md:w-60 lg:w-72 h-60 md:h-80 lg:h-96 object-cover" />
                        <div className="relative w-40 md:w-60 lg:w-72 h-60 md:h-80 lg:h-96">
                            <img src={banner2} alt="Banner" className="w-full h-full object-cover" />
                            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-28 bg-white text-center border border-white shadow-lg z-10 py-4 px-2">
                                <p className="text-red-600 font-bold text-2xl md:text-4xl leading-tight">24</p>
                                <p className="text-red-600 text-xs md:text-sm tracking-wide font-semibold leading-snug">
                                    YEARS <br />EXPERIENCE
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* right side */}
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className='w-full lg:w-1/2 p-4 md:p-10 flex flex-col gap-4'
                    >
                        <h6 className='text-blue-300'>Welcome to Our workshop</h6>
                        <h1 className='text-blue-900 text-xl md:text-2xl font-bold -mt-2'>We have 24 years of experience</h1>
                        <p className='text-gray-400 text-sm md:text-base text-justify'>Lorem Ipsum is simply dummy text...</p>
                        <button className='bg-red-900 text-white px-4 py-2 rounded hover:bg-red-200 w-36 flex items-center justify-center'>ABOUT US <IoIosArrowRoundForward style={{ fontSize: "24px"}}/></button>
                    </motion.div>
                </div>

                {/* Services Section */}
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                    className='bg-gray-100 py-16 px-4 md:px-10 lg:px-20'
                    id="services"
                >
                    <h1 className='text-2xl md:text-4xl text-blue-900 pb-4 md:pb-6'>Our Services<span className='text-red-600'> _____</span></h1>
                    <p className='text-sm md:text-base text-gray-600'>Bring to the table win-win survival strategies...</p>
                    <div className="py-10">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {[
                                { title: "Performance Upgrade", icon: "🔧" },
                                { title: "Transmission Services", icon: "⚙️" },
                                { title: "Break Repair & Service", icon: "🛞" },
                                { title: "Engine Service & Repair", icon: "🛠️" },
                                { title: "Tyre & Wheels", icon: "🚗" },
                                { title: "Denting & Painting", icon: "🎨" }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                    className="relative bg-white shadow-md p-6 flex flex-col justify-between min-h-[200px] group"
                                >
                                    <p className="text-xs font-semibold text-blue-800 uppercase mb-2">Service and Repairs</p>
                                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                                    <div className="flex items-end justify-between mt-auto">
                                        <p className="text-red-600 text-sm font-semibold group-hover:underline">READ MORE +</p>
                                        <span className="text-3xl md:text-4xl text-gray-300">{item.icon}</span>
                                    </div>
                                    <div className="absolute bottom-0 left-0 h-[3px] w-full bg-red-600"></div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Split Section */}
                <div className="flex flex-col lg:flex-row h-auto lg:h-80">
                    <motion.div
                        initial={{ opacity: 0, x: -100 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="bg-red-600 text-white p-6 md:p-10 flex flex-col justify-center lg:pl-20 lg:w-1/2"
                    >
                        <h2 className="text-2xl md:text-3xl font-bold mb-4">Quality Service And <br /> Customer Satisfaction !!</h2>
                        <p className="text-sm md:text-base">We utilize the most recent symptomatic gear...</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="lg:w-1/2"
                    >
                        <img src={img1} alt="Dashboard" className="w-full h-64 md:h-80 object-cover" />
                    </motion.div>
                </div>

                {/* Why Choose Us & Additional Services */}
                <div className="bg-white py-12 px-4 md:px-10 lg:px-16">
                    <div className="grid md:grid-cols-2 gap-10">
                        <motion.div
                            initial={{ opacity: 0, x: -100 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="text-xl md:text-2xl font-bold text-blue-900 mb-2">Why Choose Us <span className='text-red-600'>_______</span></h3>
                            <p className="text-sm text-gray-600 mb-6 max-w-lg">Bring to the table win-win survival strategies...</p>
                            <ul className="space-y-4 md:space-y-6">
                                <li className="flex items-center gap-4"><span className="text-xl md:text-2xl text-red-600">🧰</span><span className="text-blue-900 font-semibold">Certified Expert Mechanics</span></li>
                                <li className="flex items-center gap-4"><span className="text-xl md:text-2xl text-red-600">⚡</span><span className="text-blue-900 font-semibold">Fast And Quality Service</span></li>
                                <li className="flex items-center gap-4"><span className="text-xl md:text-2xl text-red-600">💰</span><span className="text-blue-900 font-semibold">Best Prices in Town</span></li>
                                <li className="flex items-center gap-4"><span className="text-xl md:text-2xl text-red-600">🏆</span><span className="text-blue-900 font-semibold">Awarded Workshop</span></li>
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 100 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="text-xl md:text-2xl font-bold text-blue-900 mb-6">Additional Services <span className='text-red-600'>_______</span></h3>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <img src={img2} alt="Classic car" className="w-full sm:w-52 h-60 object-cover" />
                                <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                                    <li>General Auto Repair & Maintenance</li>
                                    <li>Transmission Repair & Replacement</li>
                                    <li>Tire Repair and Replacement</li>
                                    <li>State Emissions Inspection</li>
                                    <li>Break Job / Break Services</li>
                                    <li>Electrical Diagnostics</li>
                                    <li>Fuel System Repairs</li>
                                    <li>Starting and Charging Repair</li>
                                    <li>Steering and Suspension Work</li>
                                    <li>Emission Repair Facility</li>
                                    <li>Wheel Alignment</li>
                                    <li>Computer Diagnostic Testing</li>
                                </ul>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Hero Section 2 */}
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                    className="relative bg-cover bg-center text-white"
                    style={{ backgroundImage: `url(${img3})` }}
                >
                    <div className="bg-black bg-opacity-50 w-full h-full px-6 py-16 md:py-20 md:px-16 lg:px-28 flex flex-col justify-center">
                        <span className="uppercase tracking-widest text-sm mb-2">Working since 1992 <span className='text-red-600'>_____</span></span>
                        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">We are leader<br /> in Car Mechanical Work</h1>
                        <div className="flex items-center gap-4">
                            <span><SiYoutubemusic style={{color: "red", fontSize: "30px"}}/></span>
                            <div>
                                <p className="text-xs uppercase">Watch Intro Video</p>
                                <p className="text-xs text-gray-300">About Us</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* CTA Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="bg-white py-8 flex justify-center"
                    id="contact"
                >
                    <div className="bg-red-600 w-full max-w-5xl px-6 py-6 md:py-8 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6 text-white rounded shadow-md">
                        <div>
                            <h3 className="text-base md:text-lg font-semibold">Schedule Your Appointment Today</h3>
                            <p className="text-xs md:text-sm">Your Automotive Repair & Maintenance Service Specialist</p>
                        </div>
                        <div className="text-lg md:text-2xl font-bold">1800.456.7890</div>
                        <button className="bg-white text-red-600 font-semibold px-6 py-2 rounded hover:bg-gray-100 transition">CONTACT US →</button>
                    </div>
                </motion.div>

            </div>
        </LayOut> 
    )
}