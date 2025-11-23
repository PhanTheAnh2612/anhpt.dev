import React from "react";
import {
  TestimonialCard,
  TestimonialCardContent,
  TestimonialCardThumbnail,
} from "./TestimonialCard";

const TestimonialCardProject = () => {
  return (
    <section className="font-noto-sans pt-[200px] bg-linear-to-br from-[#F9FAFB] to-[#D2D6DB] h-screen w-full px-2">
      <TestimonialCard>
        <TestimonialCardThumbnail
          imageUrl="/images/profile-thumbnail.png"
          alt="Testimonial Card Image"
          name="Sarah Dole"
          username="@sarahdole"
        />
        <TestimonialCardContent>
          I've been searching for high-quality abstract images for my design
          projects, and I'm thrilled to have found this platform. The variety
          and depth of creativity are astounding!
        </TestimonialCardContent>
      </TestimonialCard>
    </section>
  );
};

export default TestimonialCardProject;
