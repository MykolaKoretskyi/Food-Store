package com.example.backend.repositories;

import com.example.backend.entities.Tag;
import com.example.backend.models.TagEnumerated;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {

  Optional<Tag> findTagByName(TagEnumerated name);
}
