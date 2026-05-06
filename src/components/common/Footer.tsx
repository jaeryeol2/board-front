import { appFetch } from '@/utils/appFetch';
import AppLink from '../base/AppLink';
import { TraficUser } from './client/TraficUser';

// 1. 링크 데이터 상수화
const FOOTER_LINKS = {
  service: [
    { label: '홈', href: '/' },
    { label: '공지사항', href: '/notice' },
    { label: '마이페이지', href: '/mypage' },
  ],
  policy: [
    { label: '이용약관', href: '/terms' },
    { label: '개인정보처리방침', href: '/privacy', highlight: true },
  ],
};

const SOCIAL_ICONS = [
  {
    name: 'Facebook',
    href: '#',
    path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  },
  {
    name: 'Instagram',
    href: '#',
    path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
  },
];

// 2. 내부 보조 컴포넌트
const FooterSection = ({
  title,
  children,
  className = '',
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={className}>
    <h4 className="text-[15px] font-bold text-[#333d4b] mb-5">{title}</h4>
    {children}
  </div>
);

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  const { data } = await appFetch<number>('/api/user/user-count');

  return (
    <footer className="bg-[#f9fafb] border-t border-[#f2f4f6] pt-16 pb-12">
      <div className="max-w-screen-xl mx-auto px-6 md:px-10">
        {/* Top Section: Links and Brand */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1">
            <h3 className="text-xl font-extrabold text-[#333d4b] mb-6 tracking-tight">
              The Lounge.
            </h3>
            <p className="text-sm text-[#6b7684] leading-relaxed break-keep">
              가장 쉽고 편리한 소통의 시작,
              <br />
              새로운 게시판 문화를 만들어갑니다.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 col-span-1 md:col-span-3 gap-8">
            <FooterSection title="서비스">
              <ul className="space-y-4">
                {FOOTER_LINKS.service.map((link) => (
                  <li key={link.href}>
                    <AppLink
                      href={link.href}
                      className="text-[14px] text-[#6b7684] hover:text-[#333d4b] transition-colors"
                    >
                      {link.label}
                    </AppLink>
                  </li>
                ))}
              </ul>
            </FooterSection>

            <FooterSection title="약관 및 정책">
              <ul className="space-y-4">
                {FOOTER_LINKS.policy.map((link) => (
                  <li key={link.href}>
                    <AppLink
                      href={link.href}
                      className={`text-[14px] ${link.highlight ? 'font-semibold text-[#4e5968]' : 'text-[#6b7684]'} hover:text-[#333d4b] transition-colors`}
                    >
                      {link.label}
                    </AppLink>
                  </li>
                ))}
              </ul>
            </FooterSection>

            <FooterSection
              title="고객센터"
              className="col-span-2 md:col-span-1"
            >
              <p className="text-[14px] text-[#6b7684] mb-1">
                평일 09:00 ~ 18:00 (주말/공휴일 휴무)
              </p>
              <p className="text-lg font-bold text-[#4e5968]">1588-0000</p>
            </FooterSection>
          </div>
        </div>

        {/* Bottom Section: Company Info & Copyright */}
        <div className="pt-8 border-t border-[#f2f4f6]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-[#8b95a1]">
                <span>(주)The Lounge.</span>
                <span className="hidden md:inline text-[#e5e8eb]">|</span>
                <span>대표 ***</span>
                <span className="hidden md:inline text-[#e5e8eb]">|</span>
                <span>사업자 등록번호 123-45-67890</span>
              </div>
              <p className="text-[12px] text-[#adb5bd]">
                서울특별시 강남구 테헤란로 123, 보드타워 15층
              </p>
            </div>

            <div className="flex items-center gap-6">
              <TraficUser userCount={data ?? 0} />
              <p className="text-[13px] font-medium text-[#8b95a1]">
                &copy; {currentYear} Board Project. All rights reserved.
              </p>
              <div className="flex gap-4">
                {SOCIAL_ICONS.map((social) => (
                  <div
                    key={social.name}
                    className="w-8 h-8 rounded-full bg-[#e5e8eb] flex items-center justify-center cursor-pointer hover:bg-[#d1d6db] transition-colors"
                  >
                    <span className="sr-only">{social.name}</span>
                    <svg
                      width="18"
                      height="18"
                      fill="#8b95a1"
                      viewBox="0 0 24 24"
                    >
                      <path d={social.path} />
                    </svg>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
