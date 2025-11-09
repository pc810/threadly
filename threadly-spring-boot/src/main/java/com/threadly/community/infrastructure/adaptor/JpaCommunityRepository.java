package com.threadly.community.infrastructure.adaptor;

import com.threadly.community.domain.Community;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JpaCommunityRepository extends JpaRepository<Community, UUID> {

}
