import OpenAI from 'openai';
import dotenv from 'dotenv'
dotenv.config();

const ai = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY
})

export const openAIForBio = async (req, res) => {
    try {
        if(!process.env.OPEN_AI_KEY){
            return res.status(500).json({ msg: 'OpenAI API Key is missing!', success: false });
        };

        const {query} = req.body;
        if(!query){
            return res.status(400).json({ msg: 'Input text is required', success: false });
        }

        const prompt = `${query}`;
        const response = await ai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{role: 'user', content: prompt}],
            max_tokens: 150
        });

        return res.status(201).json({
            response: response.choices[0]?.message?.content || 'No response from AI',
            success: true
        });
        
    } catch (error) {
        console.log('AI: ', error);

        if (error.response && error.response.data) {
            return res.status(error.response.status || 500).json({
                msg: error.response.data.error?.message || 'OpenAI API Error',
                success: false
            });
        }
        return res.status(501).json({
            msg: 'Internal Server Error',
            success: false
        })
    }
}
export const openAI = async (req, res) => {
    try {
        if(!process.env.OPEN_AI_KEY){
            return res.status(500).json({ msg: 'OpenAI API Key is missing!', success: false });
        };

        const {inputText} = req.body;
        if(!inputText){
            return res.status(400).json({ msg: 'Input text is required', success: false });
        }

        const prompt = `Provide smart suggestions on input: ${inputText}`;
        const response = await ai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{role: 'user', content: prompt}],
            max_tokens: 50
        });

        return res.status(201).json({
            suggestions: response.choices[0]?.message?.content || 'No response from AI',
            success: true
        });
        
    } catch (error) {
        console.log('AI: ', error);

        if (error.response && error.response.data) {
            return res.status(error.response.status || 500).json({
                msg: error.response.data.error?.message || 'OpenAI API Error',
                success: false
            });
        }
        return res.status(501).json({
            msg: 'Internal Server Error',
            success: false
        })
    }
}
