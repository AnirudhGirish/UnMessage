// import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
import { streamText, APICallError, generateText } from 'ai';
import { NextResponse } from 'next/server';

export const maxDuration = 30;

export async function POST(req: Request) {
    try {
        // const { messages } = await req.json(); not taking input from user
        const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics focus instead on universal themes that encourage friendly interaction. For example your output should be structured like this: 'Whats a hobby you are recently started? || If you could have dinner with any historical figure, who would it be? || Whats a simple thing that makes you happy ?'. Ensure the questions are intriguing, foster curiosity and contribute to a positive and welcoming conversational environment."

        // const result = streamText({
        // model: google('gemini-1.5-flash'),
        //     prompt,
        //     onError({ error }) {
        //         console.error(error); // your error logging logic here
        //     }
        // });
        // return result.toDataStreamResponse(); The response i have put below is not structured so changed to non stream

        const result = await generateText({
            model: google('gemini-1.5-flash'),
            prompt
        })
        const text = result.text
        return NextResponse.json(text)
        
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
