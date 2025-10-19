import type { ExpandableCardItem } from "@/components/ui/expandable-card-demo-grid";

const lipsum = (text: string) =>
  text.replace(/\s+/g, " ").trim();

export const playerCards: ExpandableCardItem[] = [
  {
    description: "Creative midfielder with quick vision",
    title: "Behrat",
    src: "/assets/images/spieler-avatars/avatars-256/behrat.webp",
    ctaText: "View profile",
    ctaLink: "#",
    content: lipsum(
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vestibulum facilisis sem, nec tristique tortor lacinia et. Vestibulum a orci in sapien aliquet blandit a id dui. Aliquam posuere mauris eu leo facilisis, non bibendum diam ultrices."
    ),
  },
  {
    description: "Clinical finisher in tight spaces",
    title: "Bent",
    src: "/assets/images/spieler-avatars/avatars-256/bent.webp",
    ctaText: "View profile",
    ctaLink: "#",
    content: lipsum(
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam imperdiet, sapien eu dictum porttitor, tellus neque vulputate turpis, a luctus sapien urna a tortor. Donec vitae fringilla sem, a volutpat elit."
    ),
  },
  {
    description: "Defensive anchor with calm distribution",
    title: "Eray",
    src: "/assets/images/spieler-avatars/avatars-256/eray.webp",
    ctaText: "View profile",
    ctaLink: "#",
    content: lipsum(
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean in blandit nisi. Praesent lacinia mollis felis, non dictum dui finibus id. Nulla facilisi. Pellentesque accumsan purus et arcu iaculis dapibus."
    ),
  },
  {
    description: "Versatile winger with relentless pace",
    title: "Finley",
    src: "/assets/images/spieler-avatars/avatars-256/finley.webp",
    ctaText: "View profile",
    ctaLink: "#",
    content: lipsum(
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae laoreet enim. In quis vulputate ipsum. Curabitur at suscipit enim, a ornare purus. Suspendisse sed consequat nisl."
    ),
  },
  {
    description: "Dependable goalkeeper and team leader",
    title: "Jakob",
    src: "/assets/images/spieler-avatars/avatars-256/jakob.webp",
    ctaText: "View profile",
    ctaLink: "#",
    content: lipsum(
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ac tellus id sem elementum molestie vel sit amet risus. Duis non dictum ipsum. Sed a libero viverra, lacinia mi at, tincidunt massa."
    ),
  },
];
