import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';

export async function POST(req: Request) {
  console.log('Register API route called');
  
  try {
    const { username, email, password } = await req.json();
    console.log('Received registration data:', { username, email, password: '****' });

    await dbConnect();
    console.log('Connected to database');

    // user exist?
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      console.log('User already exists:', existingUser.email);
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('Password hashed');

    // new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    console.log('New user saved:', newUser._id);

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}