package com.example.backend.entities;

import com.example.backend.models.OrderStatus;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "orders")
public class Order {

  @Id
  @Column(name = "id")
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "username")
  private String username;

  @OneToMany(cascade = CascadeType.PERSIST)
  @JoinTable(name = "items_orders",
      joinColumns = @JoinColumn(name = "order_id", referencedColumnName = "id"),
      inverseJoinColumns = @JoinColumn(name = "item_id", referencedColumnName = "id"))
  private Set<ItemsFood> itemsFood;

  @Column(name = "full_name")
  private String fullName;

  @Column(name = "total_price")
  private Double totalPrice;

  @Column(name = "delivery_address")
  private String deliveryAddress;

  @Column(name = "phone_number")
  private String phoneNumber;

  @Column(name = "status")
  @Enumerated(EnumType.STRING)
  private OrderStatus status;

  @Column(name = "date_time")
  private LocalDateTime orderDate;

  @Column(name = "manager_name")
  private String managerName;

  @Column(name = "change_status_date")
  private LocalDateTime changeStatusDate;

  @Column(name = "date_completed")
  private LocalDateTime dateOfCompleted;
}
