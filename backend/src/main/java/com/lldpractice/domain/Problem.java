package com.lldpractice.domain;
import jakarta.persistence.*; import java.util.*;
@Entity @Table(name="problems") public class Problem {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
 @Column(nullable=false) public String title;
 @Column(length=4000,nullable=false) public String statement;
 @Column(length=4000) public String requirements;
 public String difficulty="MEDIUM"; public String topics="OOP,SOLID,Design Patterns";
 @Column(length=4000) public String designChallenge; @Column(length=4000) public String requirementChange;
 public Problem(){} public Problem(String t,String s,String r,String d,String topics,String c,String ch){title=t;statement=s;requirements=r;difficulty=d;this.topics=topics;designChallenge=c;requirementChange=ch;}
}
