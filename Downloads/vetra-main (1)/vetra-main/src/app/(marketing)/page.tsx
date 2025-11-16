import Wrapper from "@/components/global/wrapper";
import Analysis from "@/components/marketing/analysis";
import Companies from "@/components/marketing/companies";
import CTA from "@/components/marketing/cta";
import Features from "@/components/marketing/features";
import Integration from "@/components/marketing/integration";
import LanguageSupport from "@/components/marketing/lang-support";
import Pricing from "@/components/marketing/pricing";
import { Hero } from "@/components/void-hero";

const HomePage = () => {
    return (
        <div className="bg-black min-h-screen">
            <Hero />
            <Wrapper className="py-20 relative bg-black">
                <Companies />
                <Features />
                <Analysis />
                <Integration />
                <Pricing />
                <LanguageSupport />
                <CTA />
            </Wrapper>
        </div>
    )
};

export default HomePage
