package com.bps.service;

import com.bps.model.Alert;
import java.util.List;

public interface AlertService {
    List<Alert> findByUserId(Long userId);
    Alert saveAlert(Alert alert);
    Alert updateAlert(Long id, Alert alertDetails);
    void deleteAlert(Long id);
}