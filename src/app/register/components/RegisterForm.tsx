'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import React, { ChangeEvent, FormEvent, useState } from 'react'

interface FormState {
    username: string;
    email: string;
    password: string;
};

type ApiResponse = {
    message: string
};

const RegisterForm: React.FC = () => {
    const [formState, setFormState] = useState<FormState>({
        username: '',
        email: '',
        password: ''
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

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formState),
            });

            const data: ApiResponse = await response.json();

            if (response.ok) router.push('/login'); else setError(data.message || 'An error occurred during registration.');
        } catch (err) {
            setError('An error occurred. Please try again.');
        }
    };



    return (
        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
            <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                    id="username"
                    type="text"
                    value={formState.username}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
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
                Register
            </Button>
        </form>
    )
}

export default RegisterForm