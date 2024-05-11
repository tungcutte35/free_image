import { Roboto } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import connectDB from "@/utils/database";
import AuthProvider from "@/provider/AuthProvider";
import Nav from "@/components/UI/NavBar/Nav";

connectDB();

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

export const metadata = {
  title: "Free Images & Pictures | Images",
  description: "Free Images & Pictures | Images",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Outlined"
          rel="stylesheet"
        />
      </head>

      <body className={roboto.className}>
        <AuthProvider>
          <Nav />

          <main>{children}</main>

          <ToastContainer position="bottom-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
