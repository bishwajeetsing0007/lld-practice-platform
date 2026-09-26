package com.lldpractice.service;
import com.fasterxml.jackson.databind.ObjectMapper; import com.lldpractice.domain.*; import org.springframework.stereotype.Component; import java.util.*;
@Component public class RuleBasedEvaluator implements Evaluator {
 private final ObjectMapper om=new ObjectMapper();
 public EvaluationResult evaluate(Problem p,Attempt a){
  Map<String,String> text=Map.of("Requirements",a.assumptions,"Responsibilities",a.classesResponsibilities,"Abstraction",a.relationships,"Extensibility",a.patterns,"Testability",a.tradeoffs);
  List<Map<String,Object>> out=new ArrayList<>(); int total=0;
  for(var e:text.entrySet()){int base=e.getValue()==null?0:e.getValue().trim().length(); int s=Math.min(20, base<40?8:base<100?13:base<180?17:20); String concern=s>=17?"Evidence is present, but strengthen it with concrete design decisions.":"The section is too brief to demonstrate a defensible LLD decision."; String suggestion=s>=17?"State the decision, why it fits the requirement, and what would change later.":"Add concrete classes, responsibilities, dependencies, trade-offs and a change scenario."; out.add(Map.of("criterion",e.getKey(),"score",s,"maxScore",20,"evidence",base==0?"No evidence supplied.":"Submitted content contains "+base+" characters.","concern",concern,"suggestion",suggestion)); total+=s; }
  try{return new EvaluationResult(total,om.writeValueAsString(out));}catch(Exception ex){throw new IllegalStateException(ex);}
 }
}
