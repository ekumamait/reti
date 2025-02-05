import { Button } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

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
  onPageChange,
}) => {
  return (
    <div className="flex items-center justify-between mt-4">
      <div className="flex gap-2">
        <Button
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          icon={<LeftOutlined />}
          aria-label="Previous page"
        />
        <span className="flex items-center">
          {currentPage} of {totalPages}
        </span>
        <Button
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          icon={<RightOutlined />}
          aria-label="Next page"
        />
      </div>
    </div>
  );
};

export default Pagination;
