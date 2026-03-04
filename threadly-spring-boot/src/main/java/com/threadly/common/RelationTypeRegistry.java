package com.threadly.common;

import java.util.HashMap;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class RelationTypeRegistry {

  private static final Map<String, RelationType> RELATIONS = new HashMap<>();

  static {
    register(ResourceRelation.Sys.values());
    register(ResourceRelation.Community.values());
    register(ResourceRelation.Post.values());
    register(ResourceRelation.Comment.values());
  }

  private static void register(RelationType[] values) {
    for (RelationType rt : values) {
      RELATIONS.put(rt.value(), rt);
    }
  }

  public static RelationType fromString(String input) {
    if (input == null) return null;
//    log.info("input={} values={}",input,RELATIONS);
    return RELATIONS.get(input.toUpperCase());
  }
}
