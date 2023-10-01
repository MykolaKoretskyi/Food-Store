package com.example.backend.repositories;


import com.example.backend.entities.ImageNameAndUrl;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageRepository extends JpaRepository<ImageNameAndUrl, Long> {

  Optional<ImageNameAndUrl> findByUrl(String imageUrl);

}
