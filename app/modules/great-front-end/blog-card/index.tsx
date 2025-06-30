import BlogCard, { BlogCardContent, BlogCardThumbnail } from "./BlogCard";

const BlogCardProject = () => {
  return (
    <section className="font-noto-sans h-screen bg-linear-to-br from-[#F9FAFB] to-[#D2D6DB] size-full flex justify-center items-center">
      <BlogCard>
        <BlogCardThumbnail
          imageUrl="/images/blog-card-image.jpg"
          alt="Blog Image"
          description="A beautiful view of a mountain landscape with a clear blue sky and lush greenery."
        />
        <BlogCardContent
          title="Top 5 Living Room Inspirations"
          tags={["Interior"]}
          description="Curated vibrants colors for your living, make it pop & calm in the same time."
          disabled={false}
          href="https://www.greatfrontend.com/projects/challenges/blog-card"
          action="Read More"
          onClick={() => {}}
        />
      </BlogCard>
    </section>
  );
};

export default BlogCardProject;
