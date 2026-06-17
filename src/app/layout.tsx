import "./globals.css";

// The root layout is intentionally minimal — the locale-scoped layout
// (src/app/[locale]/layout.tsx) renders <html> and <body> with the
// correct lang/dir and font variables for the active locale.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
