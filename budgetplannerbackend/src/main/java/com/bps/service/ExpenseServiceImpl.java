package com.bps.service;

import com.bps.model.*;
import com.bps.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.Optional;

@Service
public class ExpenseServiceImpl implements ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;
    @Autowired
    private BudgetGoalRepository budgetGoalRepository;
    @Autowired
    private AlertRepository alertRepository;

    @Override
    public Expense saveExpense(Expense expense) {
        // --- UPDATED LOGIC ---
        if (expense.getUser() == null || expense.getCategory() == null) {
            throw new IllegalArgumentException("User and Category are required for an Expense");
        }
        if (expense.getExpenseDate() == null) {
            expense.setExpenseDate(LocalDate.now());
        }
        
        // 1. Save the expense to get an ID and persist the relationships
        Expense initiallySavedExpense = expenseRepository.save(expense);

        // 2. IMPORTANT: Re-fetch the expense to get a fully populated object.
        // This ensures related entities like 'category' have all their fields (e.g., name) loaded,
        // preventing a NullPointerException in checkBudgetGoals.
        Expense fullyLoadedExpense = expenseRepository.findById(initiallySavedExpense.getId())
                .orElseThrow(() -> new RuntimeException("Failed to reload expense after saving."));

        // 3. Perform budget checks with the fully loaded object
        checkBudgetGoals(fullyLoadedExpense);
        
        return fullyLoadedExpense;
    }

    @Override
    public Expense findById(Long id) {
        return expenseRepository.findById(id).orElse(null);
    }

    @Override
    public List<Expense> findAll() {
        return expenseRepository.findAll();
    }

    @Override
    public List<Expense> findByUserId(Long userId) {
        return expenseRepository.findByUser_Id(userId);
    }
    
    @Override
    public List<Expense> findByUserIdAndMonth(Long userId, int year, int month) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.with(TemporalAdjusters.lastDayOfMonth());
        return expenseRepository.findByUser_IdAndExpenseDateBetween(userId, startDate, endDate);
    }

    @Override
    public void checkBudgetGoals(Expense expense) {
        if (expense.getCategory() != null && expense.getUser() != null) {
            LocalDate monthStart = expense.getExpenseDate().withDayOfMonth(1);
            LocalDate monthEnd = expense.getExpenseDate().with(TemporalAdjusters.lastDayOfMonth());

            Optional<BudgetGoal> optionalGoal = budgetGoalRepository.findByUser_IdAndCategory_Id(
                    expense.getUser().getId(), expense.getCategory().getId());

            if (optionalGoal.isPresent()) {
                BudgetGoal goal = optionalGoal.get();
                List<Expense> monthExpenses = expenseRepository.findByUser_IdAndCategory_IdAndExpenseDateBetween(
                        expense.getUser().getId(), expense.getCategory().getId(), monthStart, monthEnd);
                double totalSpent = monthExpenses.stream().mapToDouble(Expense::getAmount).sum();
                double percentageUsed = goal.getMonthlyLimit() > 0 ? (totalSpent / goal.getMonthlyLimit()) * 100 : 0;

                if (percentageUsed > goal.getWarningThreshold()) {
                    Alert alert = new Alert();
                    alert.setUser(expense.getUser());
                    // This line is now safe because the category object is fully loaded
                    alert.setMessage(String.format("Category '%s' has reached %.2f%% of its budget limit.", 
                            expense.getCategory().getName(), percentageUsed));
                    alert.setType("BUDGET_WARNING");
                    alert.setTimestamp(LocalDateTime.now());
                    alert.setResolved(false);
                    alertRepository.save(alert);
                }
            }
        }
    }

    @Override
    public Expense updateExpense(Expense expense) {
        if (expense.getId() == null) {
            throw new IllegalArgumentException("Expense ID is required for update");
        }
        Expense updated = expenseRepository.save(expense);
        checkBudgetGoals(updated);
        return updated;
    }

    @Override
    public void deleteExpense(Long id) {
        if (expenseRepository.existsById(id)) {
            expenseRepository.deleteById(id);
        } else {
            throw new IllegalArgumentException("Expense not found with id: " + id);
        }
    }
}