"use client";
import { useState } from "react";
import React from 'react';
import { supabase } from "@/lib/supabase/supabase";
import { toast } from "sonner";

export default function Contactpage() {
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState(false);

    /* Reused input styles */
    const inputClasses = "w-full p-4 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-[#3d9194] focus:ring-1 focus:ring-[#3d9194] transition-all font-inter text-slate-700 placeholder:text-slate-400";

    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        const form = e.currentTarget;
        console.log("Clicked!");
        e.preventDefault();
        setLoading(true);
    
        const formData = new FormData(e.currentTarget);
        const submission = {
            category: category,
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            message: formData.get("message") as string,
            orgName: formData.get("orgName") as string,
            website: formData.get("website") as string,
            phone: formData.get("phone") as string,
            location: formData.get("location") as string,
        };
    
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
    
        if (!emailRegex.test(submission.email)) {
            setLoading(false);
            return toast.error("Invalid email address.", { description: "Please enter a valid email address.", duration: Infinity });
        }
    
        if (category === "sponsor" || category === "clinic") {
            if (!phoneRegex.test(submission.phone)) {
                setLoading(false);
                return toast.error("Invalid phone number.", { description: "Please enter a valid phone number.", duration: Infinity });
            }
            if (submission.website && !urlRegex.test(submission.website)) {
                setLoading(false);
                return toast.error("Invalid website.", { description: "Please enter a valid website URL.", duration: Infinity });
            }
        }
    
        let finalError = null; 
    
        if (category === "sponsor") {
            const { error } = await supabase.from("sponsors").insert({
                name: submission.name,
                email: submission.email,
                message: submission.message,
                org_name: submission.orgName, 
                org_site: submission.website,
                phone_num: submission.phone
            });
            finalError = error;
        } 
        else if (category === "clinic") { 
            const { error } = await supabase.from("clinics").insert({
                name: submission.name,
                email: submission.email,
                message: submission.message,
                clinic_name: submission.orgName,
                location: submission.location,
                phone: submission.phone,
                clinic_site: submission.website
            });
            finalError = error;
        } 
        else {
            const { error } = await supabase.from("general").insert({
                name: submission.name,
                email: submission.email,
                message: submission.message,
                category: category
            });
            finalError = error;
        }
    
        setLoading(false);
    
        if (finalError) {
            toast.error("Submission failed: " + finalError.message, { duration: Infinity });
        } else {
            toast.success("Submission successful!", { duration: 5000 });
            form.reset();
            setCategory(""); 
        }
    }

    return (
        <section className="flex flex-col justify-start items-center min-h-screen bg-[#fffbea] py-16 px-5">
            <div className="max-w-3xl w-full text-center mb-10">
                <h1 className="font-montserrat text-[#3d9194] text-4xl font-bold mb-4">
                    Contact Us
                </h1>
                <p className="font-inter text-slate-600 text-lg max-w-xl mx-auto">
                    Please leave your contact information and we'll get back to you within 1-2 business days.
                </p>
            </div>

            <div className="w-full max-w-2xl bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-[#3d9194]/5 border border-slate-100">
                
                <div className="flex flex-col mb-10">
                    <label className="text-xs font-bold font-inter uppercase tracking-widest text-[#3d9194] mb-3">
                        I am reaching out about:
                    </label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-[#3d9194] focus:bg-white outline-none transition-all cursor-pointer font-inter text-slate-700">
                            <option value="">Select a category...</option>
                            <option value="general">General Inquiry</option>
                            <option value="sponsor">Sponsorship</option>
                            <option value="clinic">Clinic Registration</option>
                    </select>
                </div>

                { /* Form */ }
                <form onSubmit={submitForm} className="space-y-6">
                    {/* Always Visible */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold font-inter text-slate-400 uppercase ml-1">Full Name</label>
                            <input name="name" type="text" placeholder="John Doe" className={inputClasses} required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold font-inter text-slate-400 uppercase ml-1">Email</label>
                            <input name="email" type="email" placeholder="john@example.com" className={inputClasses} required />
                        </div>
                    </div>

                    {/* Sponsor */}
                    {category === "sponsor" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
                            <input name="orgName" type="text" placeholder="Organization Name" className={inputClasses} required />
                            <input name="website" type="text" placeholder="Organization Website" className={inputClasses} required />    
                            <div className="md:col-span-2">
                                <input name="phone" type="text" placeholder="Phone Number" className={inputClasses} required />
                            </div>
                        </div>
                    )}

                    {/* Clinic */}
                    {category === "clinic" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
                            <input name="orgName" type="text" placeholder="Clinic Name" className={inputClasses} required />
                            <input name="location" type="text" placeholder="Location (City, State)" className={inputClasses} required />
                            <input name="phone" type="text" placeholder="Phone Number" className={inputClasses} required />
                            <input name="website" type="text" placeholder="Website" className={inputClasses} required />
                        </div>
                    )}

                    {/* Message */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold font-inter text-slate-400 uppercase ml-1">Message</label>
                        <textarea 
                            name="message" 
                            placeholder="How can we help you?" 
                            className={`${inputClasses} min-h-[150px] resize-none`} 
                            rows={5} 
                            required 
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading || !category}
                        className="w-full bg-[#3d9194] text-white p-5 rounded-2xl font-bold text-lg hover:bg-[#2d6e70] hover:shadow-lg hover:shadow-[#3d9194]/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 mt-4"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Processing...
                            </span>
                        ) : "Submit Inquiry"}
                    </button>
                </form>
            </div>
         </section>
    )
}