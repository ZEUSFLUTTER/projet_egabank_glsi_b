package com.iai.ega_bank.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClientDto {
    private Long id;
    private String lastName;
    private String firstName;
    private Date birthday;
    private String phone;
    private String email;
    private String address;
    private String sex;
    private String nationality;


}
