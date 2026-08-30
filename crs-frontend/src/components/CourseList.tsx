import type { Course } from '../types/course';
import type { LoadState } from '../api/useCourses';

interface CourseListProps {
    courses: Course[];
    state: LoadState;
    errorMessage: string;
    onRetry: () => void;

    onEdit?: (course: Course) => void;
    onDelete?: (course: Course) => void;

    onRegister?: (course: Course) => void;
    registeringId?: number | null;
}

export default function CourseList({
                                       courses,
                                       state,
                                       errorMessage,
                                       onRetry,
                                       onEdit,
                                       onDelete,
                                       onRegister,
                                       registeringId,
                                   }: CourseListProps) {
    if (state === 'loading') {
        return (
            <div className="load-state">
                <p>
                    Đang tải danh sách môn học...
                </p>
            </div>
        );
    }

    if (state === 'error') {
        return (
            <div className="load-state error-state">
                <p>{errorMessage}</p>

                <button
                    type="button"
                    onClick={onRetry}
                    className="retry-button"
                >
                    Thử lại
                </button>
            </div>
        );
    }

    if (state === 'empty') {
        return (
            <div className="load-state">
                <p>
                    Không tìm thấy môn học nào
                    phù hợp.
                </p>
            </div>
        );
    }

    const showActions =
        !!onEdit ||
        !!onDelete ||
        !!onRegister;

    return (
        <div className="course-table-wrapper">
            <table
                className={`course-table ${
                    showActions
                        ? 'has-actions'
                        : 'public-table'
                }`}
            >
                <thead>
                <tr>
                    <th>
                        Tên môn học
                    </th>

                    <th>
                        Số tín chỉ
                    </th>

                    <th>
                        Số chỗ còn lại
                    </th>

                    {showActions && (
                        <th>
                            Thao tác
                        </th>
                    )}
                </tr>
                </thead>

                <tbody>
                {courses.map(
                    (course) => {
                        const isFull =
                            course.soChoConLai === 0;

                        const isRegistering =
                            registeringId ===
                            course.id;

                        return (
                            <tr
                                key={
                                    course.id
                                }
                            >
                                <td>
                                    <strong>
                                        {
                                            course.tenMonHoc
                                        }
                                    </strong>
                                </td>

                                <td>
                                    {
                                        course.soTinChi
                                    }
                                </td>

                                <td
                                    className={
                                        isFull
                                            ? 'course-full'
                                            : ''
                                    }
                                >
                                    {
                                        course.soChoConLai
                                    }
                                    {' / '}
                                    {
                                        course.soChoToiDa
                                    }
                                </td>

                                {showActions && (
                                    <td>
                                        <div className="action-buttons">
                                            {onEdit && (
                                                <button
                                                    type="button"
                                                    className="edit-button"
                                                    onClick={() =>
                                                        onEdit(
                                                            course
                                                        )
                                                    }
                                                >
                                                    Sửa
                                                </button>
                                            )}

                                            {onDelete && (
                                                <button
                                                    type="button"
                                                    className="delete-button"
                                                    onClick={() =>
                                                        onDelete(
                                                            course
                                                        )
                                                    }
                                                >
                                                    Xóa
                                                </button>
                                            )}

                                            {onRegister && (
                                                <button
                                                    type="button"
                                                    className="register-button"
                                                    disabled={
                                                        isFull ||
                                                        isRegistering
                                                    }
                                                    onClick={() =>
                                                        onRegister(
                                                            course
                                                        )
                                                    }
                                                >
                                                    {isRegistering
                                                        ? 'Đang đăng ký...'
                                                        : isFull
                                                            ? 'Hết chỗ'
                                                            : 'Đăng ký'}
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        );
                    }
                )}
                </tbody>
            </table>
        </div>
    );
}