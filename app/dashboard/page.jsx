import DashboardContent from "@/components/DashboardContent";

export default function DashboardPage() {
  return (
    <main className="relative min-h-screen py-4 px-3 md:px-4">

      {/* 🔹 Background image (desktop only) */}
      <div
        className="hidden md:block fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://prgscience.com/template/frontend/assets/images/about/college-building.jpg')",
        }}
      />

      {/* 🔹 Optional dark overlay */}
      <div className="hidden md:block fixed inset-0 -z-10 bg-black/30" />

      {/* 🔹 Dashboard content */}
      <div className="relative z-10">
        <DashboardContent />
      </div>

    </main>
  );
}
