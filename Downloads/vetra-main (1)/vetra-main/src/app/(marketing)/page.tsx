"use client";

export const dynamic = 'force-dynamic';

import { GooeyText } from "@/components/ui/gooey-text-morphing";
import { AnomalousMatterHero } from "@/components/anomalous-matter-hero";
import { useEffect } from "react";
import { renderCanvas } from "@/components/canvas-effect";

const HomePage = () => {
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const timer = setTimeout(() => {
            renderCanvas();
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="bg-black min-h-screen relative">
            <canvas id="canvas" className="fixed top-0 left-0 w-full h-full pointer-events-none z-0" />
            <div className="relative w-full h-screen z-[1] flex items-center justify-center">
                <GooeyText 
                    texts={["PROMPTING", "IS ALL", "YOU NEED"]}
                    morphTime={1}
                    cooldownTime={0.25}
                    className="w-full"
                    textClassName="text-white"
                />
            </div>
            <AnomalousMatterHero 
                title="Observation Log: Anomaly 7"
                subtitle="Matter in a state of constant, beautiful flux."
                description="A new form of digital existence has been observed. It responds to stimuli, changes form, and exudes an unknown energy. Further study is required."
            />
        </div>
    )
};

export default HomePage
