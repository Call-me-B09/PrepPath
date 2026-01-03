const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.generateRoadmapData = async ({ examName, level, commitment, days, hours, syllabusText, pyqText }) => {
    console.log("   🤖 [AI Service] Initializing Gemini...");
    try {
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        const modelName = "gemini-flash-latest";
        const model = genAI.getGenerativeModel({ model: modelName });
        console.log(`   🤖 [AI Service] Using model: ${modelName}`);

        const prompt = `
      You are an expert study planner. Create a highly detailed and personalized study roadmap for a student preparing for the "${examName}" exam.
      
      User Profile:
      - Preparation Level: ${level}
      - Daily Commitment: ${commitment}
      - Time Remaining: ${days} days, ${hours} hours.
      
      Extracted Syllabus Context: ${syllabusText ? syllabusText.substring(0, 5000) : "Not provided, infer from exam name."}
      Extracted PYQ Context: ${pyqText ? pyqText.substring(0, 2000) : "Not provided."}

      Task:
      1. Identify the core subjects or sections required for this exam.
      2. Generate a sequential list of study steps (topics) to cover the identified subjects within the remaining time.

      Output strictly valid JSON in the following format (do not include Markdown formatting):
      {
        "subjects": ["Subject A", "Subject B", "Subject C"],
        "steps": [
          {
            "title": "Topic Name",
            "subject": "Subject A", 
            "type": "reading", // or "practice"
            "order": 1,
            "durationMinutes": 60
          },
          ...
        ]
      }
      Ensure the steps are logical and fit the timeline.
    `;

        console.log("   🤖 [AI Service] Sending prompt to Gemini...");
        // console.log("   --- Prompt Preview ---\n", prompt.substring(0, 200) + "...\n   ----------------------");

        const start = Date.now();
        const result = await model.generateContent(prompt);
        const end = Date.now();
        console.log(`   🤖 [AI Service] Response received in ${end - start}ms`);

        const response = await result.response;
        let text = response.text();

        // Clean Markdown logic
        const originalLength = text.length;
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();

        console.log(`   🤖 [AI Service] Raw response length: ${originalLength} chars. Parsed JSON...`);

        const aiData = JSON.parse(text);
        return aiData;

    } catch (error) {
        console.error("   ❌ [AI Service] Error:", error.message);
        throw new Error("Failed to generate roadmap via AI");
    }
};
