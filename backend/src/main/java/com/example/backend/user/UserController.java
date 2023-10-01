package com.example.backend.user;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class UserController {

  private final UserRepository userRepository;

  @Autowired
  public UserController(UserRepository userRepository) {
    this.userRepository = userRepository;
  }


  @GetMapping("/users")
  public ResponseEntity<List<UserResponseDto>> getAllUsers() {
    List<UserResponseDto> listUser = userRepository.findAll().stream().map(this::userTransform)
        .toList();
    return ResponseEntity.ok(listUser);
  }

  private UserResponseDto userTransform(User user) {
    UserResponseDto userDto = new UserResponseDto();
    userDto.setId(user.getId());
    userDto.setUsername(user.getUsername());
    userDto.setEmail(user.getEmail());
    userDto.setRoles(user.getRoles());
    return userDto;
  }


  @GetMapping("/user/{id}")
  public ResponseEntity<User> getUserById(@PathVariable Long id) {
    User user = userRepository.findById(id).orElseThrow(
        () -> new RuntimeException("USER not exist with id: " + id));
    return ResponseEntity.ok(user);
  }


  @DeleteMapping("/user/{id}")
  public ResponseEntity<Map<String, Boolean>> deleteUser(@PathVariable Long id) {

    User user = userRepository.findById(id).orElseThrow(() ->
        new RuntimeException("User not exist with id: " + id));
    userRepository.delete(user);

    Map<String, Boolean> response = new HashMap<>();
    response.put("Deleted object with id:" + id, Boolean.TRUE);

    return ResponseEntity.ok(response);
  }


  @PutMapping("/user/{id}")
  public ResponseEntity<User> updateUser(
      @PathVariable Long id, @RequestBody User userDetails) {

    User user = userRepository.findById(id).orElseThrow(() ->
        new RuntimeException("User not exist with id: " + id));

    user.setUsername(userDetails.getUsername());
    user.setEmail(userDetails.getEmail());
    user.setRoles(userDetails.getRoles());

    User updatedUser = userRepository.save(user);
    return ResponseEntity.ok(updatedUser);
  }

}