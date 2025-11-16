import React from "react";
import { cn } from "@/lib";

interface Props {
    className?: string;
    children: React.ReactNode;
}

const Wrapper = ({ children, className }: Props) => {
    return (
        <div
            className={cn(
                "w-full mx-auto px-4 md:px-6 lg:px-8",
                className
            )}
        >
            {children}
        </div>
    )
};

export default Wrapper
