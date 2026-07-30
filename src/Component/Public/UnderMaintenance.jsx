export default function UnderMaintenance() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-950 px-6">
      <div className="max-w-xl w-full text-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 shadow-2xl">

        {/* Animated Icon */}
        <div className="relative mx-auto w-24 h-24 mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-400/30"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-400 animate-spin"></div>

          <div className="absolute inset-4 flex items-center justify-center bg-indigo-500 rounded-full">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.325 4.317a1 1 0 011.35-.936l7.5 3.75a1 1 0 010 1.738l-7.5 3.75a1 1 0 01-1.35-.936V4.317z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-white mb-4">
          Under Maintenance
        </h1>

        <p className="text-slate-300 text-lg leading-relaxed mb-8">
          We're currently performing scheduled maintenance to improve your
          experience. Our team is working hard to bring everything back online
          as soon as possible.
        </p>

        <div className="flex justify-center mb-8">
          <div className="flex space-x-2">
            <span className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce"></span>
            <span
              className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.15s" }}
            ></span>
            <span
              className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.3s" }}
            ></span>
          </div>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition duration-300 shadow-lg"
        >
          Refresh Page
        </button>

        <p className="mt-6 text-sm text-slate-400">
          Thank you for your patience.
        </p>
      </div>
    </div>
  );
}