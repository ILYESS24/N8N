"use client";

import Container from "../global/container";
import { AIInput } from "../ui/ai-input";

const AIInputSection = () => {
    const handleSubmit = (value: string) => {
        console.log("AI Input submitted:", value);
        // Add your AI processing logic here
    };

    return (
        <Container className="py-20">
            <div className="flex flex-col items-center justify-center gap-8">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                        Ask AI Anything
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Get instant answers and insights powered by our advanced AI technology. Type your question and let AI do the work.
                    </p>
                </div>
                <div className="w-full max-w-2xl">
                    <AIInput
                        placeholder="Ask me anything about marketing, automation, or analytics..."
                        onSubmit={handleSubmit}
                        minHeight={52}
                        maxHeight={200}
                    />
                </div>
            </div>
        </Container>
    );
};

export default AIInputSection;

