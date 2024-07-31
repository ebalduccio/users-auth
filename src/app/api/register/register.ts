import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        await dbConnect();

        const { username, email, password } = req.body;

        //user exist?
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) return res.status(400).json({ message: 'User already exist' })

        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //create user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save()

        res.status(200).json({ message: 'User registered successfully' })
    } catch (err) {
        console.error('Registration error', err)
        res.status(500).json({ message: 'Internar Server Error' })
    }

}