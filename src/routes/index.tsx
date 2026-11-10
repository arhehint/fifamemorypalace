import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "World Cup Museum" },
      { name: "description", content: "Explore World Cup squads and player portraits in an interactive 3D hall." },
      { property: "og:title", content: "World Cup Museum" },
      { property: "og:description", content: "Explore World Cup squads and player portraits in an interactive 3D hall." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <iframe
      src="/world-cup.html"
      title="World Cup Museum"
      className="fixed inset-0 h-screen w-screen border-0"
    />
  );
}
