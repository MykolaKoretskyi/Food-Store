package com.example.backend.services;

import com.example.backend.entities.ItemsFood;
import com.example.backend.entities.Order;
import com.example.backend.models.ItemsFoodDto;
import com.example.backend.models.OrderDto;
import com.example.backend.models.OrderStatus;
import com.example.backend.repositories.FoodRepository;
import com.example.backend.repositories.OrderRepository;
import jakarta.servlet.http.HttpServletRequest;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

@Service
@Log4j2
@AllArgsConstructor
public class OrderService {

  private FoodRepository foodRepository;
  private OrderRepository orderRepository;


  public Order changeOrder(Long id, OrderDto orderDto) {

    if (orderDto.getId() != null && orderDto.getId() != id) {
      throw new RuntimeException("You cannot change the id number");
    }
    Order order = orderRepository.findOrderById(id).orElseThrow();
    if (orderDto.getUsername() != null) {
      order.setUsername(orderDto.getUsername());
    }
    if (orderDto.getItemsFood() != null) {
      order.setItemsFood(transformItemsAndSave(orderDto.getItemsFood()));
    }
    if (orderDto.getFullName() != null) {
      order.setFullName(orderDto.getFullName());
    }
    if (orderDto.getTotalPrice() != 0.0) {
      order.setTotalPrice(orderDto.getTotalPrice());
    }
    if (orderDto.getDeliveryAddress() != null) {
      order.setDeliveryAddress(orderDto.getDeliveryAddress());
    }
    if (orderDto.getPhoneNumber() != null) {
      order.setPhoneNumber(orderDto.getPhoneNumber());
    }
    if (orderDto.getStatus() != null) {
      order.setStatus(orderDto.getStatus());
    }
    orderRepository.flush();
    return order;
  }


  public Order changeOrderStatus(Long id, OrderDto orderDto) {

    if (orderDto.getId() != null && orderDto.getId() != id) {
      throw new RuntimeException("You cannot change the id number");
    }
    Order order = orderRepository.findOrderById(id).orElseThrow();
    String managerName = orderDto.getManagerName();

    order.setStatus(orderDto.getStatus());

    if (!managerName.equals("")) {
      order.setManagerName(managerName);
      order.setChangeStatusDate(orderDto.getChangeStatusDate());
      order.setDateOfCompleted(orderDto.getDateOfCompleted());
    }
    orderRepository.flush();
    return order;
  }


  public List<Order> getOrders(String statusName, HttpServletRequest request) {

    String username = request.getUserPrincipal().getName();

    return orderRepository.findByStatusAndUsername(
        OrderStatus.valueOf(statusName), username).orElseThrow();
  }


  public Order addOrder(OrderDto orderDto, HttpServletRequest request) {

    return orderRepository.save(
        Order.builder()
            .username(request.getUserPrincipal().getName())
            .itemsFood(transformItemsAndSave(orderDto.getItemsFood()))
            .fullName(orderDto.getFullName())
            .totalPrice(orderDto.getTotalPrice())
            .deliveryAddress(orderDto.getDeliveryAddress())
            .phoneNumber(orderDto.getPhoneNumber())
            .status(orderDto.getStatus())
            .orderDate(orderDto.getOrderDate())
            .managerName(orderDto.getManagerName())
            .changeStatusDate(orderDto.getChangeStatusDate())
            .dateOfCompleted(orderDto.getDateOfCompleted())
            .build()
    );
  }


  private Set<ItemsFood> transformItemsAndSave(Set<ItemsFoodDto> itemsFoodDto) {

    Set<ItemsFood> itemsFood = new HashSet<>();
    itemsFoodDto.forEach(item -> {

      itemsFood.add(
          ItemsFood.builder()
              .food(foodRepository.findById(
                  item.getFood().getId()).orElseThrow())
              .quantity(item.getQuantity())
              .build());
    });
    return itemsFood;
  }


  public List<Order> getAllOrders() {
    return orderRepository.findAll();
  }


  public List<Order> getOrdersForUser(HttpServletRequest request) {
    String username = request.getUserPrincipal().getName();
    return orderRepository.findByUsername(username).orElseThrow();
  }

}
