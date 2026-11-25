// Demo from 21st.dev: Text Reveal (Default) by kuratlielia. https://21st.dev/kuratlielia/text-reveal  saved 2026-11-25
import TextReveal from "./text-reveal";

export default function TextRevealDemo() {
  return (
    <div className="flex min-h-[220px] w-full items-center justify-center bg-background p-10">
      <TextReveal
        text="Reveal a short piece of content with restrained motion."
        as="h2"
        className="text-center text-3xl font-medium tracking-tight"
      />
    </div>
  );
}
