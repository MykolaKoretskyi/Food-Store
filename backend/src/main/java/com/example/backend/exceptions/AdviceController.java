package com.example.backend.exceptions;

import com.fasterxml.jackson.databind.JsonMappingException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.server.ResponseStatusException;

@Log4j2
@ControllerAdvice
public class AdviceController {


  @ExceptionHandler(BindException.class)
  @ResponseBody
  public ResponseEntity<ErrorDto> handleBindExceptionHandler(BindException ex) {

    Map<String, String> errors = new HashMap<>();
    ex.getBindingResult().getAllErrors().forEach(error -> {
      String fieldName = ((FieldError) error).getField();
      String errorMessage = error.getDefaultMessage();
      errors.put(fieldName, errorMessage);
    });
    log.error("Validation: {}", errors);

    return new ResponseEntity<>(
        new ErrorDto(
            LocalDateTime.now(), HttpStatus.BAD_REQUEST,
            ex.getAllErrors().toString()), HttpStatus.BAD_REQUEST
    );
  }


  @ExceptionHandler(JsonMappingException.class)
  public ResponseEntity<ErrorDto> handleException(JsonMappingException e) {

    return new ResponseEntity<>(new ErrorDto(
        LocalDateTime.now(), HttpStatus.BAD_REQUEST,
        e.getOriginalMessage()), HttpStatus.BAD_REQUEST);
  }


  @ExceptionHandler(ResponseStatusException.class)
  public ResponseEntity<ErrorDto> handleResponseStatusException(ResponseStatusException ex) {

    ErrorDto errorResponse = new ErrorDto(
        LocalDateTime.now(), HttpStatus.valueOf(ex.getStatusCode().value()),
        ex.getMessage());

    return new ResponseEntity<>(errorResponse, ex.getStatusCode());
  }
}