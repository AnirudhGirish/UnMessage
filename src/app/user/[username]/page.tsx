'use client'
import { useParams } from 'next/navigation';
import { ApiResponse } from '@/types/ApiResponse';
import { useToast } from '@/hooks/use-toast';
import axios, { AxiosError } from 'axios';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { messageSchema } from '@/schemas/messageSchema';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const MessagePage = () => {
  const param = useParams<{username : string}>();
  const {toast} = useToast();
  const username = param.username;
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const form = useForm<z.infer<typeof messageSchema>>(
    {
      resolver:zodResolver(messageSchema),
      defaultValues:{
        content:""
      }
    }  
  );

  const onSubmit = async(data: z.infer<typeof messageSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/send-message", {
        username: param.username,
        content: data.content
      })
      toast({
        title:"Success",
        description:response.data.message
      })
    } catch (error) {
      console.error("Error while sending messages ", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title:"Message sending failed",
        description: errorMessage,
        variant:"destructive"
      })
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-full">
      <h1 className='text-4xl font-bold mb-4'>
        UnMessage
      </h1>

      <div className='mb-4'>
        <h2 className='text-lg font-semibold mb-2'>
          Welcome, {username}
        </h2>
        <Separator/>
        <div className='flex items-center w-full'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full justify-between space-y-6">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Input 
                        type="text"
                        className='w-full p-2 mr-2 border-2 border-zinc-400'
                        placeholder="Enter your message or content" 
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
                  ) : ('Send Message')
                }
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default MessagePage