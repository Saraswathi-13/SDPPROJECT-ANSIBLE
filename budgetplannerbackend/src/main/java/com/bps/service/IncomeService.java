package com.bps.service;

import com.bps.model.Income;
import java.time.LocalDate;
import java.util.List;

public interface IncomeService {
    Income saveIncome(Income income);
    Income findById(Long id);
    List<Income> findAll();
    List<Income> findByUserId(Long userId);
    
    // NEW: Find by specific month
    List<Income> findByUserIdAndMonth(Long userId, int year, int month);

    Income updateIncome(Income income);
    void deleteIncome(Long id);
}