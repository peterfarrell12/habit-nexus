export default function TestPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">🎉 Habit Nexus Test</h1>
        <p className="text-xl">Server is working!</p>
        <div className="mt-8 space-y-4">
          <a 
            href="/mobile" 
            className="block px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            📱 Mobile App
          </a>
          <a 
            href="/dashboard" 
            className="block px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
          >
            🖥️ Desktop Dashboard
          </a>
          <a 
            href="/" 
            className="block px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
          >
            🏠 Home
          </a>
        </div>
      </div>
    </div>
  )
}