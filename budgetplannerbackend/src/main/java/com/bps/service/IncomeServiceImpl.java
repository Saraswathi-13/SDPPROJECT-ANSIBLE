package com.bps.service;

import com.bps.model.Income;
import com.bps.repository.IncomeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.Optional;

@Service
public class IncomeServiceImpl implements IncomeService {
    @Autowired
    private IncomeRepository incomeRepository;

    @Override
    public Income saveIncome(Income income) {
        if (income.getDate() == null) {
            income.setDate(LocalDate.now());
        }
        return incomeRepository.save(income);
    }

    @Override
    public Income findById(Long id) {
        return incomeRepository.findById(id).orElse(null);
    }

    @Override
    public List<Income> findAll() {
        return incomeRepository.findAll();
    }

    @Override
    public List<Income> findByUserId(Long userId) {
        return incomeRepository.findByUser_Id(userId);
    }
    
    // NEW: Implementation to find by month
    @Override
    public List<Income> findByUserIdAndMonth(Long userId, int year, int month) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.with(TemporalAdjusters.lastDayOfMonth());
        return incomeRepository.findByUser_IdAndDateBetween(userId, startDate, endDate);
    }

    @Override
    public Income updateIncome(Income income) {
        if (income.getId() == null) {
            throw new IllegalArgumentException("Income ID is required for update.");
        }
        return incomeRepository.save(income);
    }

    @Override
    public void deleteIncome(Long id) {
        if (!incomeRepository.existsById(id)) {
            throw new IllegalArgumentException("Income not found with id: " + id);
        }
        incomeRepository.deleteById(id);
    }
}