package vn.edu.crs.courseservice.repository;

import vn.edu.crs.courseservice.entity.Course;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, Long> {

    // Buổi 2: kiểm tra tên môn học đã tồn tại chưa
    boolean existsByTenMonHocIgnoreCase(String tenMonHoc);

    // Buổi 3: tìm kiếm môn học theo tên + phân trang
    Page<Course> findByTenMonHocContainingIgnoreCase(
            String keyword,
            Pageable pageable
    );
}