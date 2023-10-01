package com.example.backend.models;

import com.example.backend.entities.Origin;
import com.example.backend.entities.Tag;
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
public class FoodDto {

  private Long id;
  private String name;
  private String description;
  private Double price;
  private String cookTime;
  private Boolean favorite;
  private Set<Origin> origins;
  private Double stars;
  private String imageUrl;
  private Set<Tag> tags;
  private Boolean isDeleted;
}
