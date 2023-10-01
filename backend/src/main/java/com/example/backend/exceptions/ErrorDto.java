package com.example.backend.exceptions;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@Getter
@Setter
@AllArgsConstructor
public class ErrorDto {

  private LocalDateTime dateTime;
  private int code;
  private String status;
  private String error;


  public ErrorDto(LocalDateTime dateTime, HttpStatus httpStatus, String error) {

    this.dateTime = dateTime;
    this.code = httpStatus.value();
    this.status = httpStatus.name();
    this.error = error;
  }


  @Override
  public String toString() {
    return "Error: {" +
        "dateTime=" + dateTime +
        ", code=" + code +
        ", status='" + status + '\'' +
        ", error='" + error + '\'' +
        '}';
  }

}
