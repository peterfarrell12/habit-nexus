export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Habit Nexus</h1>
        <p className="text-xl">Demo Mode - Working!</p>
        <div className="mt-8">
          <a 
            href="/mobile" 
            className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg text-white font-medium inline-block"
          >
            Enter Mobile App
          </a>
        </div>
      </div>
    </div>
  )
}