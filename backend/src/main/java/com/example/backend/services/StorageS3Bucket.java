package com.example.backend.services;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.example.backend.entities.ImageNameAndUrl;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


@Service
@RequiredArgsConstructor
@Slf4j
public class StorageS3Bucket {


  @Value("${s3.access.key}")
  private String ACCESS_KEY;

  @Value("${s3.secret.key}")
  private String SECRET_KEY;

  @Value("${s3.bucket.name}")
  private String BUCKET_NAME;


  public String uploadFileToS3(MultipartFile file, ImageNameAndUrl imageNameAndUrl) {

    BasicAWSCredentials credentials = new BasicAWSCredentials(ACCESS_KEY, SECRET_KEY);

    AmazonS3 s3client = AmazonS3ClientBuilder
        .standard()
        .withCredentials(new AWSStaticCredentialsProvider(credentials))
        .withRegion(Regions.EU_CENTRAL_1)
        .build();

    String fileKey = generateUniqueKey(file.getOriginalFilename());
    imageNameAndUrl.setImageName(fileKey);

    ObjectMetadata metadata = new ObjectMetadata();
    metadata.setContentLength(file.getSize());

    try {
      PutObjectRequest request = new PutObjectRequest(
          BUCKET_NAME, fileKey, file.getInputStream(), metadata);

      request.setCannedAcl(CannedAccessControlList.PublicRead);

      s3client.putObject(request);

      return s3client.getUrl(BUCKET_NAME, fileKey).toString();

    } catch (AmazonServiceException | IOException e) {
      e.printStackTrace();
      return null;
    }
  }

  private String generateUniqueKey(String originalFilename) {
    long timestamp = System.currentTimeMillis();
    return "images/" + timestamp + "_" + originalFilename;
  }


  public void deleteFile(String fileKey) {

    BasicAWSCredentials credentials = new BasicAWSCredentials(ACCESS_KEY, SECRET_KEY);

    AmazonS3 s3client = AmazonS3ClientBuilder
        .standard()
        .withCredentials(new AWSStaticCredentialsProvider(credentials))
        .withRegion(Regions.EU_CENTRAL_1)
        .build();

    s3client.deleteObject(BUCKET_NAME, fileKey);
    log.info("File deleted successfully.");
  }

}
