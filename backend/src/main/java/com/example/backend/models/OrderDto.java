package com.example.backend.models;

import java.time.LocalDateTime;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDto {

  private Long id;
  private String username;
  private Set<ItemsFoodDto> itemsFood;
  private String fullName;
  private Double totalPrice;
  private String deliveryAddress;
  private String phoneNumber;
  private OrderStatus status;
  private LocalDateTime orderDate;
  private String managerName;
  private LocalDateTime changeStatusDate;
  private LocalDateTime dateOfCompleted;
}
