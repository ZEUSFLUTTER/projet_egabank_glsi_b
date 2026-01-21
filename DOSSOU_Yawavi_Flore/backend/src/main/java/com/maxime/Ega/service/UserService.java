package com.maxime.Ega.service;

import com.maxime.Ega.Exeption.BadRequestException;
import com.maxime.Ega.Exeption.ResourceNotFoundException;
import com.maxime.Ega.dto.user.CreateUserDto;
import com.maxime.Ega.dto.user.ListUserDto;
import com.maxime.Ega.dto.user.LoginDto;
import com.maxime.Ega.entity.Role;
import com.maxime.Ega.entity.User;
import com.maxime.Ega.mappers.user.CreateUserDtoMapper;
import com.maxime.Ega.mappers.user.ListUserDtoMapper;
import com.maxime.Ega.repository.RoleRepository;
import com.maxime.Ega.repository.UserRepository;
import com.maxime.Ega.utils.JwtTokenUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.maxime.Ega.enums.RoleType.CAISSIERE;
import static com.maxime.Ega.enums.RoleType.GESTIONNAIRE;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final CreateUserDtoMapper createUserDtoMapper;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtTokenUtil jwtTokenUtil;
    private final ListUserDtoMapper listUserDtoMapper;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username);
    }

    //methode pour creer un gestionnaire
    public void createGestionnaire(CreateUserDto createUserDto) {
        String username = createUserDto.getUsername();
        //je verifie voir si ce nom utilisateur existe deja ou pas
        if (userRepository.findByUsername(username) != null) {
            throw new BadRequestException("Ce nom d'utilisateur existe déjà");
        }
        User user = createUserDtoMapper.toEntity(createUserDto);
        user.setPassword(passwordEncoder.encode(createUserDto.getPassword()));

        Role roleGestionnaire = roleRepository.findByLabel(GESTIONNAIRE)
                .orElseThrow(() -> new ResourceNotFoundException("Le role gestionnaire n'existe pas"));
        user.setRole(roleGestionnaire);
        user.setActive(true);

        String code  = "GS-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase()
                + createUserDto.getLastName().substring(0,2).toUpperCase();

        user.setMatricule(code);
        userRepository.save(user);
    }

    //methode pour creer une caissiere
    public void createCaissiere(CreateUserDto createUserDto) {
        String username = createUserDto.getUsername();
        //je verifie voir si ce nom utilisateur existe deja ou pas
        if (userRepository.findByUsername(username) != null) {
            throw new BadRequestException("Ce nom d'utilisateur existe déjà");
        }
        User user = createUserDtoMapper.toEntity(createUserDto);
        user.setPassword(passwordEncoder.encode(createUserDto.getPassword()));

        Role roleCaissiere = roleRepository.findByLabel(CAISSIERE)
                .orElseThrow(() -> new ResourceNotFoundException("Le role gestionnaire n'existe pas"));
        user.setRole(roleCaissiere);
        user.setActive(true);

        String code  = "CA-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase()
                + createUserDto.getLastName().substring(0,2).toUpperCase();

        user.setMatricule(code);
        userRepository.save(user);
    }

    //methode pour la connexion
    public HashMap<String, String> login(LoginDto loginDto) {
        String username = loginDto.getUsername();
        String password = loginDto.getPassword();
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new BadRequestException("Nom d'utilisateur ou mot de passe incorrect");
        }
        if (!user.isActive()) {
            throw new BadRequestException("Cet utilisateur ne peut plus se connecter");
        }
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new BadRequestException("Nom d'utilisateur ou mot de passe incorrect");
        }
        HashMap<String, String> response = new HashMap<>();
        response.put("token", jwtTokenUtil.generateToken(user));
        return response;
    }

    //methode pour lister les utilisateurs actives
    public List<ListUserDto> findAllUsersActive() {
        return userRepository.findAll()
                .stream()
                .filter(User::isActive)
                .map(listUserDtoMapper::toDto)
                .collect(Collectors.toList());
    }

    //methode pour lister les utilisateurs desactiver
    public List<ListUserDto> findAllUsersInActive() {
        return userRepository.findAll()
                .stream()
                .filter(u -> !u.isActive())
                .map(listUserDtoMapper::toDto)
                .collect(Collectors.toList());
    }

    //methode pour desactiver un utilisateur
    public void desactiverUser(String matricule) {
        User user =  userRepository.findByMatricule(matricule);
        if(user == null) {
            throw new ResourceNotFoundException("Le matricule n'existe pas");
        }

        if(!user.isActive()) {
            throw new BadRequestException("l'utilisateur est deja desactiver ");
        }else {
            user.setActive(false);
            userRepository.save(user);
        }

    }

    //methode pour activer un utilisateur
    public void activerUser(String matricule) {
        User user =  userRepository.findByMatricule(matricule);
        if(user == null) {
            throw new ResourceNotFoundException("Le matricule n'existe pas");
        }

        if(user.isActive()) {
            throw new BadRequestException("L'utilisateur est deja activé");
        }else {
            user.setActive(true);
            userRepository.save(user);
        }
    }


    //methode pour recuperer l'utilisateur connecter
    public User getLoggedUser(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepository.findByUsername(username);
    }


}
