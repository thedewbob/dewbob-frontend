import Image from "next/image";
import { ComponentAlternatingContent } from "@/lib/directus";

interface AlternatingContentBlocksProps {
  component: ComponentAlternatingContent;
}

export function AlternatingContentBlocks({ component }: AlternatingContentBlocksProps) {
  const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;

  // Extract actual blocks from the many-to-many structure and filter/sort
  const publishedBlocks = component.content_blocks
    ?.map((relation) => relation.component_alt_content_blocks_id)
    .filter((block) => block && block.status === "published")
    .sort((a, b) => a.sort - b.sort) || [];

  if (publishedBlocks.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      {/* Optional Heading */}
      {component.heading && (
        <div className="text-center mb-12">
          <h2
            className="text-4xl"
            style={{
              fontFamily: "var(--font-architects-daughter)",
              color: "#2D2D3F",
            }}
          >
            {component.heading}
          </h2>
        </div>
      )}

      {/* Alternating Content Blocks */}
      <div className="space-y-12">
        {publishedBlocks.map((block, index) => {
          // First block (index 0) = Text Left, Image Right
          // Second block (index 1) = Image Left, Text Right
          // And so on...
          const isTextLeft = index % 2 === 0;

          const imageUrl = block.image ? `${directusUrl}/assets/${block.image}` : null;
          const imageAlt = block.image_alt || "Content image";

          return (
            <div key={block.id}>
              {/* Desktop Layout - Alternating */}
              <div className="hidden md:flex items-center gap-8">
                {isTextLeft ? (
                  <>
                    {/* Text Left - 60% */}
                    <div
                      style={{
                        width: "60%",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "1em",
                        fontWeight: "400",
                        lineHeight: "1.4",
                        letterSpacing: "0.2px",
                        wordSpacing: "0.5px",
                        color: "#2D2D3F",
                      }}
                      dangerouslySetInnerHTML={{ __html: block.content || "" }}
                    />
                    {/* Image Right - 40% */}
                    {imageUrl && (
                      <div style={{ width: "40%" }}>
                        <Image
                          src={imageUrl}
                          alt={imageAlt}
                          width={444}
                          height={250}
                          className="w-full object-cover"
                          style={{
                            height: "250px",
                            borderRadius: "50%",
                            aspectRatio: "444 / 250",
                            border: "4px solid #ffffff",
                            boxShadow: "0 0 10px rgba(0,0,0,0.15)",
                          }}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {/* Image Left - 40% */}
                    {imageUrl && (
                      <div style={{ width: "40%" }}>
                        <Image
                          src={imageUrl}
                          alt={imageAlt}
                          width={444}
                          height={250}
                          className="w-full object-cover"
                          style={{
                            height: "250px",
                            borderRadius: "50%",
                            aspectRatio: "444 / 250",
                            border: "4px solid #ffffff",
                            boxShadow: "0 0 10px rgba(0,0,0,0.15)",
                          }}
                        />
                      </div>
                    )}
                    {/* Text Right - 60% */}
                    <div
                      style={{
                        width: "60%",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "1em",
                        fontWeight: "400",
                        lineHeight: "1.4",
                        letterSpacing: "0.2px",
                        wordSpacing: "0.5px",
                        color: "#2D2D3F",
                      }}
                      dangerouslySetInnerHTML={{ __html: block.content || "" }}
                    />
                  </>
                )}
              </div>

              {/* Mobile Layout - Image First, Text Second (Stacked) */}
              <div className="md:hidden">
                {/* Image */}
                {imageUrl && (
                  <div className="flex justify-center mb-6">
                    <Image
                      src={imageUrl}
                      alt={imageAlt}
                      width={300}
                      height={170}
                      className="object-cover"
                      style={{
                        height: "170px",
                        width: "300px",
                        borderRadius: "50%",
                        aspectRatio: "300 / 170",
                        border: "4px solid #ffffff",
                        boxShadow: "0 0 10px rgba(0,0,0,0.25)",
                      }}
                    />
                  </div>
                )}
                {/* Text */}
                <div
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "1em",
                    fontWeight: "400",
                    lineHeight: "1.4",
                    letterSpacing: "0.2px",
                    wordSpacing: "0.5px",
                    color: "#2D2D3F",
                  }}
                  dangerouslySetInnerHTML={{ __html: block.content || "" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
