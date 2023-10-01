package com.example.backend.user;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

  Optional<User> findByUsername(String username);

  Long countAllByRolesName(RoleEnum roleEnum);

  Optional<User> findByEmail(String email);

}

