import { useState } from 'react';

import {
    useCourses
} from '../api/useCourses';

import SearchBox
    from '../components/SearchBox';

import CourseList
    from '../components/CourseList';

import Pagination
    from '../components/Pagination';

export default function CoursesPage() {

    const [keyword, setKeyword] =
        useState('');

    const [page, setPage] =
        useState(0);

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

    return (

        <div className="course-page">

            <div className="course-container">

                <div className="course-header">

                    <h1 className="course-title">
                        Danh sách môn học
                    </h1>

                    <p className="course-subtitle">
                        Tra cứu các môn học trong hệ thống CRS
                    </p>

                </div>

                <SearchBox
                    onSearch={handleSearch}
                />

                <CourseList
                    courses={courses}
                    state={state}
                    errorMessage={errorMessage}
                    onRetry={refetch}
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