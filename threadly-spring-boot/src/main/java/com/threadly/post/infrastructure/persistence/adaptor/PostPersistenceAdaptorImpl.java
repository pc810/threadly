package com.threadly.post.infrastructure.persistence.adaptor;

public class PostPersistenceAdaptorImpl extends PostPersistenceAdaptor {

  public PostPersistenceAdaptorImpl(JpaPostRepository repository) {
    super(repository);
  }
}
