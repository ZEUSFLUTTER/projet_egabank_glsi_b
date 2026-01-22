package com.ega.backend.exception;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.Map;

@Data
@AllArgsConstructor
@Builder
public class ErrorResponse {
    private Instant timestamp;
    private int status;
    private String error;
    private String message;
    private String path;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private Map<String, String> validationErrors;
}
