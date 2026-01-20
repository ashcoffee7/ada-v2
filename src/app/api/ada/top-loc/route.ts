import { supabase } from "@/lib/supabase/supabase";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    // grab all params
    try {
        const { searchParams } = new URL(request.url);
        const address = searchParams.get('address');
        const kval = parseInt(searchParams.get('k') || '5');
        const insurances = searchParams.getAll('insurances');
        const services = searchParams.getAll('services');

        // {TODO}: add frontend toast error for this! 
        if (!address) {
            return NextResponse.json({ error: "DEBUG: Missing Address" }, { status: 400 });
        }

        // convert address to lat/lng
        const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_API_KEY}`;
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();
        if (geoData.status !== 'OK') {
            return NextResponse.json({ 
                error: "DEBUG: Google Geocoding Failed", 
                status: geoData.status,
                reason: geoData.error_message 
            }, { status: 400 });
        }
        const lat = geoData.results[0].geometry.location.lat;
        const lng = geoData.results[0].geometry.location.lng;

        // call postgis to find top k locations
        const { data, error } = await supabase.rpc('get_nearby_centers', {
            user_lat: parseFloat(lat), // Ensure these are numbers
            user_lng: parseFloat(lng),      
            k: kval,          
            filter_insurances: insurances.length > 0 ? insurances : null,
            filter_services: services.length > 0 ? services : null 
        });
        
        if (error) throw error;

        return NextResponse.json(data);
    } catch (e) {
        return NextResponse.json({ 
            error: e.message || "Unknown Error",
            details: e.toString() 
        }, { status: 500 });
    }
}