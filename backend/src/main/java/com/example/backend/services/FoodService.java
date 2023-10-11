package com.example.backend.services;

import static org.springframework.data.jpa.domain.Specification.where;

import com.example.backend.entities.Food;
import com.example.backend.entities.Origin;
import com.example.backend.entities.Tag;
import com.example.backend.exceptions.RequestException;
import com.example.backend.models.FoodRequestDto;
import com.example.backend.models.IdNameDto;
import com.example.backend.models.OriginEnumerated;
import com.example.backend.models.TagCountDto;
import com.example.backend.models.TagEnumerated;
import com.example.backend.repositories.FoodRepository;
import com.example.backend.repositories.ImageRepository;
import com.example.backend.repositories.OriginRepository;
import com.example.backend.repositories.TagRepository;
import com.example.backend.user.RoleEnum;
import com.example.backend.user.User;
import com.example.backend.user.UserRepository;
import jakarta.persistence.criteria.Join;
import jakarta.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@Log4j2
@AllArgsConstructor
public class FoodService {

  private FoodRepository foodRepository;
  private OriginRepository originRepository;
  private TagRepository tagRepository;
  private UserRepository userRepository;
  private ImageRepository imageRepository;
  private ImageService imageService;

  public Food addFood(FoodRequestDto foodRequestDto) {

    var food = Food.builder()
        .name(foodRequestDto.getName())
        .description(foodRequestDto.getDescription())
        .price(foodRequestDto.getPrice())
        .cookTime(foodRequestDto.getCookTime())
        .favorite(foodRequestDto.getFavorite())
        .stars(foodRequestDto.getStars())
        .imageUrl(imageRepository.findByUrl(foodRequestDto.getImageUrl().getUrl()).orElseThrow())
        .isDeleted(false)
        .build();

    Set<Origin> origins = transformToOrigins(foodRequestDto.getOriginsNames(), food);
    food.setOrigins(origins);

    Set<Tag> tags = transformToTags(foodRequestDto.getTagsNames(), food);
    food.setTags(tags);

    return foodRepository.save(food);
  }


  public List<TagCountDto> findAllTags() {

    List<TagCountDto> listTagCount = new ArrayList<>();
    for (TagEnumerated tagEnum : TagEnumerated.values()) {

      listTagCount.add(
          TagCountDto
              .builder()
              .name(tagEnum.name())
              .count(foodRepository.countByTagsName(tagEnum))
              .build()
      );
    }
    listTagCount.add(0, new TagCountDto("ALL",
        foodRepository.countByIsDeletedFalse()));
    return listTagCount;
  }


  public List<String> findAllOrigins() {

    List<String> listOrigins = new ArrayList<>();
    for (OriginEnumerated origin : OriginEnumerated.values()) {
      listOrigins.add(origin.name());
    }
    return listOrigins;
  }


  public Page<Food> getAllFoods(
      Specification<Food> specification,
      Long ignoreId,
      String searchTerm,
      String tagName,
      Pageable pageable) {

    if (ignoreId != null && ignoreId != 0) {
      specification = where(excludeFoodWithId(ignoreId)).and(specification);
    }
    if (searchTerm != null && !searchTerm.isEmpty()) {
      specification = where(executeForSearch(searchTerm)).and(specification);
    }
    if (tagName != null && !tagName.isEmpty()) {
      specification = where(executeForTag(tagName)).and(specification);
    }

    return foodRepository.findAll(specification, pageable);
  }


  public static Specification<Food> excludeFoodWithId(long idToExclude) {
    return (root, query, criteriaBuilder) ->
        criteriaBuilder.notEqual(root.get("id"), idToExclude);
  }


  public static Specification<Food> executeForSearch(String searchTerm) {
    return (root, query, criteriaBuilder) ->
        criteriaBuilder.and(
            criteriaBuilder.like(criteriaBuilder.lower(root.get("name")),
                "%" + searchTerm.toLowerCase() + "%"));
  }


  public static Specification<Food> executeForTag(String tagName) {
    return (root, query, criteriaBuilder) -> {
      Join<Food, Tag> tagsJoin = root.join("tags");
      return criteriaBuilder.like(
          criteriaBuilder.lower(tagsJoin.get("name")),
          "%" + tagName.toLowerCase() + "%"
      );
    };
  }


  public List<Food> getFoodsByListId(List<String> listId) {

    List<Food> listFood = new ArrayList<>();

    if (listId != null) {
      listFood = listId.stream().map(idString ->
          foodRepository.findById(
              Long.parseLong(idString)).orElseThrow()).toList();
    }
    return listFood;
  }


  public Food changeFoodById(Long id, FoodRequestDto foodRequestDto) {

    Food food = foodRepository.findById(id).orElseThrow();
    food.setName(foodRequestDto.getName());
    food.setDescription(foodRequestDto.getDescription());
    food.setPrice(foodRequestDto.getPrice());
    food.setCookTime(foodRequestDto.getCookTime());
    food.setFavorite(foodRequestDto.getFavorite());

    Set<Origin> origins = transformToOrigins(foodRequestDto.getOriginsNames(), food);
    food.setOrigins(origins);

    Set<Tag> tags = transformToTags(foodRequestDto.getTagsNames(), food);
    food.setTags(tags);

    foodRepository.flush();
    return food;
  }


  private Set<Tag> transformToTags(Set<String> tagsNames, Food food) {
    Set<Tag> tags = new HashSet<>();

    tagsNames.stream().forEach(tagNames -> {
      Tag tag = tagRepository.findTagByName(TagEnumerated.valueOf(tagNames)).orElseThrow();
      tag.getFood().add(food);
      tags.add(tag);
    });
    return tags;
  }


  private Set<Origin> transformToOrigins(Set<String> originsNames, Food food) {
    Set<Origin> origins = new HashSet<>();
    originsNames.stream().forEach(originNames -> {
      Origin origin = originRepository.findOriginByName(
          OriginEnumerated.valueOf(originNames)).orElseThrow();
      origin.getFood().add(food);
      origins.add(origin);
    });
    return origins;
  }


  public Food changeAndGetStatusFavorite(
      FoodRequestDto foodRequestDto,
      HttpServletRequest request) {

    User user = userRepository.findByUsername(request.getUserPrincipal().getName()).orElseThrow();
    Food food = foodRepository.findById(foodRequestDto.getId()).orElseThrow();

    Set<User> users = food.getUsers();

    if (users.contains(user)) {
      users = users.stream().filter(userItem -> userItem != user).collect(Collectors.toSet());
      food.setFavorite(false);
    } else {
      users.add(user);
      food.setFavorite(true);
    }
    food.setUsers(users);
    food.setStars(calculateStarRating(users.size()));
    foodRepository.flush();
    return food;
  }


  private Double calculateStarRating(int numberUsersOfLikes) {

    long totalUsers = userRepository.count() -
        userRepository.countAllByRolesName(RoleEnum.valueOf("MANAGER"));
    double numberStarForRating = 5.0;
    return (numberUsersOfLikes * 1.0 / totalUsers) * numberStarForRating;
  }


  public Food getFoodById(Long id, HttpServletRequest request) {

    User user = userRepository.findByUsername(request.getUserPrincipal().getName()).orElseThrow();
    Food food = foodRepository.findById(id).orElseThrow(() ->
        new RequestException(HttpStatus.NOT_FOUND, "Object with id: " + id + " not found"));
    food.setFavorite(food.getUsers().contains(user));
    return food;

  }

  public Food getFoodIdByName(IdNameDto idNameDto) {

    Optional<Food> optionalFood = foodRepository.findByName(idNameDto.getName());

    Food food = new Food();
    if (optionalFood.isPresent()) {
      food = optionalFood.get();
    } else {
      log.info("Food not exist with food name: {}", idNameDto.getName());
    }
    return food;
  }


  public IdNameDto deleteFoodById(Long id) {

    Food food = foodRepository.findById(id).orElseThrow();
    imageService.deleteImage(food);

    food.setName("Deleted " + food.getName() + " " + food.getId());
    food.setDescription("This dish has been removed");
    food.setCookTime("missing");
    food.setFavorite(false);
    food.setOrigins(null);
    food.setStars(0.0);
    food.setTags(null);
    food.setIsDeleted(true);
    foodRepository.flush();

    return new IdNameDto(food.getId(), food.getName());
  }


  public Page<Food> getAllFoodsExceptDeleted(
      Long ignoreId,
      String searchTerm,
      String tagName,
      Pageable pageable
  ) {
    return getAllFoods(executeIsNotDeleted(), ignoreId, searchTerm, tagName, pageable);
  }


  public static Specification<Food> executeIsNotDeleted() {
    return (root, query, criteriaBuilder) ->
        criteriaBuilder.equal(root.get("isDeleted"), false);
  }

}
