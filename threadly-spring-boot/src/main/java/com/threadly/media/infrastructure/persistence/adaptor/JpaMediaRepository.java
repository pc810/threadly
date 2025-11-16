package com.threadly.media.infrastructure.persistence.adaptor;

import com.threadly.media.domain.Media;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JpaMediaRepository extends JpaRepository<Media, UUID> {

  List<Media> findByPostId(UUID postId);
}
