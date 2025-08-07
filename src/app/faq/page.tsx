import Header from "@/components/Header";

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      <Header />

      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-gray-300">
              Everything you need to know about ABATTLE
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-3">
                How do I use the pixel editor?
              </h3>
              <p className="text-gray-300">
                Use your mouse to draw pixels. Left-click to draw, right-click
                and drag to move the canvas. Use the mouse wheel to zoom in and
                out for detailed work.
              </p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-3">
                What grid sizes are supported?
              </h3>
              <p className="text-gray-300">
                We support grid sizes from 32×32 to 1024×1024 pixels. Choose the
                size that best fits your project needs.
              </p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-3">
                How do I save my work?
              </h3>
              <p className="text-gray-300">
                Currently, your work is saved automatically in your browser's
                local storage. Export functionality will be available soon!
              </p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-3">
                Can I collaborate with others?
              </h3>
              <p className="text-gray-300">
                Real-time collaboration features are planned for future updates.
                Stay tuned for multiplayer functionality!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
