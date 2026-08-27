interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({
                                       currentPage,
                                       totalPages,
                                       onPageChange
                                   }: PaginationProps) {

    if (totalPages <= 1) {
        return null;
    }

    const pages =
        Array.from(
            { length: totalPages },
            (_, i) => i
        );

    return (
        <div className="pagination">

            <button
                disabled={currentPage === 0}
                onClick={() =>
                    onPageChange(currentPage - 1)
                }
            >
                « Trước
            </button>

            {pages.map((p) => (

                <button
                    key={p}
                    onClick={() =>
                        onPageChange(p)
                    }
                    className={
                        p === currentPage
                            ? 'active-page'
                            : ''
                    }
                >
                    {p + 1}
                </button>

            ))}

            <button
                disabled={
                    currentPage >= totalPages - 1
                }
                onClick={() =>
                    onPageChange(currentPage + 1)
                }
            >
                Sau »
            </button>

        </div>
    );
}