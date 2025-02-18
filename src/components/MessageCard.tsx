'use client'
import React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from './ui/button';
import { X } from 'lucide-react';
import { Message } from '@/model/User.model';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
  
type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void
}
  
const MessageCard = ({message, onMessageDelete}:MessageCardProps) => {
    const {toast} = useToast();
    const handleDeleteConfirm = async () => {
        const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`);
        toast({
            title:response.data.message
        })
        onMessageDelete(message._id)
    }
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle className='text-center text-2xl'>{message.content}</CardTitle>
                    <CardDescription className='text-center'>{new Date(message.createdAt).toLocaleString()}</CardDescription>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" className='w-1/2 mx-auto'><X className='w-2 h-3'/></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete your and remove your data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                     </AlertDialog>
                </CardHeader>

            </Card>
        </div>
    )
}

export default MessageCard
