'use client'
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import messages from '@/messages.json';
import Autoplay from 'embla-carousel-autoplay';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className='flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12'>
        <section className='text-center mb-8 md:mb-12'>
          <h1 className='text-3xl md:text-5xl font-bold'>
            Dive into the world of Anonymous Conversations
          </h1>
          <p className='mt-3 md:mt-4 text-base md:text-lg'>
            Explore UnMessage - Where your identity remains a secret.
          </p>
        </section>
        <Carousel plugins={[Autoplay({delay:2000})]} className="w-full max-w-xs">
          <CarouselContent>
            {
              messages.map((message, index)=>(
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card>
                      <CardHeader className='text-2xl text-center font-bold'>
                        {message.title}
                      </CardHeader>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <span className="text-xl font-semibold">{message.content}</span>
                      </CardContent>
                      <CardFooter className='text-lg text-center font-bold'>{message.received}</CardFooter>
                    </Card>
                  </div>
                </CarouselItem>
              ))
            }
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
      <footer className='text-center p-4 md:6'>
        &copy; UnMessage. All rights reserved.
      </footer>
    </div>
  )
}

export default Home