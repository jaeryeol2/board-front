import { LoadingProvider } from '@/contexts/GlobalContext';
import { ChildrenType } from '@/types/base';

export default function SectionLoading({
  loading,
  children,
}: Readonly<{ loading: boolean } & ChildrenType>) {
  return (
    <LoadingProvider loading={loading}>
      <div className="relative">
        {children}
        {loading && (
          <div className="absolute z-10 inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-500 border-t-transparent"></div>
          </div>
        )}
      </div>
    </LoadingProvider>
  );
}
