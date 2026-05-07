import SignupUI from './_components/SignupUI';

export default async function SignupPage() {
  return (
    <main className="flex flex-col justify-center min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="w-full max-w-[450px] mx-auto bg-white p-8 md:p-10 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 tracking-tight">
            환영합니다!
          </h1>
          <p className="text-gray-500 text-sm md:text-base">
            더 라운지의 일원이 되어보세요.
          </p>
        </div>
        <SignupUI />
      </div>
    </main>
  );
}
