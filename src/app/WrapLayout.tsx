import { ChildrenType } from '@/types/base';

export default function WrapLayout({ children }: Readonly<ChildrenType>) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f5f5f7]">
      {children}
    </div>
  );
}
