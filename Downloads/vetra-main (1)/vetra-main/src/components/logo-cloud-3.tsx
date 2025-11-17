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
            <div key={`logo-${logo.alt}`} className="flex items-center justify-center px-4 min-w-[120px]">
              {logo.src ? (
                <img
                  alt={logo.alt}
                  className="pointer-events-none h-8 select-none md:h-10 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
                  height={logo.height || 40}
                  loading="lazy"
                  src={logo.src}
                  width={logo.width || "auto"}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `<span class="text-gray-400 text-sm font-medium">${logo.alt}</span>`;
                    }
                  }}
                />
              ) : (
                <span className="text-gray-400 text-sm font-medium">{logo.alt}</span>
              )}
            </div>
          )
        ))}
      </InfiniteSlider>
    </div>
  );
}
