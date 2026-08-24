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
          <div className="absolute z-10 inset-0 flex items-center justify-center bg-white/70 backdrop-blur-xs">
            <div className="h-10 w-10 animate-spin rounded-full border-3 border-solid border-[#0066cc] border-t-transparent"></div>
          </div>
        )}
      </div>
    </LoadingProvider>
  );
}
