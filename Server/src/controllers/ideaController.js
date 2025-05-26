const OpenAI = require('openai');
const config = require('../config/config');

const openai = new OpenAI({
  apiKey: config.openai.apiKey
});

const evaluateIdea = async (req, res) => {
  try {
    const { description, location, audience, pricingModel, industry } = req.body;

    const prompt = `This is my startup idea what do you think about it?

      Description: ${description}
      Location: ${location}
      Target Audience: ${audience}
      Pricing Model: ${pricingModel}
      Industry: ${industry}
      `;

    const completion = await openai.chat.completions.create({
      model: config.openai.model,
      messages: [
        {
          role: "system",
          content: `You are an expert startup evaluator with deep knowledge of business models, market analysis, and startup success factors. Provide detailed, actionable feedback in a structured format.
          As an expert startup evaluator, analyze the following startup idea and provide a detailed evaluation:

          Please provide a structured evaluation with the following components:
          1. A success score (0-100)
          2. Key strengths (list 4-5 points)
          3. Potential weaknesses (list 3-4 points)
          4. Market potential analysis
          5. Competition analysis
          6. Location-specific insights
          7. Improvement suggestions (list 4-5 points)
          8. Monetization strategies (list 4-5 options)
          9. MVP (Minimum Viable Product) suggestion

          Format the response as a JSON object with these exact keys:
          {
            "successScore": number,
            "strengths": string[],
            "weaknesses": string[],
            "marketPotential": string,
            "competition": string,
            "locationInsights": string,
            "improvements": string[],
            "monetization": string[],
            "mvpSuggestion": string
          }
            ### Scoring Rubric (for successScore):
            Base your score on the following 5 factors, each weighted equally at 20 points:
            1. **Market Size & Growth Potential** – Evaluate the demand and future potential of the target market.
            2. **Value Proposition & Differentiation** – How unique, innovative, or competitive the idea is.
            3. **Feasibility & Execution** – Technical and operational viability within a reasonable time.
            4. **Monetization Clarity** – Strength and variety of ways the idea can generate revenue.
            5. **Target Audience Fit** – How well the idea meets a real, specific need or problem.

            Each section is scored from 0 to 20. Add them together to get a successScore between 0–100. Avoid subjective variation between runs—use the same rubric each time. Return only the final score (not the breakdown) in the JSON.

            For example:
            {
              "successScore": 76,
              "strengths": [...],
              ...
            }

            You MUST return only a valid JSON object. Do not include any commentary or explanation outside the JSON
          
          Make sure to be accurate and provide a detailed evaluation. Its not about being nice its about being honest and helpful nd giving valuable feedback.
          `


        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    // Parse the response and ensure it matches our expected format
    const evaluation = JSON.parse(completion.choices[0].message.content);

    // Validate the response structure
    const requiredFields = [
      'successScore', 'strengths', 'weaknesses', 'marketPotential',
      'competition', 'locationInsights', 'improvements', 'monetization',
      'mvpSuggestion'
    ];

    for (const field of requiredFields) {
      if (!evaluation[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Ensure successScore is a number between 0 and 100
    evaluation.successScore = Math.min(100, Math.max(0, Number(evaluation.successScore)));

    res.json(evaluation);
  } catch (error) {
    console.error('Error evaluating idea:', error);
    res.status(500).json({ 
      message: 'Error evaluating startup idea',
      error: error.message 
    });
  }
};

module.exports = {
  evaluateIdea
}; 