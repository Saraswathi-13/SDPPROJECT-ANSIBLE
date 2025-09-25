package com.bps.service;

import com.bps.model.MonthlyReport;
import java.util.List;
import java.util.Map;

public interface ReportService {
    MonthlyReport saveReport(MonthlyReport report);
    MonthlyReport findById(Long id);
    List<MonthlyReport> findAll();
    List<MonthlyReport> findByUserId(Long userId);

    // This new method signature is required for the implementation
    Map<String, Object> generateComprehensiveReport(Long userId, int year, int month);
}