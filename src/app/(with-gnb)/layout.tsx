import WrapLayout from '@/app/WrapLayout';
import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import { ChildrenType } from '@/types/base';

export default function WithGnbLayout({ children }: Readonly<ChildrenType>) {
  return (
    <WrapLayout>
      <Header />
      {children}
      <Footer />
    </WrapLayout>
  );
}
