import { useEffect, useState } from 'react';

import type {
    Course,
    CourseFormValues
} from '../types/course';

import {
    emptyCourseForm
} from '../types/course';

interface CourseFormProps {
    editingCourse: Course | null;

    onSubmit: (
        values: CourseFormValues
    ) => Promise<void>;

    onCancel: () => void;

    submitting: boolean;

    serverError: string | null;
}

export default function CourseForm({
                                       editingCourse,
                                       onSubmit,
                                       onCancel,
                                       submitting,
                                       serverError
                                   }: CourseFormProps) {

    const [values, setValues] =
        useState<CourseFormValues>(
            emptyCourseForm
        );

    const [clientErrors, setClientErrors] =
        useState<Partial<CourseFormValues>>({});

    useEffect(() => {

        if (editingCourse) {

            setValues({
                tenMonHoc: editingCourse.tenMonHoc,
                soTinChi: String(editingCourse.soTinChi),
                soChoToiDa: String(editingCourse.soChoToiDa),
            });

        } else {

            setValues(emptyCourseForm);
        }

        setClientErrors({});

    }, [editingCourse]);

    const validate = (): boolean => {

        const errors: Partial<CourseFormValues> = {};

        if (!values.tenMonHoc.trim()) {
            errors.tenMonHoc =
                'Tên môn học không được để trống';
        }

        const soTinChi = Number(values.soTinChi);

        if (
            !values.soTinChi ||
            isNaN(soTinChi) ||
            soTinChi <= 0
        ) {
            errors.soTinChi =
                'Số tín chỉ phải là số lớn hơn 0';
        }

        const soChoToiDa =
            Number(values.soChoToiDa);

        if (
            !values.soChoToiDa ||
            isNaN(soChoToiDa) ||
            soChoToiDa <= 0
        ) {
            errors.soChoToiDa =
                'Số chỗ tối đa phải là số lớn hơn 0';
        }

        setClientErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        if (!validate()) {
            return;
        }

        await onSubmit(values);
    };

    return (
        <form
            className="course-form"
            onSubmit={handleSubmit}
        >

            <div className="form-header">

                <div>
                    <h2 className="form-title">
                        {editingCourse
                            ? 'Sửa môn học'
                            : 'Thêm môn học mới'}
                    </h2>

                    <p className="form-subtitle">
                        {editingCourse
                            ? 'Cập nhật thông tin môn học'
                            : 'Nhập thông tin môn học mới'}
                    </p>
                </div>

                {editingCourse && (
                    <span className="editing-badge">
            Đang sửa
          </span>
                )}

            </div>

            <div className="form-grid">

                <div className="form-group">

                    <label>
                        Tên môn học
                    </label>

                    <input
                        type="text"
                        value={values.tenMonHoc}
                        onChange={(e) =>
                            setValues({
                                ...values,
                                tenMonHoc: e.target.value
                            })
                        }
                        placeholder="Ví dụ: Kiểm thử phần mềm"
                    />

                    {clientErrors.tenMonHoc && (
                        <p className="field-error">
                            {clientErrors.tenMonHoc}
                        </p>
                    )}

                </div>

                <div className="form-group">

                    <label>
                        Số tín chỉ
                    </label>

                    <input
                        type="number"
                        min="1"
                        value={values.soTinChi}
                        onChange={(e) =>
                            setValues({
                                ...values,
                                soTinChi: e.target.value
                            })
                        }
                        placeholder="3"
                    />

                    {clientErrors.soTinChi && (
                        <p className="field-error">
                            {clientErrors.soTinChi}
                        </p>
                    )}

                </div>

                <div className="form-group">

                    <label>
                        Số chỗ tối đa
                    </label>

                    <input
                        type="number"
                        min="1"
                        value={values.soChoToiDa}
                        onChange={(e) =>
                            setValues({
                                ...values,
                                soChoToiDa: e.target.value
                            })
                        }
                        placeholder="40"
                    />

                    {clientErrors.soChoToiDa && (
                        <p className="field-error">
                            {clientErrors.soChoToiDa}
                        </p>
                    )}

                </div>

            </div>

            {serverError && (
                <div className="form-server-error">
                    {serverError}
                </div>
            )}

            <div className="form-actions">

                <button
                    type="submit"
                    className="primary-button"
                    disabled={submitting}
                >
                    {submitting
                        ? 'Đang lưu...'
                        : editingCourse
                            ? 'Cập nhật'
                            : 'Thêm mới'}
                </button>

                {editingCourse && (
                    <button
                        type="button"
                        className="secondary-button"
                        onClick={onCancel}
                        disabled={submitting}
                    >
                        Hủy
                    </button>
                )}

            </div>

        </form>
    );
}