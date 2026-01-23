'use client';
import React from 'react';
import FavoriteButton from './favorite-button';

interface Center {
    ID: number,
    name: string,
    address: string,
    "image_address": string
}


export default function LocationCard( {center}: {center: Center}) {
    return (
        <div className="flex flex-col flex-1 min-w-[350px] max-w-[400px] bg-white p-5 rounded-[20px] shadow-lg font-inter items-center">
        <img 
            src={center["image_address"] } 
            alt={center.name} 
            referrerPolicy="no-referrer"
            className="w-[200px] h-[200px] rounded-lg mt-[10px] object-cover"
        />
        
        <div className="flex flex-col items-center w-full mt-2.5 px-2.5">
            <h3 className="font-bold text-2xl text-darkslategray leading-tight hover:text-darkblue cursor-pointer text-center">
                {center.name}
            </h3>
            <FavoriteButton centerId={center.ID} />
        </div>
        
        <p className="my-2.5 text-lg font-light text-center">
            {center.address}
        </p>
        </div>
    );
}
