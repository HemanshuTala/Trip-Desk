import { NextRequest, NextResponse } from 'next/server'
import { OpenAI } from 'openai'

const getAiClientAndModel = () => {
  if (process.env.GROQ_API_KEY) {
    return {
      client: new OpenAI({
        apiKey: process.env.GROQ_API_KEY,
        baseURL: 'https://api.groq.com/openai/v1',
      }),
      model: 'llama3-8b-8192',
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

const { client: aiClient, model: aiModel } = getAiClientAndModel()

export async function POST(request: NextRequest) {
  try {
    const { vibeDescription, groupType, preferredMonth, tripName, tripDestination } = await request.json()

    if (!vibeDescription) {
      return NextResponse.json(
        { error: 'Missing vibe description' },
        { status: 400 }
      )
    }

    // Heuristic fallback if AI client is not configured
    if (!aiClient) {
      const lowerVibe = vibeDescription.toLowerCase()
      let rating: 'Fit' | 'Neutral' | 'Requires Call' = 'Neutral'
      let reason = 'This traveler seeks a personal break, which aligns with slow and small-group journeys.'

      if (lowerVibe.includes('slow') || lowerVibe.includes('local') || lowerVibe.includes('culture') || lowerVibe.includes('disconnect') || lowerVibe.includes('authentic') || lowerVibe.includes('quiet')) {
        rating = 'Fit'
        reason = 'Their interest in local culture and quiet settings matches our slow travel format.'
      } else if (lowerVibe.includes('party') || lowerVibe.includes('fast') || lowerVibe.includes('sightseeing') || lowerVibe.includes('resort') || lowerVibe.includes('luxury')) {
        rating = 'Requires Call'
        reason = 'They mentioned high-paced or resort-style items, so check if they prefer group tours.'
      }

      return NextResponse.json({ rating, reason, isMock: true })
    }

    const prompt = `Assess if this traveller is a good fit for Nomichi's slow, offbeat, small-group journeys.

Traveller details:
- Trip: "${tripName}" in ${tripDestination}
- Group Type: ${groupType}
- Preferred Month: ${preferredMonth}
- What they hope the trip feels like: "${vibeDescription}"

Guidelines:
- Return a rating: "Fit", "Neutral", or "Requires Call"
- Provide a one-line reason (under 25 words) justifying the rating
- Do NOT reject automatically; just provide a suggestion
- Write the reason in Nomichi's voice: warm, honest, specific, still
- Never use exclamation marks
- Never use em-dashes
- Never use AI-isms like "unlock", "elevate", or "embark"

Return ONLY a JSON object with this exact structure:
{
  "rating": "Fit" | "Neutral" | "Requires Call",
  "reason": "your one-line reason here"
}`

    const completion = await aiClient.chat.completions.create({
      model: aiModel,
      messages: [
        {
          role: 'system',
          content: 'You are a CRM assistant at Nomichi, assessing traveler alignment with slow travel. You return JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    })

    const resultText = completion.choices[0]?.message?.content || '{}'
    const result = JSON.parse(resultText)

    return NextResponse.json({
      rating: result.rating || 'Neutral',
      reason: result.reason || 'This traveler seeks a personal break, which aligns with slow and small-group journeys.',
      isMock: false
    })

  } catch (error) {
    console.error('Error in vibe check API:', error)
    return NextResponse.json(
      { error: 'Failed to process vibe check' },
      { status: 500 }
    )
  }
}
