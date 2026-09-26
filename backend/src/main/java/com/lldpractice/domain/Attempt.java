package com.lldpractice.domain;
import jakarta.persistence.*; import java.time.*;
@Entity @Table(name="attempts") public class Attempt {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
 @ManyToOne(optional=false,fetch=FetchType.EAGER) public Problem problem;
 @Enumerated(EnumType.STRING) public Status status=Status.DRAFT;
 public String assumptions="", classesResponsibilities="", relationships="", patterns="", tradeoffs="";
 public Integer score; @Column(length=12000) public String diagramJson="[]"; @Column(length=8000) public String challengeResponse=""; @Column(length=8000) public String changeResponse=""; public Instant createdAt=Instant.now(); public Instant submittedAt;
 public enum Status {DRAFT,SUBMITTED,EVALUATING,COMPLETED,FAILED}
}
