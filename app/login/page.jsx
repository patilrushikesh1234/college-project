import Link from "next/link";
export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md mx-auto text-center p-8 rounded-2xl bg-white/20 backdrop-blur-xl shadow-xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">PRG Science College Dhule</h1>
        <p className="text-gray-700 mb-6">Take Smart Attendance</p>
        <Link href="/dashboard" className="inline-block w-full max-w-[280px] py-3.5 px-4 rounded-xl bg-[#4a90e2] hover:bg-[#3579c7] text-white font-semibold text-base transition-colors">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
