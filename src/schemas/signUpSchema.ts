import {z} from 'zod';

// export const usernameValidation = z.string().min(5, "Minimum length of username should be 5").max(15,"Max length of username should be 15").regex(/[a-zA-Z0-9_]+$/,"Username must not have special characters")

export const usernameValidation = z
    .string()
    .min(5, "Minimum length of username should be 5")
    .max(15,"Max length of username should be 15")
    .regex(/[a-zA-Z0-9_]+$/,"Username must not have special characters")

export const signUpschema = z.object({
    username: usernameValidation,
    email: z.string().email({message:"Invalid email address"}),
    password: z.string().min(5, {message: "Password needs to be minimum 5 characters"}).max(15,{message:"Password can be max 15 characters long"})
});