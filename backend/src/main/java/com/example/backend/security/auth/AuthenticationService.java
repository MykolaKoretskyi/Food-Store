package com.example.backend.security.auth;


import com.example.backend.exceptions.RequestException;
import com.example.backend.security.config.JwtService;
import com.example.backend.user.Role;
import com.example.backend.user.RoleEnum;
import com.example.backend.user.RoleRepo;
import com.example.backend.user.User;
import com.example.backend.user.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Log4j2
@Service
@RequiredArgsConstructor
public class AuthenticationService {

  private final UserRepository userRepository;
  private final RoleRepo roleRepo;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final AuthenticationManager authenticationManager;
  private final TokenRepository tokenRepository;
  private final boolean USER_IS_MANAGER = false;

  public AuthenticationResponse register(RegisterRequest request) {

    Set<String> rolesNames = new HashSet<>(Set.of("USER"));

    checkUsernameAndEmail(request);

    if (USER_IS_MANAGER) {
      rolesNames.add("MANAGER");
    }

    var user = User.builder()
        .username(request.getUsername())
        .email(request.getEmail())
        .password(passwordEncoder.encode(request.getPassword()))
        .build();

    Set<Role> roles = new HashSet<>();
    rolesNames.stream().forEach(roleName -> {
      Role role = roleRepo.findRoleByName(RoleEnum.valueOf(roleName)).orElseThrow();
      role.getUsers().add(user);
      roles.add(role);
    });
    user.setRoles(roles);
    userRepository.save(user);
    var jwtToken = jwtService.generateToken(user);
    var refreshToken = jwtService.generateRefreshToken(user);
    saveUserToken(user, refreshToken);

    return AuthenticationResponse.builder()
        .accessToken(jwtToken)
        .refreshToken(refreshToken)
        .rolesNames(rolesNames)
        .build();
  }

  private void checkUsernameAndEmail(RegisterRequest request) {

    String message = "";

    if(userRepository.findByUsername(request.getUsername()).isPresent()){
      message = "User with username: \"" + request.getUsername() + "\" is already registered. ";
      log.info(message);
    }
    if(userRepository.findByEmail(request.getEmail()).isPresent()){
      message += "User with email: \"" + request.getEmail() + "\" is already registered. ";
      log.info(message);
    }
    if(message.equals("")){
      return;
    }
    throw new RequestException(HttpStatus.BAD_REQUEST, message);
  }


  public AuthenticationResponse authenticate(AuthenticationRequest request) {

    var user = userRepository.findByUsername(request.getUsername())
        .orElseThrow(() -> {
          log.info("User with username: \"{}\" not found", request.getUsername());
          return new RequestException(HttpStatus.NOT_FOUND,
              "User with username: \"" + request.getUsername() + "\" not found");
        });
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(
            request.getUsername(),
            request.getPassword()
        )
    );

    var jwtToken = jwtService.generateToken(user);
    var refreshToken = jwtService.generateRefreshToken(user);

    tokenRepository.deleteAll(tokenRepository.findAllValidTokenByUserId(user.getId()));
    saveUserToken(user, refreshToken);

    return AuthenticationResponse.builder()
        .accessToken(jwtToken)
        .refreshToken(refreshToken)
        .rolesNames(extractRolesNames(request.getUsername()))
        .build();
  }

  private Set<String> extractRolesNames(String username) {
    Set<Role> roles = userRepository.findByUsername(username).orElseThrow().getRoles();
    Set<String> rolesNames = new HashSet<>();
    roles.forEach(role -> {
      rolesNames.add(String.valueOf(role.getName()));
    });
    return rolesNames;
  }

  private void saveUserToken(User user, String jwtToken) {

    var token = TokenRefresh.builder()
        .userId(user.getId())
        .refreshToken(jwtToken)
        .build();
    tokenRepository.save(token);
    tokenRepository.flush();
  }

  public void refreshToken(
      HttpServletRequest request,
      HttpServletResponse response
  ) throws IOException {
    final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
    String refreshToken;
    final String username;
    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
      return;
    }

    refreshToken = authHeader.substring(7);
    username = jwtService.extractUsername(refreshToken);

    if (username != null) {
      var user = this.userRepository.findByUsername(username).orElseThrow();

      if (jwtService.isRefreshTokenValid(refreshToken, user)) {
        var accessToken = jwtService.generateToken(user);
        refreshToken = jwtService.generateRefreshToken(user);
        tokenRepository.deleteAll(tokenRepository.findAllValidTokenByUserId(user.getId()));
        saveUserToken(user, refreshToken);

        var authResponse = AuthenticationResponse
            .builder()
            .accessToken(accessToken)
            .refreshToken(refreshToken)
            .build();
        new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
      }
    }
  }


  public void logout(HttpServletRequest request) {

    final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
      return;
    }
    String refreshToken = authHeader.substring(7);
    final String username = jwtService.extractUsername(refreshToken);

    if (username != null) {
      var user = this.userRepository.findByUsername(username).orElseThrow();
      tokenRepository.deleteAll(tokenRepository.findAllTokenByUserId(user.getId()));
    }
  }


}
