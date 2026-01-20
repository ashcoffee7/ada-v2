import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase with the MASTER key (service_role)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
);

export async function GET() {
  try {
    // 1. Fetch clinics with missing locations
    const { data: clinics, error: fetchError } = await supabase
      .from('all_clinics')
      .select('ID, address')
      .is('location', null);

    if (fetchError) throw fetchError;
    if (!clinics || clinics.length === 0) {
      return NextResponse.json({ message: "No clinics need geocoding!" });
    }

    const results = [];

    for (const clinic of clinics) {
      // 2. Contact Google
      const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(clinic.address)}&key=${process.env.GOOGLE_API_KEY}`;
      const response = await fetch(geoUrl);
      const geoData = await response.json();

      if (geoData.status === 'OK') {
        const { lat, lng } = geoData.results[0].geometry.location;

        // 3. Update the database
        const { error: updateError } = await supabase
          .from('all_clinics')
          .update({ 
            location: `POINT(${lng} ${lat})` 
          })
          .eq('ID', clinic.ID);

          results.push({ 
            address: clinic.address, 
            status: updateError ? "Error" : "Success",
            error_details: updateError ? updateError.message : null // Add this line!
        });
      }
    }

    return NextResponse.json({ processed: results });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}