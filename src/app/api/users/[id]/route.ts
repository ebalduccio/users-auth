import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import jwt from 'jsonwebtoken'

function verifyToken(token: string): boolean {
    try {
        jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET!);
        return true;
    } catch (error) {
        return false;
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const token = req.headers.get('Authorization')?.split(' ')[1];
        if (!token || !verifyToken(token)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const { username, email } = await req.json();
        const user = await User.findByIdAndUpdate(params.id, { username, email }, { new: true });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
      const token = req.headers.get('Authorization')?.split(' ')[1];
      if (!token || !verifyToken(token)) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
  
      await dbConnect();
      const user = await User.findByIdAndDelete(params.id);
  
      if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }
  
      return NextResponse.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
  }