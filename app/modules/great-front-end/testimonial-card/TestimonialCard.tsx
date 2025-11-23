import React from "react";
import { twMerge } from "tailwind-merge";

interface TestimonialCardProps extends React.HTMLAttributes<HTMLElement> {}

interface TestimonialCardThumbnailProps
  extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl: string;
  alt: string;
  name: string;
  username: string;
}

export const TestimonialCardThumbnail = ({
  className,
  imageUrl,
  alt,
  name,
  username,
  ...props
}: TestimonialCardThumbnailProps) => {
  return (
    <div
      className={twMerge(
        "w-full h-fit bg-transparent rounded-none shadow-none p-0 flex items-center gap-4",
        className
      )}
      {...props}
    >
      <figure className="rounded-full overflow-hidden w-12 aspect-square">
        <img src={imageUrl} alt={alt} className="size-full object-contain" />
      </figure>
      <div className="flex flex-col gap-2">
        <div className="text-lg font-semibold text-[#171717]">{name}</div>
        <div className="text-sm text-[#525252]">{username}</div>
      </div>
    </div>
  );
};

export const TestimonialCardContent = ({
  className,
  children,
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={twMerge("text-base text-[#525252]", className)}>
      {children}
    </div>
  );
};

export const TestimonialCard = ({
  className,
  ...props
}: TestimonialCardProps) => {
  return (
    <article
      className={twMerge(
        "w-full h-fit bg-white max-w-[340px] rounded-lg shadow-md p-6 flex flex-col gap-4 mx-auto",
        className
      )}
      {...props}
    />
  );
};
