'use client';

import Button from '@/components/base/Button';
import { useMemo, useState } from 'react';

type PaginationProps = {
  totalItems: number;
  itemsPerPage: number;
  page: number;
  onPageChange: (page: number) => void;
  onFocusArea?: () => void;
};

/**
 * Pagination 공통 컴포넌트
 * @param totalItems 전체 아이템 개수
 * @param itemsPerPage 페이지당 아이템 개수
 * @param page 현재 페이지
 * @param onPageChange 페이지 변경 이벤트 핸들러
 */
export default function Pagination({
  totalItems,
  itemsPerPage,
  page,
  onPageChange,
  onFocusArea,
}: Readonly<PaginationProps>) {
  const [currentPage, setCurrentPage] = useState(page);
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const visiblePages = 5; // TUI Pagination과 동일하게 5개 페이지 번호 표시
  const startPage = useMemo(() => {
    const half = Math.floor(visiblePages / 2);
    let start = page - half;
    if (start < 1) {
      start = 1;
    }
    if (start + visiblePages - 1 > totalPages) {
      start = totalPages - visiblePages + 1;
      if (start < 1) {
        // totalPages가 visiblePages보다 작을 경우
        start = 1;
      }
    }
    return start;
  }, [page, totalPages, visiblePages]);

  const endPage = useMemo(() => {
    const end = startPage + visiblePages - 1;
    return Math.min(totalPages, end);
  }, [startPage, totalPages, visiblePages]);

  const pageNumbers = useMemo(() => {
    const numbers: number[] = [];
    for (let i = startPage; i <= endPage; i++) {
      numbers.push(i);
    }
    return numbers;
  }, [startPage, endPage]);

  const handlePrevClick = (): void => {
    if (page > 1) {
      onPageChange(page - 1);
    }
  };

  const handleNextClick = (): void => {
    if (page < totalPages) {
      onPageChange(page + 1);
    }
  };
  const handlePageChange = (page: number) => {
    if (currentPage === page) {
      if (onFocusArea) {
        onFocusArea();
      } else {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }

      return;
    }

    setCurrentPage(page);
    onPageChange(page);
  };

  if (currentPage !== page) {
    setCurrentPage(page);
  }

  return (
    <nav
      className="flex items-center justify-center gap-1 sm:gap-1.5"
      aria-label="Pagination"
    >
      <Button
        className={`h-8 sm:h-9 rounded-full border border-[#e0e0e0] bg-white px-2.5 sm:px-3.5 text-xs sm:text-[13px] font-medium text-[#1d1d1f] hover:bg-[#fafafc] transition-all shadow-none ${
          page === 1 ? 'cursor-not-allowed opacity-40' : ''
        }`}
        onClick={handlePrevClick}
        disabled={page === 1}
      >
        이전
      </Button>
      {pageNumbers.map((number) => (
        <Button
          key={number}
          className={`h-8 sm:h-9 min-w-[28px] sm:min-w-[34px] px-1.5 sm:px-2.5 text-xs sm:text-[13px] font-medium transition-all shadow-none ${
            number === page
              ? 'rounded-full bg-[#0066cc] text-white hover:bg-[#0071e3]'
              : 'rounded-full border border-[#e0e0e0] bg-white text-[#1d1d1f] hover:bg-[#fafafc]'
          }`}
          onClick={() => handlePageChange(number)}
        >
          {number}
        </Button>
      ))}
      <Button
        className={`h-8 sm:h-9 rounded-full border border-[#e0e0e0] bg-white px-2.5 sm:px-3.5 text-xs sm:text-[13px] font-medium text-[#1d1d1f] hover:bg-[#fafafc] transition-all shadow-none ${
          page === totalPages ? 'cursor-not-allowed opacity-40' : ''
        }`}
        onClick={handleNextClick}
        disabled={page === totalPages}
      >
        다음
      </Button>
    </nav>
  );
}
