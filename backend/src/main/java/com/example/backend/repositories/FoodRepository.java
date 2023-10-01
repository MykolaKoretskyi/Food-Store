package com.example.backend.repositories;

import com.example.backend.entities.Food;
import com.example.backend.models.TagEnumerated;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface FoodRepository extends JpaRepository<Food, Long>, JpaSpecificationExecutor<Food> {

  Long countByIsDeletedFalse();

  Long countByTagsName(TagEnumerated tag);

  Optional<Food> findByName(String foodName);

}
