import { AuthProvider } from "../context/AuthContext";
import "../styles/globals.css"; // only if you already have global css

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;

