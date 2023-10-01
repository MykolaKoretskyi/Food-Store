package com.example.backend.models;

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
public class FoodRequestDto {

  private Long id;
  private String name;
  private String description;
  private Double price;
  private String cookTime;
  private Boolean favorite;
  private Set<String> originsNames;
  private Double stars;
  private ImgUrlDto imageUrl;
  private Set<String> tagsNames;
  private Boolean isDeleted;
}
