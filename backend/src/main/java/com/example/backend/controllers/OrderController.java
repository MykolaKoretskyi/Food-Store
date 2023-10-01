package com.example.backend.controllers;

import com.example.backend.entities.Order;
import com.example.backend.models.OrderDto;
import com.example.backend.services.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.List;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@AllArgsConstructor
@RestController
@RequestMapping("/api/v1")
public class OrderController {

  private OrderService orderService;

  @PostMapping("/order")
  public ResponseEntity<Order> addOrder(
      @Valid @RequestBody OrderDto orderDto,
      HttpServletRequest request) {
     return ResponseEntity.ok(
        orderService.addOrder(orderDto, request));
  }

  @GetMapping("/orders")
  public ResponseEntity<List<Order>> getAllOrders() {
    return ResponseEntity.ok(
        orderService.getAllOrders());
  }

  @GetMapping("/orders-for-user")
  public ResponseEntity<List<Order>> getOrdersForUser(
      HttpServletRequest request) {
    return ResponseEntity.ok(
        orderService.getOrdersForUser(request));
  }

  @GetMapping("/order/{status}")
  public ResponseEntity<List<Order>> getOrder(
      @PathVariable String status,
      HttpServletRequest request) {
    return ResponseEntity.ok(
        orderService.getOrders(status, request));
  }

  @PutMapping("/order/{id}")
  public ResponseEntity<Order> changeOrder(
      @PathVariable Long id,
      @Valid @RequestBody OrderDto orderDto) {
    return ResponseEntity.ok(
        orderService.changeOrder(id, orderDto));
  }

  @PutMapping("/order/status/{id}")
  public ResponseEntity<Order> changeOrderStatus(
      @PathVariable Long id,
      @Valid @RequestBody OrderDto orderDto) {
     return ResponseEntity.ok(
        orderService.changeOrderStatus(id, orderDto));
  }

}
