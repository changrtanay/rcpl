import { useNavigate } from "react-router-dom";

const Pagination = ({ currentPage, totalPages }) => {
  const navigate = useNavigate();

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage); // Update page in URL
    navigate(`?${params.toString()}`); // Push new URL to history
  };

  return (
    <div className="flex gap-2 justify-center mt-4">
      <button
        disabled={currentPage <= 1}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        Previous
      </button>
      <button
        disabled={currentPage >= totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
