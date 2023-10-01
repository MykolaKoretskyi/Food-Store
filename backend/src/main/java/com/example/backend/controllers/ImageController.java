package com.example.backend.controllers;

import com.example.backend.models.ImgUrlDto;
import com.example.backend.services.ImageService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@AllArgsConstructor
@RestController
@RequestMapping("/api/v1")
public class ImageController {

  private ImageService imageService;

  @PostMapping("/food/image-upload")
  public ResponseEntity<ImgUrlDto> addImage(@RequestParam(name = "file") MultipartFile file) {
    return ResponseEntity.ok(imageService.addFoodImage(file));
  }

  @PutMapping("/food/image-upload")
  public ResponseEntity<ImgUrlDto> transferAndChangeImage(
      @RequestParam(name = "file") MultipartFile file,
      @RequestParam(name = "foodId") String foodId) {
    return ResponseEntity.ok(imageService.transferAndChangeFile(file, foodId));
  }

}
