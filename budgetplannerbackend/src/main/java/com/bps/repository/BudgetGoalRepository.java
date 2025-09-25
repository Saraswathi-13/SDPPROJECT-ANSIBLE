package com.bps.repository;

import com.bps.model.BudgetGoal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface BudgetGoalRepository extends JpaRepository<BudgetGoal, Long> {
    List<BudgetGoal> findByUser_Id(Long userId);
    Optional<BudgetGoal> findByUser_IdAndCategory_Id(Long userId, Long categoryId);

    @Query("SELECT b FROM BudgetGoal b WHERE b.user.id = :userId AND b.category.id = :categoryId AND :date BETWEEN b.startDate AND b.endDate")
    Optional<BudgetGoal> findActiveGoalForCategoryAndDate(
        @Param("userId") Long userId,
        @Param("categoryId") Long categoryId,
        @Param("date") LocalDate date
    );
}