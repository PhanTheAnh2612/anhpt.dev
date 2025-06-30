import { useLocation } from "react-router";

export default function CatchAll() {
  const location = useLocation();

  // Handle Chrome DevTools and other well-known paths silently
  if (location.pathname.startsWith("/.well-known/")) {
    // Return empty response for these system requests
    return null;
  }

  // For other unmatched routes, show a 404 page
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <div className="mb-4">
          <div className="text-6xl font-bold text-gray-300 mb-2">404</div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Page Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The page you're looking for doesn't exist.
          </p>
        </div>

        <div className="space-y-4">
          <a
            href="/"
            className="inline-block w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Go Home
          </a>
          <p className="text-sm text-gray-500">
            Requested path:{" "}
            <code className="bg-gray-100 px-2 py-1 rounded text-xs">
              {location.pathname}
            </code>
          </p>
        </div>
      </div>
    </div>
  );
}
