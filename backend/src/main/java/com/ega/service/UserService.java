package com.ega.service;

import com.ega.dto.UserCreateRequest;
import com.ega.dto.UserResponse;
import com.ega.dto.UserUpdateRequest;

import java.util.List;

public interface UserService {
    UserResponse create(UserCreateRequest request);
    UserResponse update(Long id, UserUpdateRequest request);
    UserResponse findById(Long id);
    List<UserResponse> findAll();
    void delete(Long id);
}
