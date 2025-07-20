import '../styles/globals.css';

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900 min-h-screen font-sans p-6">{children}</body>
    </html>
  );
}
