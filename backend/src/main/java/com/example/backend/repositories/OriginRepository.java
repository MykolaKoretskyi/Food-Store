package com.example.backend.repositories;

import com.example.backend.entities.Origin;
import com.example.backend.models.OriginEnumerated;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OriginRepository extends JpaRepository<Origin, Long> {

  Optional<Origin> findOriginByName(OriginEnumerated name);

}
