package com.threadly.post;

import com.threadly.common.PostFeedDTO;
import java.util.UUID;
import org.springframework.data.domain.Slice;

public interface PostExternalApi {

  Slice<PostFeedDTO> getPostsByCommunityId(UUID communityId, int page, int size);

  Slice<PostFeedDTO> getPostsByUserId(UUID userId, int page, int pageSize);
}
