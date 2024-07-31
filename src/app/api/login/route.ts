import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';

export async function POST(req: Request) {
  console.log('Login API route called');
  try {
    console.log('Connecting to database...');
    await dbConnect();
    console.log('Connected to database');

    const { email, password } = await req.json();
    console.log('Login attempt for email:', email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }
    console.log('User found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password does not match');
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }
    console.log('Password matched');

    if (!process.env.NEXT_PUBLIC_JWT_SECRET) {
      console.error('JWT_SECRET is not defined');
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.NEXT_PUBLIC_JWT_SECRET,
      { expiresIn: '1h' }
    );
    console.log('JWT token generated');

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}