import {
    useCallback,
    useEffect,
    useState,
} from 'react';

import axios from 'axios';

import {
    cancelRegistration,
    getMyRegistrations,
} from '../api/registrationApi';

import {
    getCourseById,
} from '../api/courseApi';

import {
    useToast,
} from '../hooks/useToast';

import Toast
    from '../components/Toast';

import type {
    Registration,
} from '../types/registration';

import type {
    ApiErrorResponse,
} from '../types/apiError';

interface RegistrationRow
    extends Registration {
    courseName: string;
}

export default function MyRegistrationsPage() {
    const [
        rows,
        setRows,
    ] = useState<
        RegistrationRow[]
    >([]);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        loadError,
        setLoadError,
    ] = useState<
        string | null
    >(null);

    const [
        cancellingId,
        setCancellingId,
    ] = useState<
        number | null
    >(null);

    const {
        toast,
        showToast,
        clearToast,
    } = useToast();

    const loadData =
        useCallback(
            async () => {
                setLoading(true);
                setLoadError(null);

                try {
                    const response =
                        await getMyRegistrations();

                    const activeRegistrations =
                        response.data.filter(
                            (
                                registration
                            ) =>
                                registration.trangThai ===
                                'DA_DANG_KY'
                        );

                    const result =
                        await Promise.all(
                            activeRegistrations.map(
                                async (
                                    registration
                                ) => {
                                    try {
                                        const courseResponse =
                                            await getCourseById(
                                                registration.courseId
                                            );

                                        return {
                                            ...registration,

                                            courseName:
                                            courseResponse
                                                .data
                                                .tenMonHoc,
                                        };
                                    } catch {
                                        return {
                                            ...registration,

                                            courseName:
                                                `Môn học #${registration.courseId} ` +
                                                '(không tìm thấy thông tin)',
                                        };
                                    }
                                }
                            )
                        );

                    setRows(
                        result
                    );

                } catch (err) {
                    let message =
                        'Không tải được danh sách môn học đã đăng ký.';

                    if (
                        axios.isAxiosError<
                            ApiErrorResponse
                        >(err) &&
                        err.response
                            ?.data
                            ?.message
                    ) {
                        message =
                            err.response
                                .data
                                .message;
                    }

                    setLoadError(
                        message
                    );

                } finally {
                    setLoading(
                        false
                    );
                }
            },
            []
        );

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleCancel =
        async (
            row: RegistrationRow
        ) => {
            const confirmed =
                window.confirm(
                    `Hủy đăng ký môn "${row.courseName}"?`
                );

            if (!confirmed) {
                return;
            }

            setCancellingId(
                row.id
            );

            try {
                await cancelRegistration(
                    row.id
                );

                showToast(
                    `Hủy đăng ký môn "${row.courseName}" thành công`,
                    'success'
                );

                await loadData();

            } catch (err) {
                let message =
                    'Hủy đăng ký không thành công.';

                if (
                    axios.isAxiosError<
                        ApiErrorResponse
                    >(err) &&
                    err.response
                        ?.data
                        ?.message
                ) {
                    message =
                        err.response
                            .data
                            .message;
                }

                showToast(
                    message,
                    'error'
                );

            } finally {
                setCancellingId(
                    null
                );
            }
        };

    return (
        <div
            style={{
                padding: 24,
                maxWidth: 800,
                margin: '0 auto',
            }}
        >
            <h1>
                Môn học đã đăng ký
            </h1>

            {loading && (
                <p>
                    Đang tải danh sách...
                </p>
            )}

            {!loading &&
                loadError && (
                    <div>
                        <p
                            style={{
                                color:
                                    '#b91c1c',
                            }}
                        >
                            {
                                loadError
                            }
                        </p>

                        <button
                            type="button"
                            onClick={
                                loadData
                            }
                        >
                            Thử lại
                        </button>
                    </div>
                )}

            {!loading &&
                !loadError &&
                rows.length === 0 && (
                    <p>
                        Bạn chưa đăng ký
                        môn học nào.
                    </p>
                )}

            {!loading &&
                !loadError &&
                rows.length > 0 && (
                    <table
                        style={{
                            width: '100%',
                            borderCollapse:
                                'collapse',
                        }}
                    >
                        <thead>
                        <tr
                            style={{
                                textAlign:
                                    'left',

                                borderBottom:
                                    '2px solid #333',
                            }}
                        >
                            <th>
                                Tên môn học
                            </th>

                            <th>
                                Ngày đăng ký
                            </th>

                            <th>
                                Thao tác
                            </th>
                        </tr>
                        </thead>

                        <tbody>
                        {rows.map(
                            (row) => (
                                <tr
                                    key={
                                        row.id
                                    }
                                    style={{
                                        borderBottom:
                                            '1px solid #eee',
                                    }}
                                >
                                    <td>
                                        {
                                            row.courseName
                                        }
                                    </td>

                                    <td>
                                        {new Date(
                                            row.ngayDangKy
                                        ).toLocaleString(
                                            'vi-VN'
                                        )}
                                    </td>

                                    <td>
                                        <button
                                            type="button"
                                            disabled={
                                                cancellingId ===
                                                row.id
                                            }
                                            onClick={() =>
                                                handleCancel(
                                                    row
                                                )
                                            }
                                        >
                                            {cancellingId ===
                                            row.id
                                                ? 'Đang hủy...'
                                                : 'Hủy đăng ký'}
                                        </button>
                                    </td>
                                </tr>
                            )
                        )}
                        </tbody>
                    </table>
                )}

            {toast && (
                <Toast
                    message={
                        toast.message
                    }
                    type={
                        toast.type
                    }
                    onClose={
                        clearToast
                    }
                />
            )}
        </div>
    );
}