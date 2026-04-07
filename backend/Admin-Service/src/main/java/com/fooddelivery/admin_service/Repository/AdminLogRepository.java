package com.fooddelivery.admin_service.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fooddelivery.admin_service.Model.AdminLog;

public interface AdminLogRepository
        extends JpaRepository<AdminLog, Long> {

    List<AdminLog> findAllByOrderByCreatedAtDesc();
    List<AdminLog> findByTargetType(String targetType);
    List<AdminLog> findByPerformedBy(String email);
}
