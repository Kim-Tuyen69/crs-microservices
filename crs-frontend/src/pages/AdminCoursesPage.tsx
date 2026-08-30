import { useState } from 'react';
import axios from 'axios';

import {
    useCourses
} from '../api/useCourses';

import {
    createCourse,
    updateCourse,
    deleteCourse
} from '../api/courseApi';

import SearchBox
    from '../components/SearchBox';

import CourseList
    from '../components/CourseList';

import Pagination
    from '../components/Pagination';

import CourseForm
    from '../components/CourseForm';

import type {
    Course,
    CourseFormValues
} from '../types/course';

import type {
    ApiErrorResponse
} from '../types/apiError';

export default function AdminCoursesPage() {

    const [keyword, setKeyword] =
        useState('');

    const [page, setPage] =
        useState(0);

    const [
        editingCourse,
        setEditingCourse
    ] = useState<Course | null>(null);

    const [
        submitting,
        setSubmitting
    ] = useState(false);

    const [
        formError,
        setFormError
    ] = useState<string | null>(null);

    const {
        courses,
        totalPages,
        state,
        errorMessage,
        refetch
    } = useCourses(
        keyword,
        page
    );

    const handleSearch = (
        newKeyword: string
    ) => {

        setKeyword(newKeyword);

        setPage(0);
    };

    const extractErrorMessage = (
        err: unknown
    ): string => {

        if (
            axios.isAxiosError<ApiErrorResponse>(err)
        ) {

            const data =
                err.response?.data;

            if (data?.message) {
                return data.message;
            }

            if (data) {

                const firstFieldError =
                    Object.values(data)
                        .find(
                            value =>
                                typeof value === 'string'
                        );

                if (firstFieldError) {
                    return firstFieldError;
                }
            }

        }

        return 'Đã xảy ra lỗi, vui lòng thử lại.';
    };

    const handleFormSubmit =
        async (
            values: CourseFormValues
        ) => {

            setSubmitting(true);

            setFormError(null);

            try {

                if (editingCourse) {

                    await updateCourse(
                        editingCourse.id,
                        values
                    );

                } else {

                    await createCourse(values);
                }

                setEditingCourse(null);

                refetch();

            } catch (err) {

                setFormError(
                    extractErrorMessage(err)
                );

            } finally {

                setSubmitting(false);
            }
        };

    const handleDelete =
        async (
            course: Course
        ) => {

            const confirmed =
                window.confirm(
                    `Bạn có chắc muốn xóa môn học "${course.tenMonHoc}" không?`
                );

            if (!confirmed) {
                return;
            }

            try {

                await deleteCourse(
                    course.id
                );

                refetch();

            } catch (err) {

                alert(
                    extractErrorMessage(err)
                );
            }
        };

    return (

        <div className="course-page">

            <div className="course-container">

                <div className="course-header">

                    <h1 className="course-title">
                        Quản lý môn học
                    </h1>

                    <p className="course-subtitle">
                        Chức năng dành cho quản trị viên
                    </p>

                </div>

                <CourseForm
                    editingCourse={editingCourse}
                    onSubmit={handleFormSubmit}

                    onCancel={() => {
                        setEditingCourse(null);
                        setFormError(null);
                    }}

                    submitting={submitting}
                    serverError={formError}
                />

                <SearchBox
                    onSearch={handleSearch}
                />

                <CourseList
                    courses={courses}
                    state={state}
                    errorMessage={errorMessage}
                    onRetry={refetch}

                    onEdit={(course) => {
                        setEditingCourse(course);

                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        });
                    }}

                    onDelete={handleDelete}
                />

                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />

            </div>

        </div>
    );
}