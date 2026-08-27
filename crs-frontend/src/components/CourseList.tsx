import type {
    Course
} from '../types/course';

import type {
    LoadState
} from '../api/useCourses';

interface CourseListProps {
    courses: Course[];
    state: LoadState;
    errorMessage: string;
    onRetry: () => void;

    onEdit: (
        course: Course
    ) => void;

    onDelete: (
        course: Course
    ) => void;
}

export default function CourseList({
                                       courses,
                                       state,
                                       errorMessage,
                                       onRetry,
                                       onEdit,
                                       onDelete
                                   }: CourseListProps) {

    if (state === 'loading') {
        return (
            <div className="status-box status-loading">
                Đang tải danh sách môn học...
            </div>
        );
    }

    if (state === 'error') {
        return (
            <div className="status-box status-error">

                <p>{errorMessage}</p>

                <button
                    className="retry-button"
                    onClick={onRetry}
                >
                    Thử lại
                </button>

            </div>
        );
    }

    if (state === 'empty') {
        return (
            <div className="status-box status-empty">
                Không tìm thấy môn học nào phù hợp.
            </div>
        );
    }

    return (
        <div className="course-table-wrapper">

            <table className="course-table">

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

                    <th>
                        Thao tác
                    </th>

                </tr>
                </thead>

                <tbody>

                {courses.map((course) => (

                    <tr key={course.id}>

                        <td className="course-name">
                            {course.tenMonHoc}
                        </td>

                        <td className="course-credit">
                            {course.soTinChi}
                        </td>

                        <td
                            className={
                                course.soChoConLai === 0
                                    ? 'course-seat seat-full'
                                    : 'course-seat seat-normal'
                            }
                        >
                            {course.soChoConLai}
                            {' / '}
                            {course.soChoToiDa}
                        </td>

                        <td className="course-actions">

                            <button
                                className="edit-button"
                                onClick={() =>
                                    onEdit(course)
                                }
                            >
                                Sửa
                            </button>

                            <button
                                className="delete-button"
                                onClick={() =>
                                    onDelete(course)
                                }
                            >
                                Xóa
                            </button>

                        </td>

                    </tr>

                ))}

                </tbody>

            </table>

        </div>
    );
}