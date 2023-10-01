package com.example.backend.repositories;

import com.example.backend.entities.Order;
import com.example.backend.models.OrderStatus;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

  Optional<Order> findOrderById(Long id);

  Optional<List<Order>> findByStatusAndUsername(OrderStatus status, String username);

  Optional<List<Order>> findByUsername(String username);

}
