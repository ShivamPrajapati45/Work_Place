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

export const generateServiceTitle = async (req, res) => {
    const {category} = req.body;
    try {
        if(category){
            const prompt = `Act as an expert in freelance gig creation. 
                            Suggest 5 professional gig titles for the "${category}" category. 
                            Each title must start with "I will" and describe the service attractively. 
                            Only return the gig titles as a numbered list without any extra text.`;

            const response = await ai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [{role: 'user', content: prompt}],
                // max_tokens: 50
            });

            const titles = response.choices[0].message.content
                            .split("\n")
                            .map(title => title.replace(/^\d+\.\s*/, ""))
                            .filter(title => title.trim());

            return res.status(201).json({
                titles,
                success: true
            })
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const generateDescription = async (req, res) => {
    const {title, category,query,previousDescription} = req.body;
    try {
        let prompt = "";

        if (query) {
            // User ne manually kuch likha hai, toh uska query + existing description bhi bhejna hoga
            prompt = `Enhance and refine the following gig description based on the user's request. 

                        ### **Gig Information**:
                        - **Category:** "${category}"  
                        - **Title:** "${title}"  
                        - **Existing Description:** "${previousDescription || 'None'}"  
                        - **User Query:** "${query}"  

                        ### **Important Instructions**:
                        1. **Modify and improve the description** to make it more detailed and compelling.
                        2. **Address any specific requests mentioned in the user's query**.
                        3. **Ensure the description fully explains the gig**, covering all necessary details:
                        - What the service includes  
                        - Step-by-step process  
                        - Key benefits for the client  
                        - What makes this service unique  
                        4. **Improve clarity, structure, and professionalism**.
                        5. **Use bullet points where needed** to enhance readability.
                        6. **Make it persuasive and engaging while maintaining professionalism**.
                        7. **Avoid adding unnecessary headings** like "Gig Title" or "Category" in the response.

                        ### **Output Format**:
                        Provide **only the improved gig description** (without extra labels or headings). The output should be **a complete and structured gig description** that fully explains the service.
                        `;


        } else if (title && category) {
            // First-time generation case
            prompt = `Generate a **detailed and professional gig description** for a freelancer's service.

                        ### **Gig Information**:
                        - **Category:** "${category}"  
                        - **Title:** "${title}"  

                        ### **Important Instructions**:
                        1. **Start with an engaging introduction** that instantly captures the client's attention.
                        2. **Clearly explain what this service offers**, covering all important details.
                        3. **Break down the process step-by-step** so clients know what to expect.
                        4. **Highlight the key benefits** of hiring this freelancer for the service.
                        5. **Explain what makes this service unique** compared to others.
                        6. **Use bullet points** for clarity where necessary.
                        7. **Ensure the tone is professional, client-focused, and persuasive**.
                        8. **Avoid generic statements** – make the description specific to the given title and category.
                        9. **Keep it structured, engaging, and free from unnecessary fluff**.

                        ### **Output Format**:
                        Provide **only the gig description** (without any extra headings like "Gig Title" or "Category"). The output should be **a fully detailed and well-structured gig description** that clearly explains everything a client needs to know.
                        `;

        }

        // AI Response
        const response = await ai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 150
        });

        const description = response.choices[0].message?.content.trim();
        if (!description) {
            return res.status(500).json({ message: "Failed to generate description" });
        }

        return res.status(201).json({
            description,
            success: true
        });

    } catch (error) {
        console.error("AI Description Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const generateFeatures = async (req, res) => {
    try {
        if (!process.env.OPEN_AI_KEY) {
            return res.status(500).json({ msg: 'OpenAI API Key is missing!', success: false });
        }

        const { description } = req.body;

        if (!description) {
            return res.status(400).json({ msg: 'Gig description is required', success: false });
        }

        const prompt = `Based on the following gig description, extract **3-4 key features** that highlight the most important aspects of the service.

            ### **Gig Description**:
            "${description}"

            ### **Instructions**:
            - Provide only **3 to 4 features**.
            - Each feature should be concise, **highlighting a unique selling point**.
            - Keep them in a **comma-separated format**.

            ### **Output Example**:
            "High-quality video editing, Unlimited revisions, Fast delivery, Custom transitions"`;

        const response = await ai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 50
        });

        return res.status(201).json({
            features: response.choices[0]?.message?.content || 'No response from AI',
            success: true
        });

    } catch (error) {
        console.log('AI Error: ', error);

        if (error.response && error.response.data) {
            return res.status(error.response.status || 500).json({
                msg: error.response.data.error?.message || 'OpenAI API Error',
                success: false
            });
        }
        return res.status(501).json({
            msg: 'Internal Server Error',
            success: false
        });
    }
};

