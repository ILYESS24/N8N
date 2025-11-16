"use client";

import Container from "../global/container";
import { CpuArchitecture } from "../ui/cpu-architecture";

const CpuSection = () => {
    return (
        <Container className="py-20">
            <div className="flex flex-col items-center justify-center gap-8">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                        Powered by Advanced AI Architecture
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Our cutting-edge CPU architecture ensures lightning-fast processing and optimal performance for all your AI-powered marketing needs.
                    </p>
                </div>
                <div className="w-full max-w-4xl">
                    <div className="bg-muted/30 rounded-lg p-8 border border-border">
                        <CpuArchitecture
                            width="100%"
                            height="400"
                            text="AI"
                            showCpuConnections={true}
                            animateText={true}
                            animateLines={true}
                            animateMarkers={true}
                        />
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default CpuSection;

