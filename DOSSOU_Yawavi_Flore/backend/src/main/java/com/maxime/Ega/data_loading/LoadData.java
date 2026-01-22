package com.maxime.Ega.data_loading;

import com.maxime.Ega.Exeption.ResourceNotFoundException;
import com.maxime.Ega.entity.Role;
import com.maxime.Ega.entity.User;
import com.maxime.Ega.enums.RoleType;
import com.maxime.Ega.repository.RoleRepository;
import com.maxime.Ega.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class LoadData implements CommandLineRunner {
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {

        if (roleRepository.count() == 0){
            Role adminRole = new Role();
            adminRole.setLabel(RoleType.valueOf("ADMIN"));
            roleRepository.save(adminRole);

            Role gestionnaireRole = new Role();
            gestionnaireRole.setLabel(RoleType.valueOf("GESTIONNAIRE"));
            roleRepository.save(gestionnaireRole);

            Role caissiereRole = new Role();
            caissiereRole.setLabel(RoleType.valueOf("CAISSIERE"));
            roleRepository.save(caissiereRole);
        }

        if (userRepository.count() == 0){

            Role adminRole = roleRepository.findByLabel(RoleType.ADMIN)
                    .orElseThrow(() -> new ResourceNotFoundException("Rôle ADMIN introuvable"));

            User adminUser = new User();
            adminUser.setMatricule("AD-9Z3FZ0");
            adminUser.setUsername("administrateur");
            adminUser.setPassword(passwordEncoder.encode("Flore"));
            adminUser.setEmail("admin@ega.com");
            adminUser.setFirstName("Flore");
            adminUser.setLastName("DOSSOU");
            adminUser.setPhoneNumber("71351101");
            adminUser.setActive(true);
            adminUser.setRole(adminRole);

            userRepository.save(adminUser);
        }

    }
}
