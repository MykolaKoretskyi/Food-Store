package com.example.backend.entities;

import com.example.backend.user.User;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "foods")
public class Food {

  @Id
  @Column(name = "id")
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "name")
  private String name;

  @Column(name = "description")
  private String description;

  @Column(name = "price")
  private Double price;

  @Column(name = "cook_time")
  private String cookTime;

  @Column(name = "favorite")
  private Boolean favorite;

  @JsonManagedReference
  @ManyToMany(fetch = FetchType.EAGER)
  @JoinTable(name = "foods_origins",
      joinColumns = @JoinColumn(name = "food_id", referencedColumnName = "id"),
      inverseJoinColumns = @JoinColumn(name = "origin_id", referencedColumnName = "id"))
  private Set<Origin> origins;

  @Column(name = "stars")
  private Double stars;

  @OneToOne
  @JoinColumn(name = "image_url", referencedColumnName = "id")
  private ImageNameAndUrl imageUrl;

  @JsonManagedReference
  @ManyToMany(fetch = FetchType.EAGER)
  @JoinTable(name = "foods_tags",
      joinColumns = @JoinColumn(name = "food_id", referencedColumnName = "id"),
      inverseJoinColumns = @JoinColumn(name = "tag_id", referencedColumnName = "id"))
  private Set<Tag> tags;

  @OneToMany
  @JoinTable(name = "foods_users",
      joinColumns = @JoinColumn(name = "food_id", referencedColumnName = "id"),
      inverseJoinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id"))
  private Set<User> users;

  @Column(name = "is_deleted")
  private Boolean isDeleted;

}
