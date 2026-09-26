package com.lldpractice.domain;
import jakarta.persistence.*; import java.time.*;
@Entity @Table(name="evaluations") public class Evaluation {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
 @OneToOne(optional=false) public Attempt attempt;
 public int totalScore; @Column(length=16000) public String feedbackJson; public Instant createdAt=Instant.now();
}
