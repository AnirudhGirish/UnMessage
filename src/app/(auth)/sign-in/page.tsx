'use client'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import * as z from "zod";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";

const Page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast();
  const router = useRouter();

  // ZOD
  const form = useForm<z.infer<typeof signInSchema>>(
    {
      resolver:zodResolver(signInSchema),
      defaultValues:{
        identifier:"",
        password:""
      }
    }
  )

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    const result = await signIn('credentials',{
      redirect:false,
      callbackUrl: "/dashboard",
      identifier: data.identifier,
      password: data.password
    });
    if(result?.error){
      setIsSubmitting(false);
      toast({
        title:"Login Failed",
        description:`Incorrect identifier or password: ${result?.error}`,
        variant:"destructive"
      })
    }
    if(result?.url){
      setIsSubmitting(false);
      router.push(result.url || "/dashboard")
      // router.replace('/dashboard')
    }
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Sign In
          </h1>
          <p className="mb-4">
            Sign In to start your anonymous adventure
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email or Username</FormLabel>
                  <FormControl>
                    <Input 
                      type="string"
                      placeholder="Email or Username" 
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
                ) : ('Sign-In')
              }
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Not a member?{' '}
            <Link href="/sign-up" className="text-blue-500 hover:text-blue-800">Sign-Up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Page