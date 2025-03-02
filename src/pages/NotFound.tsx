import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useMatches } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const matches = useMatches();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    console.error("  Full Location Object:", location); // Log the entire location object
    console.error("  Current Route Matches:", matches); // Log matched routes (or lack thereof)

    // Check if a base URL is set (important for GitHub Pages!)
    if (import.meta.env.BASE_URL) {
      console.error("  Base URL:", import.meta.env.BASE_URL);
    } else {
      console.warn("  Base URL is not configured. This may cause issues on deployment.");
    }

    // Log the user's referrer (where they came from, if available)
    console.error("  Referrer:", document.referrer);

    // Log the user agent (browser information)
    console.error("  User Agent:", navigator.userAgent);

    // Log stack trace
    try {
        throw new Error();
    } catch (e) {
        console.error("  Stack Trace:", e.stack);
    }



  }, [location.pathname, location, matches]); // Include all used variables in the dependency array

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;