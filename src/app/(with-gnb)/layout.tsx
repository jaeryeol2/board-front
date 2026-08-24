import WrapLayout from '@/app/WrapLayout';
import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import { ChildrenType } from '@/types/base';

export default function WithGnbLayout({ children }: Readonly<ChildrenType>) {
  return (
    <WrapLayout>
      <Header />
      <main className="container mx-auto max-w-7xl flex-grow px-4 py-6 md:py-10">
        {children}
      </main>
      <Footer />
    </WrapLayout>
  );
}
