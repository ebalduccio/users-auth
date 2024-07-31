import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import jwt from 'jsonwebtoken';
import { NextResponse } from "next/server";

function verifyToken(token: string): boolean {
    try {
        jwt.verify(token, process.env.JWT_SECRET!);
        return true;
    } catch (error) {
        return false;
    }
}

export default async function GET(req: Request) {
    try {
        const authHeader = req.headers.get('Authorization');
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        if (!verifyToken(token)) return NextResponse.json({ message: 'Invalid token' }, { status: 401 });

        await dbConnect();

        const users = await User.find({}, '-password');
        return NextResponse.json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}