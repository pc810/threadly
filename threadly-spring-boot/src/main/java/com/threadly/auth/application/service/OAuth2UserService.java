package com.threadly.auth.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class OAuth2UserService extends DefaultOAuth2UserService {

//  private final UserExternalService userExternalService;

  @Override
  public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

//    OAuth2User oAuth2User = super.loadUser(userRequest);
//    String email = oAuth2User.getAttribute("email");

//    userExternalService.getUserDetailsByEmail(email)
//        .orElseGet(() -> {
//          userExternalService.createUser(
//              new CreateUserRequest(
//                  email.split("@")[0],
//                  email,
//                  AuthProvider.GOOGLE,
//                  oAuth2User.getName()
//              )
//          );
//          return null;
//        });

    return super.loadUser(userRequest);
  }
}
