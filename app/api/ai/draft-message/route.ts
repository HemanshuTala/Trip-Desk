import { NextRequest, NextResponse } from 'next/server'
import { OpenAI } from 'openai'

const getAiClientAndModel = () => {
  if (process.env.GROQ_API_KEY) {
    return {
      client: new OpenAI({
        apiKey: process.env.GROQ_API_KEY,
        baseURL: 'https://api.groq.com/openai/v1',
      }),
      model: 'llama-3.1-8b-instant',
    }
  }
  if (process.env.OPENAI_API_KEY) {
    return {
      client: new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      }),
      model: 'gpt-4o-mini',
    }
  }
  return { client: null, model: '' }
}

export async function POST(request: NextRequest) {
  const { client: aiClient, model: aiModel } = getAiClientAndModel()
  
  if (!aiClient) {
    return NextResponse.json(
      { error: 'AI API key not configured' },
      { status: 501 }
    )
  }

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Malformed JSON request body' }, { status: 400 })
  }

  const leadName = body.leadName || ''
  const tripName = body.tripName || 'Unknown Trip'
  const tripDestination = body.tripDestination || 'Unknown Destination'
  const vibeDescription = body.vibeDescription || ''
  const groupType = body.groupType || 'solo'

  if (!leadName.trim() || !tripName.trim() || !tripDestination.trim() || !vibeDescription.trim()) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    )
  }

  try {
    const prompt = `Draft a warm, short WhatsApp introduction message for a traveller named ${leadName} who is interested in the "${tripName}" trip to ${tripDestination}.

Context about the traveller:
- Group type: ${groupType}
- What they are hoping for: "${vibeDescription}"

Guidelines for the message:
- Keep it warm, grounded, and personal, not formal.
- Keep it short (under 75 words).
- Use second person ("you").
- Strictly no exclamation marks.
- Strictly no em-dashes.
- Strictly no AI-isms like "unlock", "elevate", "discover", "explore", or "embark".
- Prefer concrete details over abstract feelings.
- Mention the trip name and destination.
- Gently refer to a specific detail they wrote in their hope description. If their input has typos, extract the core sentiment and speak to it gracefully.
- End with exactly one open-ended question to start a genuine conversation.
- Write in Nomichi's voice: warm, honest, specific, still.

The message should feel like it was typed by a thoughtful friend, not a marketing copywriter.`

    const completion = await aiClient.chat.completions.create({
      model: aiModel,
      messages: [
        {
          role: 'system',
          content: `You are a travel coordinator at Nomichi, a community-led travel brand. Your voice is warm, honest, specific, and still. You write in second person. You never use exclamation marks, em-dashes, or AI-isms like "unlock", "elevate", or "embark".
          
          You write short, highly personalized texts that start directly with a greeting (e.g. "Hi Priya,") and avoid standard corporate introductions or filler phrases ("Hope you are doing well", etc.). You ask only one question at the end.

          Here are examples of how we write:

          Example 1:
          Input:
          - Traveller name: Priya
          - Trip: Himalayan Village Walk
          - Destination: Spiti Valley
          - Group type: solo
          - Vibe description: "I want to disconnect from city life and experience something authentic. Not looking for tourist spots, just real village life."
          Output:
          "Hi Priya, saw you are looking at the Himalayan Village Walk in Spiti. It is a quiet route, mostly staying in homestays where the family cooks local barley and buckwheat. You mentioned wanting to disconnect from city life. What kind of daily pace are you hoping to find up there?"

          Example 2:
          Input:
          - Traveller name: Rahul
          - Trip: Coastal Foraging Journey
          - Destination: Goa
          - Group type: friends
          - Vibe description: "A group of 4 friends who love cooking. We want to learn about local ingredients and cook together."
          Output:
          "Hi Rahul, saw your enquiry about the Coastal Foraging Journey. Gathering a group of four friends to cook together in Goa sounds lovely. We spend our mornings with local fishermen finding mud crabs and wild berries, then cook them in our open kitchen. Do you or your friends have any specific Goan dishes you are eager to learn?"`,
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
