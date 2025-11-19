package com.threadly.post.infrastructure.persistence.adaptor;

import com.threadly.post.domain.Post;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaPostRepository extends JpaRepository<Post, UUID>,
    PagingAndSortingRepository<Post, UUID> {

  Page<Post> findByCommunityId(UUID communityId, Pageable pageable);

  List<Post> findByCommunityId(UUID communityId);
}
