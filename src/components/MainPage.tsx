import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, Linkedin } from 'lucide-react';

const MainPage = () => {
    return (
        <div className="min-h-screen bg-radial-gradient flex flex-col items-center justify-center p-4">
            <h1 className='mb-20 text-4xl font-bold text-white'>Users-auth-app</h1>
            <Card className="w-full max-w-md bg-white bg-opacity-90">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Welcome to User Auth App</CardTitle>
                    <CardDescription className="text-center">A secure user authentication system</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-center">
                        This application demonstrates a robust user authentication system built with Next.js and shadcn/ui.
                    </p>
                    <div className="flex justify-center space-x-4">
                        <Button asChild>
                            <Link href="/login">Login</Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link href="/register">Register</Link>
                        </Button>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col items-center">
                    <p className="text-sm text-gray-600 mb-2">Created by Enzo Balduccio</p>
                    <div className="flex space-x-4">
                        <a href="https://github.com/ebalduccio" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">
                            <Github size={24} />
                        </a>
                        <a href="https://www.linkedin.com/in/enzobalduccio" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">
                            <Linkedin size={24} />
                        </a>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default MainPage;