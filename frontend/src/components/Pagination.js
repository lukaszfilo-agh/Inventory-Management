import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPaginationRange = () => {
    const totalVisiblePages = 5; // Number of visible page numbers
    const range = [];
    const halfVisible = Math.floor(totalVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);

    if (endPage - startPage + 1 < totalVisiblePages) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, totalVisiblePages);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, totalPages - totalVisiblePages + 1);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      range.push(i);
    }

    if (startPage > 2) range.unshift("...");
    if (startPage > 1) range.unshift(1);
    if (endPage < totalPages - 1) range.push("...");
    if (endPage < totalPages) range.push(totalPages);

    return range;
  };

  return (
    <nav>
      <ul className="pagination">
        {getPaginationRange().map((page, index) =>
          page === "..." ? (
            <li key={`ellipsis-${index}-${currentPage}`} className="page-item disabled">
              <span className="page-link">...</span>
            </li>
          ) : (
            <li
              key={`page-${page}`}
              className={`page-item ${currentPage === page ? "active" : ""}`}
            >
              <button className="page-link" onClick={() => onPageChange(page)}>
                {page}
              </button>
            </li>
          )
        )}
      </ul>
    </nav>
  );
};

export default Pagination;
