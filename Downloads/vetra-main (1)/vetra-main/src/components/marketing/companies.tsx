import Container from "../global/container";
import Images from "../global/images";
import { LogoCloud } from "../logo-cloud-3";

const Companies = () => {
    const logos = [
        { alt: "Company 1", component: <Images.company1 className="h-7 w-auto" /> },
        { alt: "Company 2", component: <Images.company2 className="h-7 w-auto" /> },
        { alt: "Company 3", component: <Images.company3 className="h-7 w-auto" /> },
        { alt: "Company 6", component: <Images.company6 className="h-7 w-auto" /> },
        { alt: "Company 7", component: <Images.company7 className="h-7 w-auto" /> },
        { alt: "Company 9", component: <Images.company9 className="h-7 w-auto" /> },
        { alt: "Company 10", component: <Images.company10 className="h-7 w-auto" /> },
    ];

    return (
        <div className="relative flex flex-col items-center justify-center w-full py-20 mt-16 companies overflow-hidden">
            <Container>
                <div className="flex flex-col items-center justify-center">
                    <h4 className="text-2xl lg:text-4xl font-medium">
                        Trusted by <span className="font-subheading italic">leading</span> brands
                    </h4>
                </div>
            </Container>

            <Container delay={0.1} className="w-full mx-auto pt-16">
                <LogoCloud logos={logos} />
            </Container>
        </div>
    )
};

export default Companies
