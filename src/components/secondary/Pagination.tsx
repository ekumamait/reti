import { Button, Select } from "antd";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  return (
    <div className="flex items-center justify-between mt-4">
      <div className="flex gap-2">
        <Button
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </Button>
        <span className="flex items-center">
          {currentPage} of {totalPages}
        </span>
        <Button
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
