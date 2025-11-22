package com.threadly.config;

import com.threadly.common.PermissionContext;
import com.threadly.common.Permissions;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springdoc.core.customizers.OperationCustomizer;
import org.springdoc.core.customizers.ParameterCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

  @Bean
  public ParameterCustomizer parameterCustomizer() {
    return (parameterModel, methodParameter) -> {

      if (PermissionContext.class.isAssignableFrom(methodParameter.getParameterType())) {
        return null;
      }

      return parameterModel;
    };
  }

  @Bean
  public OperationCustomizer operationCustomizer() {
    return ((operation, handlerMethod) -> {

      Permissions perms = handlerMethod.getMethodAnnotation(Permissions.class);

      if (perms != null) {
        var permList = Arrays.stream(perms.value())
            .map(Enum::name)
            .toList();

        Map<String, Object> extensions = operation.getExtensions() != null
            ? operation.getExtensions()
            : new LinkedHashMap<>();

        extensions.put("x-permissions", permList);
        operation.setExtensions(extensions);

        String desc = Optional.ofNullable(operation.getDescription()).orElse("");
        String permsText = permList.stream()
            .map(p -> "<li>" + p + "</li>")
            .collect(Collectors.joining());
        operation.setDescription(
            desc + "<br/><br/><strong>Permissions required:</strong><ul>" + permsText + "</ul>");

      }

      return operation;
    });
  }
}