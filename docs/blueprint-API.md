# Blueprint API

Liệt kê toàn bộ endpoint dự kiến cho cả hệ thống, kể cả các buổi sau, giúp sinh viên có bức tranh tổng thể ngay từ đầu.

## auth-service (cổng 8081, tiền tố khi qua Gateway: `/api/auth`)

| Method | Endpoint | Mô tả | Yêu cầu |
|---|---|---|---|
| POST | `/auth/login` | Đăng nhập, trả về JWT | Public |
| POST | `/auth/register` | (tuỳ chọn) Đăng ký tài khoản | Public |

## course-service (cổng 8082, tiền tố: `/api/courses`)

| Method | Endpoint | Mô tả | Yêu cầu |
|---|---|---|---|
| GET | `/courses` | Danh sách, có search + phân trang | Public |
| GET | `/courses/{id}` | Chi tiết 1 môn học | Public |
| POST | `/courses` | Thêm môn học | ADMIN |
| PUT | `/courses/{id}` | Sửa môn học | ADMIN |
| DELETE | `/courses/{id}` | Xoá môn học | ADMIN |

### API nội bộ (chỉ gọi từ registration-service, KHÔNG lộ ra Gateway cho Frontend)

| Method | Endpoint | Mô tả |
|---|---|---|
| PATCH | `/internal/courses/{id}/reserve-seat` | Kiểm tra còn chỗ, trừ `soChoConLai` (transactional) |
| PATCH | `/internal/courses/{id}/release-seat` | Hoàn trả 1 chỗ khi huỷ đăng ký |

## registration-service (cổng 8083, tiền tố: `/api/registrations`)

| Method | Endpoint | Mô tả | Yêu cầu |
|---|---|---|---|
| POST | `/registrations` | Đăng ký học phần (gọi ngầm sang course-service) | STUDENT |
| GET | `/registrations/my` | Danh sách đăng ký của tôi | STUDENT |
| DELETE | `/registrations/{id}` | Huỷ đăng ký (gọi ngầm release-seat) | STUDENT/ADMIN |