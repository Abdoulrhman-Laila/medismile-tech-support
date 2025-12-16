import "./globals.css";
import AppLayout from "../components/AppLayout";
import ReduxProvider from "../components/ReduxProvider";

export const metadata = {
  title: "Tech Dashboard",
  description: "Support dashboard built with Next.js",
};

export default function RootLayout({ children, noSidebar }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <ReduxProvider>
          <AppLayout noSidebar={noSidebar}>{children}</AppLayout>
        </ReduxProvider>
      </body>
    </html>
  );
}
