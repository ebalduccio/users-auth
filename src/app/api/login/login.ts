import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

    try {
        await dbConnect();

        const { email, password } = req.body;

        //user exist?
        const user = await User.findOne({ email });
        if (!user) return res.status(409).json({ message: 'Invalid Credentials' });

        //check password
        const checkedPassword = await bcrypt.compare(password, user.password);
        if (!checkedPassword) return res.status(400).json({ message: 'invalid Credentials' });

        //create and sign JWT token

        const token = jwt.sign(
            { userID: user._id },
            process.env.JWT_SECRET!,
            { expiresIn: '1h' }
        );

        res.status(200).json(token);
    } catch (err) {
        console.error('Login error', err);
        res.status(500).json({ message: 'Internal Server Error' })
    }

}