import SEO from "@/components/SEO"; // Import the SEO component
import Footer from "@/components/Footer"; // Import the Footer component

export default function NotFound() {
  return (
    <>
      <SEO 
        title="404 - Page Not Found - InspireGem"
        description="The page you are looking for does not exist. Return to InspireGem's homepage."
      />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
          <p className="text-gray-600 mb-6">The page you&#39;re looking for doesn&#39;t exist.</p>
          <a
            href="/"
            className="inline-block bg-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-blue-600 transition-transform transform hover:scale-105"
          >
            Return to Home
          </a>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </>
  );
}
