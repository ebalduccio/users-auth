'use client'

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from '@/context/AuthContext';

interface FormState {
    email: string;
    password: string;
}

type ApiResponse = {
    token: string;
    message?: string;
};

const LoginForm: React.FC = () => {
    const [formState, setFormState] = useState<FormState>({
        email: '',
        password: '',
    });
    const [error, setError] = useState<string>('');

    const router = useRouter();
    const { login } = useAuth()

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        console.log('Login form submitted');

        try {
            console.log('Sending login request');
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formState),
            });

            console.log('Response status:', response.status);
            const data: ApiResponse = await response.json();
            console.log('Response data:', data);

            if (response.ok) {
                console.log('Login successful');
                login(data.token);
                router.push('/dashboard'); // Adicione esta linha para redirecionar após o login
            } else {
                console.error('Login failed:', data.message);
                setError(data.message || 'An error occurred during login.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formState.email}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formState.password}
                    onChange={handleChange}
                    required
                />
            </div>
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            <Button type="submit" className="w-full">
                Log In
            </Button>
        </form>
    );
};

export default LoginForm;