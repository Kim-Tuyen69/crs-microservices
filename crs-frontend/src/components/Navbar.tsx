import {
    Link,
    useNavigate,
} from 'react-router-dom';

import {
    useAuth,
} from '../context/AuthContext';

export default function Navbar() {
    const {
        user,
        isAuthenticated,
        logout,
    } = useAuth();

    const navigate =
        useNavigate();

    const handleLogout = () => {
        logout();

        navigate(
            '/login'
        );
    };

    return (
        <nav className="navbar">
            <Link
                to="/courses"
                className="navbar-brand"
            >
                CRS
            </Link>

            <div className="navbar-links">
                <Link to="/courses">
                    Danh sách môn học
                </Link>

                {isAuthenticated &&
                    user?.role ===
                    'ADMIN' && (
                        <>
                            <Link to="/admin/courses">
                                Quản trị môn học
                            </Link>

                            <Link to="/admin/api-keys">
                                Quản lý API Key
                            </Link>
                        </>
                    )}

                {isAuthenticated &&
                    user?.role ===
                    'STUDENT' && (
                        <>
                            <Link to="/register-course">
                                Đăng ký học phần
                            </Link>

                            <Link to="/my-registrations">
                                Môn học đã đăng ký
                            </Link>
                        </>
                    )}
            </div>

            <div className="navbar-user">
                {isAuthenticated &&
                user ? (
                    <>
                        <span>
                            Xin chào,{' '}
                            <strong>
                                {user.username}
                            </strong>

                            <span className="role-badge">
                                {user.role}
                            </span>
                        </span>

                        <button
                            type="button"
                            className="logout-button"
                            onClick={
                                handleLogout
                            }
                        >
                            Đăng xuất
                        </button>
                    </>
                ) : (
                    <Link to="/login">
                        Đăng nhập
                    </Link>
                )}
            </div>
        </nav>
    );
}