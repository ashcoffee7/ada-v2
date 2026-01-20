import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/supabase';

export async function POST(req: Request) {
  const { email, password, fullName, address, insurance, username } = await req.json();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        // These keys match the ->> keys in your SQL trigger exactly
        full_name: fullName, 
        username: username, // Added this to match SQL
        address: address,
        insurance: insurance
      }
    }
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ message: "Check your email to verify your account!" });
}