package com.bps.repository;

import com.bps.model.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {
    // Finds all alerts for a specific user and orders them by the newest first
    List<Alert> findByUser_IdOrderByTimestampDesc(Long userId);
}