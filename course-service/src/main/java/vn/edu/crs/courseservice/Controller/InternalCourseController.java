package vn.edu.crs.courseservice.Controller;

import vn.edu.crs.courseservice.dto.CourseDTO;
import vn.edu.crs.courseservice.service.CourseService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/internal/courses")
@RequiredArgsConstructor
public class InternalCourseController {

    private final CourseService courseService;

    // Sinh viên đăng ký môn
    // -> trừ 1 chỗ
    @PatchMapping("/{id}/reserve-seat")
    public CourseDTO reserveSeat(
            @PathVariable Long id
    ) {

        return courseService.reserveSeat(id);
    }

    // Sinh viên hủy đăng ký
    // -> hoàn lại 1 chỗ
    @PatchMapping("/{id}/release-seat")
    public CourseDTO releaseSeat(
            @PathVariable Long id
    ) {

        return courseService.releaseSeat(id);
    }
}