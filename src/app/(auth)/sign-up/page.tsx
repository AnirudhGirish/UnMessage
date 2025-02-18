'use client'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { signUpschema } from "@/schemas/signUpSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from 'react';
import { ApiResponse } from "@/types/ApiResponse";
import { useDebounceCallback } from 'usehooks-ts';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from 'axios';
import { Loader2 } from "lucide-react";
import Link from "next/link";
import * as z from "zod";

const Page = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessagge] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false)
  const debounced = useDebounceCallback(setUsername, 750);
  const { toast } = useToast();
  const router = useRouter();

  // ZOD
  const form = useForm<z.infer<typeof signUpschema>>(
    {
      resolver:zodResolver(signUpschema),
      defaultValues:{
        username:"",
        email:"",
        password:""
      }
    }
  )

  useEffect(()=>{
    const checkUsernameUnique = async ()=> {
      if(username){
        setIsCheckingUsername(true);
        setUsernameMessagge('')
        try {
          const response = await axios.get(`api/check-username-unique?username=${username}`);
          setUsernameMessagge(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessagge(axiosError.response?.data.message ?? "Error checking username");
        } finally {
          setIsCheckingUsername(false)
        }
      }
    }
    checkUsernameUnique();
  },[username])

  const onSubmit = async (data: z.infer<typeof signUpschema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up',data);
      toast({
        title:'Success',
        description: response.data.message
      })
      router.replace(`/verify/${username}`)
      form.reset();
      setUsername('');
    } catch (error) {
      console.error("Error while signing up user ", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title:"Sign-up failed",
        description: errorMessage,
        variant:"destructive"
      })
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join UnMessage
          </h1>
          <p className="mb-4">
            Sign Up to start your anonymous adventure
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Username" 
                      {...field} 
                      onChange={(e)=> {
                        field.onChange(e); 
                        debounced(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    {isCheckingUsername ? (
                        <Loader2 className="mr-2 h-2 w-2 animate-spin" />
                      ) : usernameMessage ? (
                        <span className={`${usernameMessage === "Username is unique" ? 'text-green-500' : 'text-red-500'}`}>
                          {usernameMessage}
                        </span>
                      ) : (
                        "Please enter a username"
                    )}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email"
                      placeholder="Email" 
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password"
                      placeholder="Password" 
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {
                isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please Wait
                </>
                ) : ('Sign-Up')
              }
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-500 hover:text-blue-800">Sign-In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Page