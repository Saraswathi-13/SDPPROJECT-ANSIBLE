package com.bps.service;

import com.bps.model.Expense;
import java.util.List;

public interface ExpenseService {
    Expense saveExpense(Expense expense);
    Expense findById(Long id);
    List<Expense> findAll();
    List<Expense> findByUserId(Long userId);
    
    // NEW: Find by specific month
    List<Expense> findByUserIdAndMonth(Long userId, int year, int month);

    void checkBudgetGoals(Expense expense);
    Expense updateExpense(Expense expense);
    void deleteExpense(Long id);
}