import LoginUI from '@/app/(no-gnb)/login/_components/LoginUI';

export default function Login() {
  return (
    <main className="flex flex-col justify-center min-h-screen p-8 bg-gray-100">
      <div className="w-full max-w-sm mx-auto">
        <h1 className="text-3xl font-bold mb-8">어떤 계정으로 로그인할까요?</h1>
        <LoginUI />
      </div>
    </main>
  );
}
