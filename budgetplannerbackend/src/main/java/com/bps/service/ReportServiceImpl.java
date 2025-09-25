package com.bps.service;

import com.bps.model.*;
import com.bps.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReportServiceImpl implements ReportService {

    @Autowired
    private MonthlyReportRepository monthlyReportRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private IncomeRepository incomeRepository; // Required for comprehensive report
    @Autowired
    private ExpenseRepository expenseRepository; // Required for comprehensive report

    @Override
    public MonthlyReport saveReport(MonthlyReport report) {
        if (report.getUser() == null) {
            throw new IllegalArgumentException("User is required for MonthlyReport");
        }
        if (report.getMonth() == null) {
            report.setMonth(LocalDate.now().withDayOfMonth(1));
        }
        return monthlyReportRepository.save(report);
    }

    @Override
    public MonthlyReport findById(Long id) {
        return monthlyReportRepository.findById(id).orElse(null);
    }

    @Override
    public List<MonthlyReport> findAll() {
        return monthlyReportRepository.findAll();
    }

    @Override
    public List<MonthlyReport> findByUserId(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return List.of();
        return monthlyReportRepository.findByUser_Id(userId);
    }
    
    @Override
    public Map<String, Object> generateComprehensiveReport(Long userId, int year, int month) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.with(TemporalAdjusters.lastDayOfMonth());

        // Fetch all transactions for the given month
        List<Income> incomes = incomeRepository.findByUser_IdAndDateBetween(userId, startDate, endDate);
        List<Expense> expenses = expenseRepository.findByUser_IdAndExpenseDateBetween(userId, startDate, endDate);

        // Calculate totals
        double totalIncome = incomes.stream().mapToDouble(Income::getAmount).sum();
        double totalExpenses = expenses.stream().mapToDouble(Expense::getAmount).sum();

        // Assemble the data into a Map to be sent to the frontend
        Map<String, Object> reportData = new HashMap<>();
        reportData.put("totalIncome", totalIncome);
        reportData.put("totalExpenses", totalExpenses);
        reportData.put("netSavings", totalIncome - totalExpenses);
        reportData.put("incomeTransactions", incomes);
        reportData.put("expenseTransactions", expenses);
        
        return reportData;
    }
}