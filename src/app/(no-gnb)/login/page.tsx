import LoginUI from '@/app/(no-gnb)/login/_components/LoginUI';

export default function Login() {
  return (
    <main className="flex flex-col justify-center items-center min-h-screen px-4 py-8 md:p-8 bg-[#f5f5f7]">
      <div className="w-full max-w-[400px] mx-auto bg-white p-6 sm:p-8 md:p-10 rounded-[20px] border border-[#e0e0e0]">
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#1d1d1f] mb-2 tracking-tight">
            반가워요!
          </h1>
          <p className="text-[#7a7a7a] text-[14px] sm:text-[15px]">
            어떤 계정으로 로그인할까요?
          </p>
        </div>
        <LoginUI />
      </div>
    </main>
  );
}
