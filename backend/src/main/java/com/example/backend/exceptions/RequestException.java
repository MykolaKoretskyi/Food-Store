package com.example.backend.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class RequestException extends ResponseStatusException {

  public RequestException(HttpStatus status, String reason) {
    super(status, reason);
  }
}
