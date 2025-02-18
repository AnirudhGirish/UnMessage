'use client'
import { useParams } from 'next/navigation';
import { ApiResponse } from '@/types/ApiResponse';
import { useToast } from '@/hooks/use-toast';
import axios, { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  
  const form = useForm<z.infer<typeof messageSchema>>(
    {
      resolver:zodResolver(messageSchema),
      defaultValues:{
        content:""
      }
    }  
  );

  const getSuggestions = async()=>{
    setIsLoading(true);
    setData([]);
    try {
      const response = await axios.post("/api/suggest-messages");
      const retrive = response?.data?.text || "";
      // const value = retrive.toString();
      const messages = retrive.split('||').filter(Boolean);;
      setData(messages);
      toast({
        title:"Success fetch suggestions",
        description:response.data.message
      })
    } catch (error) {
      console.error("Error while getting suggestions", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title:"Suggestions etch failed",
        description: errorMessage,
        variant:"destructive"
      })
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(()=>{
    getSuggestions();
  },[])

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
      form.reset();
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

  const handleAiCopy = (message: string) => {
    form.setValue("content", message); 
    form.trigger("content");
  };
  

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-full">
      <h1 className='text-4xl font-bold mb-4'>
        UnMessage
      </h1>

      <div className='mb-4'>
        <h2 className='text-lg font-semibold mb-2'>
          Welcome, {username}
        </h2>
        <Separator className='border-solid border-2 border-black my-4'/>
        <div className='flex items-center w-full'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full justify-between space-y-6">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-xl'>Message</FormLabel>
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

        <Separator className='border-solid border-2 border-black my-4'/>

        <div>
          <h2 className='text-3xl font-semibold mb-2 text-center my-4 mx-4'>
            Suggest Messages using AI 
          </h2>
          <Button onClick={getSuggestions} disabled={isLoading}>
                {
                  isLoading ? (
                  <>
                    <Loader2 className="ml-6 mr-2 h-4 w-4 animate-spin"/> Please Wait
                  </>
                  ) : ('Fetch Messages')
                }
              </Button>
          <div>
            {data.map((message, index)=>(
              <input type="text" key={index} value={message} readOnly className='input input-bordered w-full p-2 m-3 bg-zinc-300 rounded-md hover:bg-zinc-200 hover:cursor-pointer' onClick={()=>handleAiCopy(message)}/>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
export default MessagePage