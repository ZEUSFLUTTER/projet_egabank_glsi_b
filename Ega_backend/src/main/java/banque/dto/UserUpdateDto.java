package banque.dto;

import lombok.Data;

@Data
public class UserUpdateDto {
    private String email;
    private String password;
}