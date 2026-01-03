"use client";
import { useState } from "react";
import React from 'react';


export default function Contactpage() {
    const [category, setCategory] = useState("");

    return (
        <section className="flex flex-col justify-start items-center min-h-screen bg-[#fffbea] py-20 px-5 animate-header">
            <h1 className="text-center font-montserrat text-[#3d9194] text-3xl font-bold mb-4">
                Contact Us
            </h1>
            <p className="text-center font-montserrat text-[#3d9194] text-lg font-bold mb-4">
                Please leave your contact information and we'll get back to you within 1-2 business days.
            </p>

            { /* Selecting Category */ }
            <div className="flex flex-col mb-8 mt-10">
                <label className="text-sm font-bold font-inter uppercase mb-3">
                    I am reaching out about:
                </label>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-100 p-3 border-2 border-[#3d9194]/20 rounded-xl focus:border-[#3d9194] outline-none transition-all">
                        <option value="">Select a category</option>
                        <option value="general">General Inquiry</option>
                        <option value="sponsor">Sponsorship</option>
                        <option value="clinic">Clinic Registration</option>
                    </select>

            </div>

            { /* Form */ }
            <form className="space-y-5">
                { /* Always Visible */ }
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Full Name" className="p-3 border rounded-lg w-full" required />
                    <input type="email" placeholder="Email" className="p-3 border rounded-lg w-full" required />
                </div>

                { /* Sponsors */ }
                {category === "sponsor" && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" placeholder="Organization Name" className="p-3 border rounded-lg w-full" required />
                            <input type="text" placeholder="Organization Website" className="p-3 border rounded-lg w-full" required />    
                            <input type="text" placeholder="Phone Number" className="p-3 border rounded-lg w-full" required />
                        </div>
                    </>
                )}

                {category == "clinic" && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" placeholder="Organization Name" className="p-3 border rounded-lg w-full" required />
                            <input type="text" placeholder="Organization Website" className="p-3 border rounded-lg w-full" required />  
                            <input type="text" placeholder="Location" className="p-3 border rounded-lg w-full" required />
                            <input type="text" placeholder="Phone Number" className="p-3 border rounded-lg w-full" required />                        
                        </div>
                        <input type="text" placeholder="Email" className="p-3 border rounded-lg w-full" required />
                    </>
                )}

                <div className="max-height">
                    <textarea 
                        placeholder="Message" 
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#3d9194] outline-none min-h-[150px]" 
                        rows={6} 
                        required 
                        />
                </div>
            </form>

            
         </section>
    )
}