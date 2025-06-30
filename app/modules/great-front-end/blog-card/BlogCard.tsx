import { Link } from "react-router";
import { twMerge } from "tailwind-merge";

interface BlogCardProps extends React.HTMLAttributes<HTMLDivElement> {}

interface BlogCardThumbnailProps extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl?: string;
  alt?: string;
  description?: string;
  showCaption?: boolean;
}

interface BlogCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  action?: string;
  title: string;
  tags: string[];
  description: string;
  disabled?: boolean;
  href?: string;
  onClick?: () => void;
}

const Tag = ({ tag }: { tag: string }) => (
  <span className="px-2 py-0.5 rounded-full min-w-16 text-green-700 bg-green-50 border border-green-200 text-sm font-normal">
    {tag}
  </span>
);

const Action = ({
  action = "Read More",
  href = "#",
  onClick = () => {},
  disabled = false,
}: {
  action?: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
}) => {
  if (disabled) {
    return (
      <span className="inline-flex w-fit items-center gap-1.5 px-1 transition-all ease-linear rounded-md text-base font-medium cursor-not-allowed text-gray-500">
        <span>{action}</span>
        <span>&rarr;</span>
      </span>
    );
  }

  return (
    <Link
      className="inline-flex w-fit items-center gap-1.5 text-indigo-700 outline-2 outline-transparent px-1 transition-all ease-linear rounded-md text-base font-medium cursor-pointer hover:outline-indigo-200 hover:font-semibold focus:outline"
      to={href}
      onClick={onClick}
    >
      <span>{action}</span>
      <span>&rarr;</span>
    </Link>
  );
};

export const BlogCardThumbnail = ({
  imageUrl = "assets/spacejoy-YqFz7UMm8qE-unsplash.jpg",
  alt = "Blog Image",
  description = "A beautiful view of a mountain landscape with a clear blue sky and lush greenery.",
  showCaption = false,
  className = "",
  ...props
}: BlogCardThumbnailProps) => (
  <figure
    className={twMerge("w-full h-72 bg-gray pointer-events-none", className)}
    {...props}
  >
    <img
      src={imageUrl}
      alt={alt}
      className="w-full h-full object-cover"
      loading="lazy"
    />
    <figcaption
      className={twMerge("sr-only", showCaption ? "block" : "hidden")}
    >
      {description}
    </figcaption>
  </figure>
);

export const BlogCardContent = ({
  title,
  tags,
  description,
  disabled = false,
  href = "#",
  onClick = () => {},
  className = "",
  action = "Read More",
  ...props
}: BlogCardContentProps) => (
  <div className={twMerge("px-4 py-6", className)} {...props}>
    <div className="flex flex-col gap-2 mb-3">
      <div className="flex items-center gap-2">
        {tags.map((tag) => (
          <Tag key={tag} tag={tag} />
        ))}
      </div>
      <h3 className="text-lg font-semibold text-neutral-900 line-clamp-1">
        {title}
      </h3>
    </div>
    <div className="flex flex-col gap-6">
      <p className="text-neutral-600 text-base font-medium line-clamp-2">
        {description}
      </p>
      <div>
        <Action
          action={action}
          href={href}
          onClick={onClick}
          disabled={disabled}
        />
      </div>
    </div>
  </div>
);

const BlogCard = ({ className = "", ...props }: BlogCardProps) => {
  return (
    <article
      {...props}
      className={twMerge(
        "w-[340px] h-[504px] bg-white rounded-lg shadow-md overflow-hidden min-w-[340px]",
        className
      )}
    />
  );
};

export default BlogCard;
