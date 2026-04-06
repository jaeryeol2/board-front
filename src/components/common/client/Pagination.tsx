'use client';

import Button from '@/components/base/Button';
import { useMemo, useState } from 'react';

type PaginationProps = {
  totalItems: number;
  itemsPerPage: number;
  page: number;
  onPageChange: (page: number) => void;
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
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });

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
      className="flex items-center justify-center space-x-1"
      aria-label="Pagination"
    >
      <Button
        className={`rounded-l-lg border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 ${
          page === 1 ? 'cursor-not-allowed opacity-50' : ''
        }`}
        onClick={handlePrevClick}
        disabled={page === 1}
      >
        이전
      </Button>
      {pageNumbers.map((number) => (
        <Button
          key={number}
          className={`border border-gray-300 px-3 py-2 leading-tight ${
            number === page
              ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700'
              : 'bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700'
          }`}
          onClick={() => handlePageChange(number)}
        >
          {number}
        </Button>
      ))}
      <Button
        className={`rounded-r-lg border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 ${
          page === totalPages ? 'cursor-not-allowed opacity-50' : ''
        }`}
        onClick={handleNextClick}
        disabled={page === totalPages}
      >
        다음
      </Button>
    </nav>
  );
}
