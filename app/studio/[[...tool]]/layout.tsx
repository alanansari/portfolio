// Studio needs its own layout to avoid inheriting the portfolio shell.
// Metadata stays on the server layout because the studio page is a client component.
export const metadata = { title: "Studio — Alan Ansari Portfolio" };

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
