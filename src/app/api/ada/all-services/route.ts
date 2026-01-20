import { supabase } from "@/lib/supabase/supabase";
import { NextResponse } from "next/server";

export async function GET() {
    const { data, error } = await supabase.rpc('get_all_services');

    if (error) {
        return NextResponse.json({error: error.message}, {status: 500})
    };

    return NextResponse.json(data);
}
