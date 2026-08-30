import {
    useState
} from 'react';

import {
    useNavigate
} from 'react-router-dom';

import axios
    from 'axios';

import {
    login as loginApi
} from '../api/authApi';

import {
    useAuth
} from '../context/AuthContext';

import type {
    ApiErrorResponse
} from '../types/apiError';

export default function LoginPage() {

    const [username, setUsername] =
        useState('');

    const [password, setPassword] =
        useState('');

    const [error, setError] =
        useState<string | null>(null);

    const [submitting, setSubmitting] =
        useState(false);

    const { login } =
        useAuth();

    const navigate =
        useNavigate();

    const handleSubmit =
        async (
            e: React.FormEvent
        ) => {

            e.preventDefault();

            setError(null);

            setSubmitting(true);

            try {

                const res =
                    await loginApi({
                        username,
                        password
                    });

                login(res.data);

                navigate('/courses');

            } catch (err) {

                if (
                    axios.isAxiosError<
                        ApiErrorResponse
                    >(err)
                    &&
                    err.response?.data?.message
                ) {

                    setError(
                        err.response.data.message
                    );

                } else {

                    setError(
                        'Đăng nhập thất bại, vui lòng thử lại.'
                    );
                }

            } finally {

                setSubmitting(false);
            }
        };

    return (

        <div className="login-page">

            <div className="login-card">

                <h1>
                    Đăng nhập CRS
                </h1>

                <p className="login-subtitle">
                    Đăng nhập để sử dụng hệ thống
                </p>

                <form
                    onSubmit={handleSubmit}
                >

                    <div className="login-group">

                        <label>
                            Tên đăng nhập
                        </label>

                        <input
                            type="text"
                            value={username}

                            onChange={(e) =>
                                setUsername(
                                    e.target.value
                                )
                            }

                            placeholder="Nhập tên đăng nhập"
                        />

                    </div>

                    <div className="login-group">

                        <label>
                            Mật khẩu
                        </label>

                        <input
                            type="password"
                            value={password}

                            onChange={(e) =>
                                setPassword(
                                    e.target.value
                                )
                            }

                            placeholder="Nhập mật khẩu"
                        />

                    </div>

                    {error && (

                        <div className="login-error">
                            {error}
                        </div>

                    )}

                    <button
                        className="login-button"
                        type="submit"
                        disabled={submitting}
                    >

                        {submitting
                            ? 'Đang xử lý...'
                            : 'Đăng nhập'}

                    </button>

                </form>

            </div>

        </div>
    );
}