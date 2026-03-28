import SignupUI from './_components/SignupUI';

export default async function SignupPage() {
  return (
    <main className="flex flex-col justify-center min-h-screen p-8 bg-gray-100">
      <div className="w-full max-w-sm mx-auto">
        <h1 className="text-3xl font-bold mb-8">회원가입</h1>
        <SignupUI />
      </div>
    </main>
  );
}
