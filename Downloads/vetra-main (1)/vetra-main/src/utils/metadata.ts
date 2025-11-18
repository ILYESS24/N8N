import { Metadata } from "next";

interface MetadataProps {
    title?: string;
    description?: string;
    icons?: Metadata["icons"];
    noIndex?: boolean;
    keywords?: string[];
    author?: string;
    twitterHandle?: string;
    type?: "website" | "article" | "profile";
    locale?: string;
    alternates?: Record<string, string>;
    publishedTime?: string;
    modifiedTime?: string;
}

export const generateMetadata = ({
    title = `AURION - All-in-One AI Platform for Web & App Creation`,
    description = `AURION is the ultimate all-in-one AI platform that creates professional websites and applications using the latest AI models. Build stunning UI/UX, generate content (text, images, videos), deploy AI agents, edit code with AI assistance, and access integrated component libraries. Stop switching between tools - create your entire business in one place.`,
    icons = [
        {
            rel: "icon",
            url: "/icons/icon-dark.png",
            media: "(prefers-color-scheme: light)",
        },
        {
            rel: "icon",
            url: "/icons/icon.png",
            media: "(prefers-color-scheme: dark)",
        },
    ],
    noIndex = false,
    keywords = [
        "AI website builder",
        "AI app creator",
        "AI content generation",
        "AI code editor",
        "AI agents",
        "all-in-one platform",
        "UI/UX design AI",
        "AI text editor",
        "AI video generation",
        "AI image generation",
        "component library",
        "no-code AI",
        "AI development platform",
        "business creation platform",
        "AI-powered tools"
    ],
    author = process.env.NEXT_PUBLIC_AUTHOR_NAME,
    type = "website",
}: MetadataProps = {}): Metadata => {
    const metadataBase = new URL(process.env.NEXT_PUBLIC_APP_URL || "https://vertra-ai.vercel.app");

    return {
        metadataBase,
        title: {
            template: `%s | ${process.env.NEXT_PUBLIC_APP_NAME}`,
            default: title
        },
        description,
        keywords,
        authors: [{ name: author }],
        creator: author,
        publisher: process.env.NEXT_PUBLIC_APP_NAME,
        formatDetection: {
            email: false,
            address: false,
            telephone: false,
        },
        icons,
    };
};