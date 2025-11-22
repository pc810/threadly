package com.threadly.permission.infrastructure.web;

import com.threadly.common.PermissionContext;
import com.threadly.common.PermissionKey;
import com.threadly.common.Permissions;
import com.threadly.common.UserPrincipal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.core.MethodParameter;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;
import org.springframework.web.servlet.HandlerMapping;

@Component
public class PermissionContextResolver implements HandlerMethodArgumentResolver {

  @Override
  public boolean supportsParameter(MethodParameter parameter) {
    return PermissionContext.class.isAssignableFrom(parameter.getParameterType());
  }

  @Override
  public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
      NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {

    var handler = (HandlerMethod) webRequest.getAttribute(
        HandlerMapping.BEST_MATCHING_HANDLER_ATTRIBUTE,
        RequestAttributes.SCOPE_REQUEST);

    if (handler == null) {
      return null;
    }

    List<PermissionKey> keys = new ArrayList<>();

    var perms = handler.getMethodAnnotation(Permissions.class);

    if (perms != null) {
      Collections.addAll(keys, perms.value());
    }

    Map<String, String> uriVars = (Map<String, String>) webRequest.getAttribute(
        HandlerMapping.URI_TEMPLATE_VARIABLES_ATTRIBUTE,
        RequestAttributes.SCOPE_REQUEST);

    String idValue = uriVars != null ? uriVars.get("id") : null;
    var resourceId = idValue != null ? UUID.fromString(idValue) : null;

    var auth = (UsernamePasswordAuthenticationToken) webRequest.getUserPrincipal();

    if (auth == null) {
      throw new AccessDeniedException("User is not authenticated");
    }

    if (resourceId == null) {
      throw new IllegalArgumentException("Resource ID not found in path variables");
    }

    return new PermissionContext((UserPrincipal) auth.getPrincipal(), keys, resourceId);
  }
}
