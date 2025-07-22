import React, { useEffect } from "react";
import styled from "styled-components";
import type { Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";

interface PageType {
  currentPage: number;
  size: number;
  pageContentAmount: number;
}

interface PaginationProps {
  size: number;
  itemsPerPage: number;
  currentPage: number;
  pageContentAmount: number;
  setPageInfo: Dispatch<SetStateAction<PageType>>;
  pageInfo: PageType;
  selectedOption: string;
}

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

const PageButton = styled.button<{ $isdisabled?: boolean }>`
  background-color: ${({ $isdisabled }) => ($isdisabled ? "#ccc" : "#f06292")};
  color: ${({ $isdisabled }) => ($isdisabled ? "#888" : "white")};
  font-weight: 600;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  margin: 0 5px;
  cursor: ${({ $isdisabled }) => ($isdisabled ? "not-allowed" : "pointer")};
  &:hover {
    background-color: ${({ $isdisabled }) =>
      $isdisabled ? "#ccc" : "#e04a78"};
  }
`;

const PageNumber = styled.span`
  font-size: 16px;
  font-weight: bold;
  margin: 0 5px;
`;

const Ellipsis = styled.span`
  margin: 0 5px;
  font-weight: bold;
`;

const Pagination: React.FC<PaginationProps> = ({
  pageContentAmount,
  setPageInfo,
  pageInfo,
  selectedOption,
}) => {
  const maxVisible = 5;

  const handlePrevious = () => {
    if (pageInfo.currentPage > 0) {
      setPageInfo({
        ...pageInfo,
        currentPage: pageInfo.currentPage - 1,
      });
    }
  };

  const handleNext = () => {
    if (pageInfo.currentPage < pageContentAmount - 1) {
      setPageInfo({
        ...pageInfo,
        currentPage: pageInfo.currentPage + 1,
      });
    }
  };

  const handlePageClick = (page: number) => {
    if (page !== pageInfo.currentPage) {
      setPageInfo({
        ...pageInfo,
        currentPage: page,
      });
    }
  };

  useEffect(() => {
    setPageInfo({
      ...pageInfo,
      currentPage: 0,
    });
  }, []);

  const renderPageButtons = () => {
    const totalPages = pageContentAmount;
    const currentPage = pageInfo.currentPage;
    const buttons = [];

    if (totalPages <= maxVisible) {
      for (let i = 0; i < totalPages; i++) {
        buttons.push(
          <PageButton
            key={i}
            onClick={() => handlePageClick(i)}
            $isdisabled={i === currentPage}
          >
            {i + 1}
          </PageButton>
        );
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 0; i < 5; i++) {
          buttons.push(
            <PageButton
              key={i}
              onClick={() => handlePageClick(i)}
              $isdisabled={i === currentPage}
            >
              {i + 1}
            </PageButton>
          );
        }
        buttons.push(<Ellipsis key="ellipsis">...</Ellipsis>);
        buttons.push(
          <PageButton
            key={totalPages - 1}
            onClick={() => handlePageClick(totalPages - 1)}
            $isdisabled={currentPage === totalPages - 1}
          >
            {totalPages}
          </PageButton>
        );
      } else {
        buttons.push(
          <PageButton
            key={0}
            onClick={() => handlePageClick(0)}
            $isdisabled={currentPage === 0}
          >
            1
          </PageButton>
        );
        buttons.push(<Ellipsis key="start-ellipsis">...</Ellipsis>);

        const start = Math.max(1, currentPage - 2);
        const end = Math.min(currentPage, totalPages - 2);

        for (let i = start; i <= end; i++) {
          buttons.push(
            <PageButton
              key={i}
              onClick={() => handlePageClick(i)}
              $isdisabled={i === currentPage}
            >
              {i + 1}
            </PageButton>
          );
        }

        if (currentPage < totalPages - 2) {
          buttons.push(<Ellipsis key="end-ellipsis">...</Ellipsis>);
        }

        buttons.push(
          <PageButton
            key={totalPages - 1}
            onClick={() => handlePageClick(totalPages - 1)}
            $isdisabled={currentPage === totalPages - 1}
          >
            {totalPages}
          </PageButton>
        );
      }
    }

    return buttons;
  };
  const MotionPaginationContainer = motion(PaginationContainer);
  return (
    <MotionPaginationContainer
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.3, type: "spring", bounce: 0.15 }}
    >
      <PageButton
        onClick={handlePrevious}
        $isdisabled={pageInfo.currentPage === 0}
      >
        이전
      </PageButton>

      {renderPageButtons()}

      <PageButton
        onClick={handleNext}
        $isdisabled={pageInfo.currentPage === pageContentAmount - 1}
      >
        다음
      </PageButton>
    </MotionPaginationContainer>
  );
};

export default Pagination;
