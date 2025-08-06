import Header from "@/components/Header";

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      <Header />

      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Leaderboard</h1>
            <p className="text-gray-300">
              Top pixel artists and their creations
            </p>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
            <div className="space-y-4">
              {/* Placeholder for leaderboard content */}
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🏆</div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Coming Soon
                </h2>
                <p className="text-gray-400">
                  Leaderboard functionality will be available soon!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
