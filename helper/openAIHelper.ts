import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function getCommandFromChatGPT(userPrompt: string, pageSource: string) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a JSON formatter. You must respond ONLY in JSON format without any extra text or explanation." },
                { role: "user", content: `Analyze this prompt: "${userPrompt}" along with the HTML source provided. Respond strictly in the following JSON format without any additional text:\n\n{
                  "action": "fill" or "click",
                  "target": "<CSS selector or XPath or ID that exists in the HTML>",
                  "value": "<text to fill, if action is 'fill'>"
                }\n\nHTML:\n${pageSource}` }
            ]
        });

        console.log("Token usage:", response.usage);

        if (!response || !response.choices || response.choices.length === 0) {
            throw new Error("Invalid response from OpenAI API");
        }

        let command;
        try {
            command = JSON.parse(response.choices[0].message.content.trim());

            if (
                command.action &&
                command.target &&
                (command.action === "click" || (command.action === "fill" && command.value))
            ) {
                console.log("Valid command:", command);
            } else {
                throw new Error("Invalid command structure");
            }
        } catch (parseError) {
            console.error("Failed to parse or validate JSON:", parseError);
            return null;
        }

        return command;
    } catch (apiError) {
        console.error("Error calling ChatGPT API:", apiError);
        return null;
    }
}

async function executeCommand(command: { action: string; target: string; value?: string }, page: any) {
    if (command.action === "fill") {
        await page.waitForSelector(command.target, { timeout: 10000 });
        await page.fill(command.target, command.value as string);
        console.log(`Filled ${command.target} with ${command.value}`);
    } else if (command.action === "click") {
        await page.waitForSelector(command.target, { timeout: 10000 });
        await page.click(command.target);
        console.log(`Clicked ${command.target}`);
    } else {
        console.log("Unknown action:", command.action);
    }
}

export async function ai(userPrompt: string, page: any): Promise<void> {
    console.log(userPrompt);
    const pageSource = await page.content();
    const command = await getCommandFromChatGPT(userPrompt, pageSource);
    console.log(command);

    if (command) {
        await executeCommand(command, page);
    }
}
