package com.bps.service;

import com.bps.model.Alert;
import com.bps.repository.AlertRepository;
import com.bps.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AlertServiceImpl implements AlertService {

    @Autowired
    private AlertRepository alertRepository;

    @Autowired
    private UserRepository userRepository; // Inject to validate user existence

    @Override
    public List<Alert> findByUserId(Long userId) {
        return alertRepository.findByUser_IdOrderByTimestampDesc(userId);
    }

    @Override
    public Alert saveAlert(Alert alert) {
        // Ensure the associated user exists before saving
        userRepository.findById(alert.getUser().getId())
                .orElseThrow(() -> new IllegalArgumentException("Cannot create alert: User not found."));
        
        if (alert.getTimestamp() == null) {
            alert.setTimestamp(LocalDateTime.now());
        }
        return alertRepository.save(alert);
    }

    @Override
    public Alert updateAlert(Long id, Alert alertDetails) {
        // 1. Find the existing alert in the database
        Alert alert = alertRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Alert not found with id: " + id));
        
        // 2. Update only the fields that are allowed to change
        alert.setMessage(alertDetails.getMessage());
        alert.setType(alertDetails.getType());
        alert.setResolved(alertDetails.isResolved());
        
        // 3. Save the updated alert
        return alertRepository.save(alert);
    }

    @Override
    public void deleteAlert(Long id) {
        // Ensure the alert exists before trying to delete it
        if (!alertRepository.existsById(id)) {
            throw new IllegalArgumentException("Alert not found with id: " + id);
        }
        alertRepository.deleteById(id);
    }
}