// import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
import { streamText, APICallError, generateText } from 'ai';
import { NextResponse } from 'next/server';

export const maxDuration = 30;

export async function POST(req: Request) {
    try {
        const randomSeed = Math.floor(Math.random() * 1000);
        const prompt = `Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics focus instead on universal themes that encourage friendly interaction. For example your output should be structured like this: 'Whats a hobby you are recently started? || If you could have dinner with any historical figure, who would it be? || Whats a simple thing that makes you happy ?'. Ensure the questions are intriguing, foster curiosity and contribute to a positive and welcoming conversational environment. Please make sure every time questions are new and different, I am getting same response everytime i hit this endpoint so please qive new questions everytime. Also do respect and maintain the structure or the format asked. Request ID: ${randomSeed}. Ask questions regarding latest news, movies, developments in ai, sports, food, habits, book-recommendation, gadgets, talk of the town, business, etc. You can also generate new questions regarding any domain and field you know you are a expert guide on how to ask questions, just keep in mind the format you need to pass the content and go wild asking questions.`


        const result = await generateText({
            model: google('gemini-1.5-flash'),
            prompt,
            temperature:1.4,
            topK:50
        })
        const text = result.text
        return NextResponse.json({success:true, message: "Suggestions sent successfully", text},{status:200})
        
    } catch (error:any) {
        if (APICallError.isInstance(error)) {
            const {name, statusCode, responseHeaders, responseBody, message} = error
            console.error('API Call Error:', error.message);
            return NextResponse.json({name, message, responseHeaders, responseBody},{status:statusCode})
        } else {
            console.error('Unexpected Error:', error);
            return NextResponse.json({ success: false, message: 'An unexpected error occurred' },{ status: 500 })
        }
    }
}
        // const { messages } = await req.json(); not taking input from user
        // const result = streamText({
        // model: google('gemini-1.5-flash'),
        //     prompt,
        //     onError({ error }) {
        //         console.error(error); // your error logging logic here
        //     }
        // });
        // return result.toDataStreamResponse(); The response i have put below is not structured so changed to non stream
