import { useState } from 'react';

import axios from 'axios';

import {
    useCourses
} from './api/useCourses';

import {
    createCourse,
    updateCourse,
    deleteCourse
} from './api/courseApi';

import SearchBox
    from './components/SearchBox';

import CourseList
    from './components/CourseList';

import Pagination
    from './components/Pagination';

import CourseForm
    from './components/CourseForm';

import type {
    Course,
    CourseFormValues
} from './types/course';

import type {
    ApiErrorResponse
} from './types/apiError';

import './styles/course.css';

function App() {

    const [keyword, setKeyword] =
        useState('');

    const [page, setPage] =
        useState(0);

    const [
        editingCourse,
        setEditingCourse
    ] =
        useState<Course | null>(null);

    const [
        submitting,
        setSubmitting
    ] =
        useState(false);

    const [
        formError,
        setFormError
    ] =
        useState<string | null>(null);

    const {
        courses,
        totalPages,
        state,
        errorMessage,
        refetch
    } =
        useCourses(
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
            axios.isAxiosError<
                ApiErrorResponse
            >(err)
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
                            (value) =>
                                typeof value === 'string'
                        );

                if (firstFieldError) {
                    return firstFieldError;
                }
            }

            if (
                err.response?.status === 401 ||
                err.response?.status === 403
            ) {

                return (
                    'Bạn không có quyền thực hiện thao tác này. '
                    + 'Kiểm tra lại token ADMIN.'
                );
            }
        }

        return (
            'Đã xảy ra lỗi, vui lòng thử lại.'
        );
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

                if (
                    editingCourse?.id
                    === course.id
                ) {

                    setEditingCourse(null);
                }

                refetch();

            } catch (err) {

                alert(
                    extractErrorMessage(err)
                );
            }
        };

    const handleEdit = (
        course: Course
    ) => {

        setFormError(null);

        setEditingCourse(course);

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <div className="course-page">

            <div className="course-container">

                <div className="course-header">

                    <h1 className="course-title">
                        Quản lý môn học
                    </h1>

                    <p className="course-subtitle">
                        Thêm, sửa, xóa và tìm kiếm môn học trong hệ thống CRS
                    </p>

                </div>

                <CourseForm
                    editingCourse={
                        editingCourse
                    }

                    onSubmit={
                        handleFormSubmit
                    }

                    onCancel={() => {
                        setEditingCourse(null);
                        setFormError(null);
                    }}

                    submitting={
                        submitting
                    }

                    serverError={
                        formError
                    }
                />

                <div className="list-section">

                    <div className="list-header">
                        <h2>
                            Danh sách môn học
                        </h2>
                    </div>

                    <SearchBox
                        onSearch={
                            handleSearch
                        }
                    />

                    <CourseList
                        courses={
                            courses
                        }

                        state={
                            state
                        }

                        errorMessage={
                            errorMessage
                        }

                        onRetry={
                            refetch
                        }

                        onEdit={
                            handleEdit
                        }

                        onDelete={
                            handleDelete
                        }
                    />

                    <Pagination
                        currentPage={
                            page
                        }

                        totalPages={
                            totalPages
                        }

                        onPageChange={
                            setPage
                        }
                    />

                </div>

            </div>

        </div>
    );
}

export default App;