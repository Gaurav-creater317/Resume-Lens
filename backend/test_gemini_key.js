require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testKey() {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        console.log("Testing API Key:", apiKey ? "Present" : "Missing");

        if (!apiKey) return;

        const genAI = new GoogleGenerativeAI(apiKey);

        console.log("Attempt 1: gemini-1.5-flash");
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent("Hi");
            console.log("✅ Success with gemini-1.5-flash!");
        } catch (e) {
            console.log("⚠️ Failed with gemini-1.5-flash:", e.message);

            console.log("Attempt 2: gemini-pro");
            try {
                const model2 = genAI.getGenerativeModel({ model: "gemini-pro" });
                const result2 = await model2.generateContent("Hi");
                console.log("✅ Success with gemini-pro!");
            } catch (e2) {
                console.log("⚠️ Failed with gemini-pro:", e2.message);
                throw e2;
            }
        }
    } catch (error) {
        console.error("❌ FINAL ERROR: Key likely invalid or quota exceeded.", error.message);
    }
}

testKey();
