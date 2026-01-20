import { supabase } from "@/lib/supabase/supabase";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('all_clinics')
            .select('*');

        if (error) throw error;

        return NextResponse.json(data);
    } catch (e) {
        console.error("Backend Error:", e);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}