import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await dbConnect();
        return NextResponse.json({ message: 'Database connected successfully' }, { status: 200 });
    } catch (err) {
        console.error('Database connection error', err);
        return NextResponse.json({ message: 'Failed to connect to database' }, { status: 500 });
    }
}
