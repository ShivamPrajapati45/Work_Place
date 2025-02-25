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

        const { fullName, profession,experienceLevel,query,previousBio } = req.body;
        // console.log(fullName,profession,experienceLevel,query)

        if(!query && (!fullName || !profession || !experienceLevel)){
            return res.status(400).json({ msg: 'Query or all details are required', success: false });
        }

        let prompt;
        if(!previousBio){
            prompt = `Generate a professional and engaging summary for a freelancer based on the following details:  
                    - **Full Name:** ${fullName}  
                    - **Profession:** ${profession}  
                    - **Experience Level:** ${experienceLevel}  

                    The summary should:  
                    ✔ Highlight the freelancer’s expertise and key skills  
                    ✔ Clearly convey what services they offer  
                    ✔ Be concise yet impactful, suitable for a professional freelancing platform  
                    ✔ Maintain a natural, engaging, and confident tone  
                    ✔ Optionally include relevant software/tools they might use (if applicable)  

                    Ensure that the tone remains **client-friendly, compelling, and professional** to attract potential clients.
                    `;
        }else{
            prompt = `Modify the following professional summary based on the user's request:  

                        - **Existing Description:** "${previousBio}"  
                        - **User's Request:** "${query}"  

                        Follow these guidelines:  
                        ✔ If the user wants a **shorter version**, summarize it concisely while retaining key points.  
                        ✔ If they request a **more engaging** version, enhance the language, making it lively and compelling.  
                        ✔ If they want it to sound **more professional**, refine the tone to be polished and authoritative.  
                        ✔ If they mention **specific additions or removals**, apply the changes accordingly.  
                        ✔ **DO NOT** ask the user for the description again—just modify it directly.  

                        Ensure the revised description maintains clarity, professionalism, and is well-suited for a freelancing platform.  
                        `;
        }
        

        const response = await ai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{role: 'user', content: prompt}],
            max_tokens: 150
        });
        // console.log(response)
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

export const openAIForSkill = async (req, res) => {
    try {
        if(!process.env.OPEN_AI_KEY){
            return res.status(500).json({ msg: 'OpenAI API Key is missing!', success: false });
        };

        const {bio} = req.body;

        if(!bio){
            return res.status(400).json({ msg: 'Bio is Required', success: false });
        }

        const prompt = `Based on the following user bio, suggest the most relevant professional skills. 
        The skills should be specific to the user's expertise and commonly used in their profession.
        
        Bio: "${bio}"

        Provide only a comma-separated list of skills.`;

        const response = await ai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{role: 'user', content: prompt}],
            max_tokens: 50
        });
        // console.log(response)
        return res.status(201).json({
            skills: response.choices[0]?.message?.content || 'No response from AI',
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
