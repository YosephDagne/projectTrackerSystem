"use client";

import React from "react";

interface PaginationFooterProps {
  currentPage: number;
  rowsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
}

const PaginationFooter: React.FC<PaginationFooterProps> = ({
  currentPage,
  rowsPerPage,
  totalItems,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  const getDisplayedPages = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [];
    if (currentPage <= 3) {
      pages.push(1, 2, 3, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", currentPage, "...", totalPages);
    }

    return pages;
  };

  const displayedPages = getDisplayedPages();

  return (
    <div className="mt-6 flex flex-col gap-4 md:flex-row items-center justify-between text-sm select-none">
      {/* Rows Selector */}
      <div className="flex items-center space-x-2">
        <label
          htmlFor="rowsPerPage"
          className="text-gray-700 dark:text-gray-300 font-medium"
        >
          Rows per page:
        </label>
        <select
          id="rowsPerPage"
          value={rowsPerPage}
          onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
          className="px-3 py-1 border rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-black"
        >
          {[6, 10, 20, 50, 100].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-wrap justify-center items-center gap-1">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-green-100 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black"
        >
          Previous
        </button>

        {displayedPages.map((page, index) =>
          typeof page === "number" ? (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded-md border transition-colors duration-200 ${
                page === currentPage
                  ? "bg-black text-white border-black"
                  : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-green-100 dark:hover:text-white"
              } focus:outline-none focus:ring-2`}
            >
              {page}
            </button>
          ) : (
            <span
              key={`ellipsis-${index}`}
              className="px-2 py-1 text-gray-500 dark:text-gray-400"
            >
              ...
            </span>
          )
        )}

        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => onPageChange(currentPage + 1)}
          className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PaginationFooter;


