import React from 'react';
import { GrLocation } from "react-icons/gr";
import { MdOutlineEmail, MdOutlinePhone } from "react-icons/md";
import { CiFacebook, CiLinkedin } from "react-icons/ci";
import { RiTwitterXLine } from "react-icons/ri";
import { FaInstagram } from "react-icons/fa";

export default function Footer() {
    return (
        <div className="w-full bg-blue-900 text-white text-sm">
            {/* Footer Top Content */}
            <div className="flex flex-wrap border-b border-gray-600">
                {/* Section 1 - Location */}
                <div className="w-full md:w-1/4 p-6 border-b md:border-b-0 border-gray-600 md:border-r flex items-start justify-center md:justify-end">
                    <div className="flex items-start">
                        <GrLocation className="text-red-500 text-3xl md:text-4xl mr-3" />
                        <p>123 Main Street<br />New York, NY 10001</p>
                    </div>
                </div>

                {/* Section 2 - Email */}
                <div className="w-full md:w-1/4 p-6 border-b md:border-b-0 border-gray-600 md:border-r flex items-start justify-center">
                    <div className="flex items-start">
                        <MdOutlineEmail className="text-red-500 text-3xl md:text-4xl mr-3" />
                        <p>Email Us:<br />contact@example.com</p>
                    </div>
                </div>

                {/* Section 3 - Phone */}
                <div className="w-full md:w-1/4 p-6 border-b md:border-b-0 border-gray-600 md:border-r flex items-start justify-center">
                    <div className="flex items-start">
                        <MdOutlinePhone className="text-red-500 text-3xl md:text-4xl mr-3" />
                        <p>Call on us:<br />(123) 456-7890</p>
                    </div>
                </div>

                {/* Section 4 - Empty / future */}
                <div className="w-full md:w-1/4 p-6 hidden md:block">
                    {/* Optional future section */}
                </div>
            </div>

            {/* Footer Bottom Content */}
            <div className="p-6 md:p-10 flex flex-col md:flex-row md:justify-between gap-8 md:gap-4">
                {/* About Us */}
                <div className="w-full md:w-1/4 text-gray-300">
                    <p>
                        We’re dedicated to providing top-quality auto repair services with a smile. From diagnostics to detailing — we’ve got you covered.
                    </p>
                </div>

                {/* Useful Links */}
                <div className="w-full md:w-1/4">
                    <h4 className="font-semibold mb-2">Useful Links</h4>
                    <ul className="space-y-1 text-gray-300">
                        <li><a href="#" className="hover:underline">Home</a></li>
                        <li><a href="#" className="hover:underline">About</a></li>
                        <li><a href="#" className="hover:underline">Services</a></li>
                        <li><a href="#" className="hover:underline">Contact</a></li>
                    </ul>
                </div>

                {/* Our Services */}
                <div className="w-full md:w-1/4">
                    <h4 className="font-semibold mb-2">Our Services</h4>
                    <ul className="space-y-1 text-gray-300">
                        <li>Engine Diagnostics</li>
                        <li>Brake Repair</li>
                        <li>Oil Change</li>
                        <li>Bodywork & Painting</li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div className="w-full md:w-1/4">
                    <h4 className="font-semibold mb-2">Newsletter</h4>
                    <p className="text-gray-300 mb-2">Get the latest updates and offers.</p>
                    <div className="flex items-center gap-4 mt-4">
                        <CiFacebook className="text-2xl cursor-pointer hover:text-gray-400" />
                        <CiLinkedin className="text-2xl cursor-pointer hover:text-gray-400" />
                        <RiTwitterXLine className="text-2xl cursor-pointer hover:text-gray-400" />
                        <FaInstagram className="text-2xl cursor-pointer hover:text-gray-400" />
                    </div>
                </div>
            </div>

            {/* Bottom copyright */}
            <div className="text-center p-4 text-xs border-t border-gray-600">
                © {new Date().getFullYear()} AbeGarage. All rights reserved.
            </div>
        </div>
    );
}
