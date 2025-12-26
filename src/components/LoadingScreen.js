export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#f0f0f0] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="absolute inset-0 bg-[#2E7D32]/20 rounded-full animate-ping"></div>
          <img
            src="/profile.ico"
            alt="DormPay Logo"
            width={80}
            height={80}
            className="relative z-10 animate-pulse"
          />
        </div>
        <p className="text-lg font-semibold text-[#12372A] animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
}