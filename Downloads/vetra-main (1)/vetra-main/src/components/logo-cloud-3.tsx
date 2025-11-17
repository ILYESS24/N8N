import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { cn } from "@/lib/index";

type Logo = {
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  component?: React.ReactNode;
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
      <InfiniteSlider gap={64} reverse duration={80} durationOnHover={25}>
        {logos.map((logo) => (
          logo.component ? (
            <div key={`logo-${logo.alt}`} className="pointer-events-none select-none">
              {logo.component}
            </div>
          ) : (
            <div key={`logo-${logo.alt}`} className="flex items-center justify-center px-6">
              <img
                alt={logo.alt}
                className="pointer-events-none h-16 select-none md:h-20 w-auto object-contain filter brightness-0 opacity-70 hover:opacity-100 transition-opacity"
                height={logo.height || 80}
                loading="lazy"
                src={logo.src}
                width={logo.width || "auto"}
                style={{ filter: 'brightness(0) saturate(100%)' }}
              />
            </div>
          )
        ))}
      </InfiniteSlider>
    </div>
  );
}
