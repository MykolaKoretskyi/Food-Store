package com.example.backend.security.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.view.InternalResourceView;
import org.springframework.web.servlet.view.InternalResourceViewResolver;

@Configuration
public class WebMvcApplicationConfig implements WebMvcConfigurer {

  @Override
  public void addViewControllers(ViewControllerRegistry registry) {
    String viewName = "index.html";
    registry.addViewController("/").setViewName(viewName);
    registry.addViewController("/login").setViewName(viewName);
    registry.addViewController("/register").setViewName(viewName);
    registry.addViewController("/food").setViewName(viewName);
    registry.addViewController("/cart-page").setViewName(viewName);
    registry.addViewController("/food/listId").setViewName(viewName);
  }

  @Bean
  public ViewResolver internalResourceViewResolver() {
    InternalResourceViewResolver viewResolver = new InternalResourceViewResolver();
    viewResolver.setViewClass(InternalResourceView.class);
    return viewResolver;
  }
}
