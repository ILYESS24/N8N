import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { cn } from "@/lib/index";
import { ReactNode } from "react";

type Logo = {
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  component?: ReactNode;
};

type LogoCloudProps = React.ComponentProps<"div"> & {
  logos: Logo[];
};

export function LogoCloud({ className, logos, ...props }: LogoCloudProps) {
  return (
    <div
      {...props}
      className={cn(
        "overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,black,transparent)]",
        className
      )}
    >
      <InfiniteSlider gap={42} reverse duration={80} durationOnHover={25}>
        {logos.map((logo, index) => (
          logo.component ? (
            <div
              key={`logo-${logo.alt}-${index}`}
              className="pointer-events-none h-4 select-none md:h-5 flex items-center justify-center [&>svg]:h-full [&>svg]:w-auto [&>svg]:text-foreground"
            >
              {logo.component}
            </div>
          ) : (
            <img
              alt={logo.alt}
              className="pointer-events-none h-4 select-none md:h-5 dark:brightness-0 dark:invert"
              height={logo.height || "auto"}
              key={`logo-${logo.alt}-${index}`}
              loading="lazy"
              src={logo.src}
              width={logo.width || "auto"}
            />
          )
        ))}
      </InfiniteSlider>
    </div>
  );
}
