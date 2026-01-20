import { supabase } from "@/lib/supabase/supabase";
import { NextResponse } from "next/server";

export async function GET(centerName: string) {
    try {
        const { data, error } = await supabase
            .from('centers')
            .select('*');
            .eq('name', centerName)
            .single();

        if (error) throw error;

        return data;
    } catch (e) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}