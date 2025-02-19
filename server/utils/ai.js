import OpenAI from 'openai';
import dotenv from 'dotenv'
dotenv.config();

const ai = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY
})

export const openAI = async (req, res) => {
    try {
        const {inputText} = req.body;
        const prompt = `Provide smart suggestions on input: ${inputText}`;
        console.log(inputText, prompt)
        const response = await ai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{role: 'user', content: prompt}],
            max_tokens: 50
        });

        return res.status(201).json({
            suggestions: response.choices[0].message.content,
            success: true
        });
        
    } catch (error) {
        console.log('AI: ', error)
        return res.status(501).json({
            msg: 'Internal Server Error',
            success: false
        })
    }
}
