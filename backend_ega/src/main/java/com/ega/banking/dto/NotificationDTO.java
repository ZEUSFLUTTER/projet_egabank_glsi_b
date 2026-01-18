package com.ega.banking.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationDTO {

    private Long id;
    private String title;
    private String message;
    private String type;
    private Boolean read;
    private LocalDateTime createdAt;
}
