package com.example.backend.services;

import com.example.backend.entities.Food;
import com.example.backend.entities.ImageNameAndUrl;
import com.example.backend.models.ImgUrlDto;
import com.example.backend.repositories.FoodRepository;
import com.example.backend.repositories.ImageRepository;
import jakarta.transaction.Transactional;
import java.util.Optional;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@Log4j2
@AllArgsConstructor
public class ImageService {

  private ImageRepository imageRepository;
  private FoodRepository foodRepository;
  private StorageS3Bucket fileStorage;

  @Transactional
  public ImgUrlDto addFoodImage(MultipartFile file) {

    ImageNameAndUrl imageNameAndUrl = new ImageNameAndUrl();
    String imageUrl = fileStorage.uploadFileToS3(file, imageNameAndUrl);
    imageNameAndUrl.setUrl(imageUrl);
    imageRepository.save(imageNameAndUrl);
    return new ImgUrlDto(null, imageUrl, file.getName());
  }


  public void deleteImage(Food food) {

    Optional<ImageNameAndUrl> optionalFoodNameImageUrl =
        imageRepository.findByUrl(food.getImageUrl().getUrl());

    if (optionalFoodNameImageUrl.isPresent()) {
      ImageNameAndUrl imageNameAndUrl = optionalFoodNameImageUrl.get();
      fileStorage.deleteFile(imageNameAndUrl.getImageName());

      food.setImageUrl(imageRepository.findById(1L).orElseThrow());
      imageRepository.delete(imageNameAndUrl);
    }
  }


  public ImgUrlDto transferAndChangeFile(MultipartFile file, String foodId) {

    ImageNameAndUrl imageNameAndUrl = foodRepository
        .findById(Long.parseLong(foodId)).orElseThrow().getImageUrl();

    fileStorage.deleteFile(imageNameAndUrl.getImageName());
    String imageUrl = fileStorage.uploadFileToS3(file, imageNameAndUrl);
    imageNameAndUrl.setUrl(imageUrl);
    imageRepository.flush();
    return new ImgUrlDto(null, imageUrl, file.getName());
  }

}
