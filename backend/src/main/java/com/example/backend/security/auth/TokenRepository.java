package com.example.backend.security.auth;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TokenRepository extends JpaRepository<TokenRefresh, Long> {

  List<TokenRefresh> findAllValidTokenByUserId(Long id);

  List<TokenRefresh> findAllTokenByUserId(Long id);

  TokenRefresh findByRefreshToken(String refreshToken);
}
