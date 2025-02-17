import {z} from 'zod';

export const messageSchema = z.object({
    content : z
    .string()
    .min(10, {message: "Content must be of minimum 10 characters"})
    .max(100, {message:"Max characters in the content should not exceed 100"})
});