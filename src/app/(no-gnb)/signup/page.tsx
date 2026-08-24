import SignupUI from './_components/SignupUI';

export default async function SignupPage() {
  return (
    <main className="flex flex-col justify-center items-center min-h-screen px-4 py-8 md:p-8 bg-[#f5f5f7]">
      <div className="w-full max-w-[450px] mx-auto bg-white p-6 sm:p-8 md:p-10 rounded-[20px] border border-[#e0e0e0]">
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#1d1d1f] mb-2 tracking-tight">
            환영합니다!
          </h1>
          <p className="text-[#7a7a7a] text-[14px] sm:text-[15px]">
            더 라운지의 일원이 되어보세요.
          </p>
        </div>
        <SignupUI />
      </div>
    </main>
  );
}
