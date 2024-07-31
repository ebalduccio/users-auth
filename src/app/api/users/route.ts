import { NextResponse } from 'next/server';
import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';
import jwt from 'jsonwebtoken'

function verifyToken(token: string): boolean {
    try {
        jwt.verify(token, process.env.JWT_SECRET!);
        return true;
    } catch (error) {
        return false;
    }
}

export async function GET(req: Request) {
    try {
        const token = req.headers.get('Authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
        }

        await dbConnect();

        const users = await User.find({}, '-password');

        return NextResponse.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}