'use client'
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useParams, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { verifyschema } from '@/schemas/verifySchema';
import { ApiResponse } from '@/types/ApiResponse';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import axios, { AxiosError } from 'axios';
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import * as z from 'zod';

const VerifyAccount = () => {
  const router = useRouter();
  const param = useParams<{username:string}>();
  const {toast} = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false)
  // ZOD
  const form = useForm<z.infer<typeof verifyschema>>(
    {
      resolver:zodResolver(verifyschema),
      defaultValues:{
        code:""
      }
    }  
  );
  
  const onSubmit = async(data: z.infer<typeof verifyschema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/verify-code", {
        username: param.username,
        code: data.code
      })
      toast({
        title:"Success",
        description:response.data.message
      })
      router.replace('/sign-in')
    } catch (error) {
      console.error("Error while verifying user ", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title:"Verification failed",
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
            Verify Account
          </h1>
          <p className="mb-4">
            Enter verification code to verify your account
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification  Code</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Code || OTP" 
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
                ) : ('Verify acccount')
              }
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default VerifyAccount