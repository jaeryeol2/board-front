import LoginUI from '@/app/(no-gnb)/login/_components/LoginUI';

export default function Login() {
  return (
    <main className="flex flex-col justify-center min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="w-full max-w-[400px] mx-auto bg-white p-8 md:p-10 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 tracking-tight">
            반가워요!
          </h1>
          <p className="text-gray-500 text-sm md:text-base">
            어떤 계정으로 로그인할까요?
          </p>
        </div>
        <LoginUI />
      </div>
    </main>
  );
}
