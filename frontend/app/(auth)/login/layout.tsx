import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Login Page",
  description: "Login to access your account",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
        {children}
      </div>
  
  );
}
