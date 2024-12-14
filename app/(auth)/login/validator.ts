import z  from 'zod';

export const loginSchema = z.object({    
    email: z.string().email('Please enter a valid email').default(''),
    password: z.string().min(6, 'Password must be of 6 characters at least.').default(''),
})
