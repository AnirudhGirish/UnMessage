'use client'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { Message, User } from '@/model/User.model';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import React, { useCallback, useEffect, useState } from 'react'
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Loader2, RefreshCcw } from 'lucide-react';
import MessageCard from '@/components/MessageCard';

const Dashboard = () => {
  console.log("In dashboard app of (app)")
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const {data : session} = useSession();
  const {toast} = useToast();

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId))
  }

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema)
  })
  const {register, watch, setValue} = form;

  const acceptMessages = watch('acceptMessages');

  const fetchAcceptMessage = useCallback(async()=>{
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages');
      setValue('acceptMessages', response.data.isAcceptingMessages!)
    } catch (error) {
      const axiosError = error as  AxiosError<ApiResponse>;
      toast({
        title:"Error",
        description: axiosError.response?.data.message || "Failed to fetch message settings",
        variant:"destructive"
      })
    } finally {
      setIsSwitchLoading(false)
    }
  },[setValue]);

  const fetchMessages = useCallback(async(refresh: boolean  = false)=>{
    setIsLoading(true);
    setIsSwitchLoading(false);
    try {
      const response = await axios.get<ApiResponse>('api/get-messages');
      setMessages(response.data.messages || [])
      if(refresh){
        toast({
          title:"Refreshed messages",
          description: "Showing latest messages",
        })
      }
    } catch (error) {
      const axiosError = error as  AxiosError<ApiResponse>;
      toast({
        title:"Error",
        description: axiosError.response?.data.message || "Failed to fetch message settings",
        variant:"destructive"
      })
    } finally {
      setIsLoading(false)
      setIsSwitchLoading(false)
    }
  },[setIsLoading, setMessages]);

  useEffect(()=>{
    if(!session || !session.user){
      console.log("Dashboard error")
      return
    }
    fetchMessages();
    fetchAcceptMessage();
  },[session, setValue, fetchAcceptMessage, fetchMessages]);

  const handleswitchChange = async() => { 
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages',{acceptMessages: !acceptMessages});
      setValue('acceptMessages', !acceptMessages);
      toast({
        title: response.data.message,
        variant: 'default'
      })
    } catch (error) {
      const axiosError = error as  AxiosError<ApiResponse>;
      toast({
        title:"Error",
        description: axiosError.response?.data.message || "Failed to change message settings",
        variant:"destructive"
      })
    }
  }

  const {username} = session?.user as User 
  const baseUrl = `${window.location.protocol}://${window.location.host}`;
  const profileUrl = `${baseUrl}/user/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "URL Copied",
      description: "Profile URL has been copied to clipboard"
    })
  }

  if(!session || !session?.user){
    console.log("Dashboard user error")
    return <div>Please Login!!!!</div>
  }

  return (
    <div className='my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl'>
      <h1 className='text-4xl font-bold mb-4'>
        User Dashboard
      </h1>

      <div className='mb-4'>
        <h2 className='text-lg font-semibold mb-2'>
          Copy your unique link
        </h2>{' '}
        <div className='flex items-center'>
          <input type="text" value={profileUrl} disabled className='input input-bordered w-full p-2 mr-2' />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className='mb-4'>
        <Switch {...register('acceptMessages')} checked={acceptMessages} onCheckedChange={handleswitchChange} disabled={isSwitchLoading} />
        <span className='ml-2'>
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>

      <Separator/>

      <Button 
        className='mt-4'
        variant='outline'
        onClick={(e)=>{
          e.preventDefault();
          fetchMessages();
        }
      }>
        {isLoading ? (<Loader2 className='h-4 w-4 animate-spin'/>) : (<RefreshCcw className='h-4 w-4'/>)}
      </Button>

      <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-6'>
        {messages.length > 0 ? (
          messages.map((message, index)=>(<MessageCard message={message} onMessageDelete={handleDeleteMessage} key={message._id}/>))
        ) : (
          <p>No messages to display</p>
        )}
      </div>
    </div>
  )
}

export default Dashboard