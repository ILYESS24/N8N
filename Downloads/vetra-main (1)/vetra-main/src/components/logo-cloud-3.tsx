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
      <InfiniteSlider gap={48} reverse duration={80} durationOnHover={25}>
        {logos.map((logo) => (
          logo.component ? (
            <div key={`logo-${logo.alt}`} className="pointer-events-none select-none">
              {logo.component}
            </div>
          ) : (
            <div key={`logo-${logo.alt}`} className="flex items-center justify-center px-6 min-w-[120px]">
              <span className="text-gray-900 text-base md:text-lg font-medium">{logo.alt}</span>
            </div>
          )
        ))}
      </InfiniteSlider>
    </div>
  );
}
