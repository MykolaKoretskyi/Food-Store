package com.example.backend.controllers;

import com.example.backend.entities.Food;
import com.example.backend.models.FoodRequestDto;
import com.example.backend.models.IdNameDto;
import com.example.backend.models.TagCountDto;
import com.example.backend.services.FoodService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.List;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@AllArgsConstructor
@RestController
@RequestMapping("/api/v1")
public class FoodController {

  private FoodService foodService;


  @GetMapping("/food")
  public ResponseEntity<Page<Food>> getAllFoods(
      @PageableDefault(size = 6, page = 0, sort = "id") Pageable pageable,
      @RequestParam(value = "searchTerm", required = false) String searchTerm,
      @RequestParam(value = "tagName", required = false) String tagName,
      @RequestParam(value = "ignoreId", required = false) Long ignoreId
  ) {
    return ResponseEntity.ok(foodService.getAllFoods(
        Specification.where(null),
        ignoreId,
        searchTerm,
        tagName,
        pageable
    ));
  }

  @GetMapping("/food/available")
  public ResponseEntity<Page<Food>> getAllFoodsExceptDeleted(
      @PageableDefault(size = 6, page = 0, sort = "id") Pageable pageable,
      @RequestParam(value = "searchTerm", required = false) String searchTerm,
      @RequestParam(value = "tagName", required = false) String tagName,
      @RequestParam(value = "ignoreId", required = false) Long ignoreId
  ) {
    return ResponseEntity.ok(foodService.getAllFoodsExceptDeleted(
        ignoreId,
        searchTerm,
        tagName,
        pageable
    ));
  }

  @GetMapping("/food/listId")
  public ResponseEntity<List<Food>> getFoodsByIds(
      @RequestParam(value = "listId", required = false) List<String> listId) {
    return ResponseEntity.ok(foodService.getFoodsByListId(listId));
  }

  @GetMapping("/food/{id}")
  public ResponseEntity<Food> getFoodById(@PathVariable Long id, HttpServletRequest request) {
    return ResponseEntity.ok(foodService.getFoodById(id, request));
  }

  @PutMapping("/food/name")
  public ResponseEntity<Food> getIdFoodByName(@Valid @RequestBody IdNameDto idNameDto) {
    return ResponseEntity.ok(foodService.getFoodIdByName(idNameDto));
  }

  @DeleteMapping("/food/{id}")
  public ResponseEntity<IdNameDto> deleteFoodById(@PathVariable Long id) {
    return ResponseEntity.ok(foodService.deleteFoodById(id));
  }

  @PostMapping("/food")
  public ResponseEntity<Food> addFood(
      @Valid @RequestBody FoodRequestDto foodRequestDto) {
    return ResponseEntity.ok(
        foodService.addFood(foodRequestDto));
  }

  @GetMapping("/food/tags")
  public ResponseEntity<List<TagCountDto>> getAllTags() {
    return ResponseEntity.ok(foodService.findAllTags());
  }

  @GetMapping("/food/origins")
  public ResponseEntity<List<String>> getAllOrigins() {
    return ResponseEntity.ok(foodService.findAllOrigins());
  }

  @PutMapping("/food/{id}")
  public ResponseEntity<Food> changeFoodById(@PathVariable Long id,
      @Valid @RequestBody FoodRequestDto foodRequestDto) {
    return ResponseEntity.ok(foodService.changeFoodById(id, foodRequestDto));
  }

  @PutMapping("/food/favorite")
  public ResponseEntity<Food> changeAndGetStatusFavorite(
      @Valid @RequestBody FoodRequestDto foodRequestDto, HttpServletRequest request) {
    return ResponseEntity.ok(foodService.changeAndGetStatusFavorite(foodRequestDto, request));
  }

}
