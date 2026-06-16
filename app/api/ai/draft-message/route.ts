import { NextRequest, NextResponse } from 'next/server'
import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { leadName, tripName, tripDestination, vibeDescription, groupType } = await request.json()

    if (!leadName || !tripName || !tripDestination || !vibeDescription) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const prompt = `Draft a warm, short WhatsApp message for a traveller named ${leadName} who is interested in the "${tripName}" trip to ${tripDestination}.

Context about the traveller:
- Group type: ${groupType}
- What they are hoping for: "${vibeDescription}"

Guidelines for the message:
- Keep it warm and personal, not formal
- Keep it short (under 150 words)
- Use second person ("you")
- No exclamation marks
- No em-dashes
- No AI-isms like "unlock", "elevate", or "embark on a journey"
- Be specific and concrete
- Mention the trip name and destination
- Ask a relevant question to start a conversation
- Write in Nomichi's voice: warm, honest, specific, still

The message should feel like it's from a real person at Nomichi who has read their enquiry and wants to start a genuine conversation.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a travel consultant at Nomichi, a community-led travel brand that designs slow, offbeat, small-group journeys. Your voice is warm, honest, specific, and still. You write in second person. You never use exclamation marks, em-dashes, or AI-isms.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 200,
      temperature: 0.7,
    })

    const message = completion.choices[0]?.message?.content || 'Failed to generate message'

    return NextResponse.json({ message })
  } catch (error) {
    console.error('Error generating AI message:', error)
    return NextResponse.json(
      { error: 'Failed to generate message' },
      { status: 500 }
    )
  }
}
