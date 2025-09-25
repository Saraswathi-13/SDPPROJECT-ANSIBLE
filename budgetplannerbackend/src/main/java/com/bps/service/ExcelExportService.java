package com.bps.service;

import com.bps.model.Expense;
import com.bps.model.Income;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ExcelExportService {

    @SuppressWarnings("unchecked")
    public ByteArrayInputStream createExcelReport(Map<String, Object> reportData) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            // --- Summary Sheet ---
            Sheet summarySheet = workbook.createSheet("Summary");
            summarySheet.createRow(0).createCell(0).setCellValue("Metric");
            summarySheet.getRow(0).createCell(1).setCellValue("Amount");

            Row incomeRow = summarySheet.createRow(1);
            incomeRow.createCell(0).setCellValue("Total Income");
            incomeRow.createCell(1).setCellValue((Double) reportData.get("totalIncome"));

            Row expenseRow = summarySheet.createRow(2);
            expenseRow.createCell(0).setCellValue("Total Expenses");
            expenseRow.createCell(1).setCellValue((Double) reportData.get("totalExpenses"));

            Row savingsRow = summarySheet.createRow(3);
            savingsRow.createCell(0).setCellValue("Net Savings");
            savingsRow.createCell(1).setCellValue((Double) reportData.get("netSavings"));

            summarySheet.autoSizeColumn(0);
            summarySheet.autoSizeColumn(1);

            // --- Income Transactions Sheet ---
            Sheet incomeSheet = workbook.createSheet("Income Transactions");
            Row incomeHeader = incomeSheet.createRow(0);
            String[] incomeHeaders = {"Date", "Source", "Amount", "Description"};
            for (int i = 0; i < incomeHeaders.length; i++) {
                incomeHeader.createCell(i).setCellValue(incomeHeaders[i]);
            }

            int rowIdx = 1;
            List<Income> incomes = (List<Income>) reportData.get("incomeTransactions");
            if (incomes != null && !incomes.isEmpty()) {
                for (Income income : incomes) {
                    Row row = incomeSheet.createRow(rowIdx++);
                    // Safety checks for each field to prevent crashes
                    row.createCell(0).setCellValue(Optional.ofNullable(income.getDate()).map(Object::toString).orElse("N/A"));
                    row.createCell(1).setCellValue(Optional.ofNullable(income.getSource()).orElse("N/A"));
                    row.createCell(2).setCellValue(income.getAmount());
                    row.createCell(3).setCellValue(Optional.ofNullable(income.getDescription()).orElse(""));
                }
            } else {
                incomeSheet.createRow(1).createCell(0).setCellValue("No income transactions found for this period.");
            }
            for (int i = 0; i < incomeHeaders.length; i++) { incomeSheet.autoSizeColumn(i); }

            // --- Expense Transactions Sheet ---
            Sheet expenseSheet = workbook.createSheet("Expense Transactions");
            Row expenseHeader = expenseSheet.createRow(0);
            String[] expenseHeaders = {"Date", "Category", "Amount", "Description"};
            for (int i = 0; i < expenseHeaders.length; i++) {
                expenseHeader.createCell(i).setCellValue(expenseHeaders[i]);
            }

            rowIdx = 1;
            List<Expense> expenses = (List<Expense>) reportData.get("expenseTransactions");
            if (expenses != null && !expenses.isEmpty()) {
                for (Expense expense : expenses) {
                    Row row = expenseSheet.createRow(rowIdx++);
                    // Safety checks for each field to prevent crashes
                    row.createCell(0).setCellValue(Optional.ofNullable(expense.getExpenseDate()).map(Object::toString).orElse("N/A"));
                    String categoryName = Optional.ofNullable(expense.getCategory())
                                                  .map(cat -> cat.getName())
                                                  .orElse("Uncategorized");
                    row.createCell(1).setCellValue(categoryName);
                    row.createCell(2).setCellValue(expense.getAmount());
                    row.createCell(3).setCellValue(Optional.ofNullable(expense.getDescription()).orElse(""));
                }
            } else {
                 expenseSheet.createRow(1).createCell(0).setCellValue("No expense transactions found for this period.");
            }
            for (int i = 0; i < expenseHeaders.length; i++) { expenseSheet.autoSizeColumn(i); }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }
}
