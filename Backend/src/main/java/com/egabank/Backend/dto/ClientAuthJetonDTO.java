package com.egabank.Backend.dto;

import com.egabank.Backend.entity.Client;

public record ClientAuthJetonDTO(
    String jeton,
    Client client
) {}