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

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Malformed JSON request body' }, { status: 400 })
  }

  const { logs } = body

  if (!logs || !Array.isArray(logs) || logs.length === 0) {
    return NextResponse.json(
      { error: 'No call logs to summarize' },
      { status: 400 }
    )
  }

  try {

    // Heuristic fallback if AI client is not configured
    if (!aiClient) {
      const latestLog = logs[0]
      const notes = latestLog.notes || ''
      const nextAction = latestLog.next_action || ''
      
      let summary = `Last contact: ${notes.substring(0, 50)}...`
      if (nextAction) {
        summary += ` Next step: ${nextAction}.`
      } else {
        summary += ` Follow up call recommended.`
      }

      return NextResponse.json({ summary, isMock: true })
    }

    const logText = logs.map((log: any, index: number) => {
      const dateStr = new Date(log.created_at).toLocaleDateString('en-IN')
      return `[${dateStr}] Note: "${log.notes}"${log.next_action ? ` | Next Action: "${log.next_action}"` : ''}`
    }).join('\n')

    const prompt = `Summarise the following touchpoint history for a traveller lead into a single sentence.
The sentence must indicate: where this stands and what to do next.

Touchpoint History:
${logText}

Guidelines:
- Keep it to a single sentence (under 30 words)
- Focus on concrete status and next action
- Write in Nomichi's voice: warm, honest, specific, still
- Never use exclamation marks
- Never use em-dashes
- Never use AI-isms like "unlock", "elevate", or "embark"

Return ONLY the summary string in your response.`

    const completion = await aiClient.chat.completions.create({
      model: aiModel,
      messages: [
        {
          role: 'system',
          content: `You are a CRM assistant at Nomichi, summarizing lead logs into a single concise sentence.
Your voice is warm, honest, specific, and still. Never use exclamation marks, em-dashes, or AI-isms like "unlock" or "embark".

Here are examples of your expected summaries:

Example 1:
Input:
[15/06/2025] Note: "Initial call. She is very interested in the Spiti trip. Works in tech, needs a break. Flexible with dates." | Next Action: "Send detailed itinerary and follow up in 3 days"
Output:
"The traveler is interested in Spiti to escape city work, and we are following up in three days after sending the itinerary."

Example 2:
Input:
[16/06/2025] Note: "Spoke with Rahul. Group of 4 confirmed. All love cooking. Asked about dietary restrictions." | Next Action: "Send menu options and confirm dates"
Output:
"The group of four friends is ready to cook Goan dishes, and we need to share menu choices and finalize booking dates."

Example 3:
Input:
[17/06/2025] Note: "Ananya called. Anniversary in August. Desert camp perfect for them. Asked about accommodation privacy." | Next Action: "Send photos of camp setup and discuss privacy options"
[18/06/2025] Note: "Sent photos. She liked the tents but wants to know if they can get a private dinner." | Next Action: "Confirm dinner details with desert team"
Output:
"The couple likes the desert camp layout, and we are validating private dinner arrangements with the ground team."`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 100,
      temperature: 0.3,
    })

    const summary = completion.choices[0]?.message?.content?.trim() || 'Logs recorded. Follow up recommended.'

    return NextResponse.json({ summary, isMock: false })

  } catch (error) {
    console.error('Error in log summarizer API:', error)
    return NextResponse.json(
      { error: 'Failed to summarize logs' },
      { status: 500 }
    )
  }
}
