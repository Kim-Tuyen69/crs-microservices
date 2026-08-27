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
}

export default function CourseList({
                                       courses,
                                       state,
                                       errorMessage,
                                       onRetry
                                   }: CourseListProps) {

    // =========================
    // LOADING
    // =========================
    if (state === 'loading') {
        return (
            <div className="status-box status-loading">
                Đang tải danh sách môn học...
            </div>
        );
    }

    // =========================
    // ERROR
    // =========================
    if (state === 'error') {
        return (
            <div className="status-box status-error">

                <p>
                    {errorMessage}
                </p>

                <button
                    className="retry-button"
                    onClick={onRetry}
                >
                    Thử lại
                </button>

            </div>
        );
    }

    // =========================
    // EMPTY
    // =========================
    if (state === 'empty') {
        return (
            <div className="status-box status-empty">
                Không tìm thấy môn học nào phù hợp.
            </div>
        );
    }

    // =========================
    // SUCCESS
    // =========================
    return (
        <div className="course-table-wrapper">

            <table className="course-table">

                <thead>
                <tr>

                    <th className="course-column-name">
                        Tên môn học
                    </th>

                    <th className="course-column-credit">
                        Số tín chỉ
                    </th>

                    <th className="course-column-seat">
                        Số chỗ còn lại
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

                    </tr>

                ))}

                </tbody>

            </table>

        </div>
    );
}