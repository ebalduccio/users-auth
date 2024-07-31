import mongoose, { ConnectOptions } from 'mongoose';

declare global {
    var mongoose: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    };
}

const MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
} = (global as any).mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect(): Promise<typeof mongoose> {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts: ConnectOptions = {
            bufferCommands: false,
        };
        cached.promise = mongoose.connect(MONGODB_URI!, opts);
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw (e)
    }

    return cached.conn;
}

export default dbConnect;
