package com.threadly.post.infrastructure.persistence;

import com.threadly.common.PostFeedDTO;
import com.threadly.post.domain.Post;
import com.threadly.post.domain.PostSummary;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;

public interface PostRepository {

  Optional<Post> findById(UUID id);

  List<Post> findAll();

  List<Post> findByPage(PageRequest pageRequest);

  Slice<PostSummary> findBySliceAndCommunityId(UUID communityId, PageRequest pageRequest);

  List<Post> findByPageAndCommunityId(UUID communityId, PageRequest pageRequest);

  void save(Post post);

  void deleteById(UUID id);

  Slice<PostSummary> findBySliceAndUserId(UUID userId, PageRequest of);
}
