package com.lldpractice.web;
import com.lldpractice.domain.*; import com.lldpractice.service.*; import org.springframework.http.*; import org.springframework.web.bind.annotation.*; import java.util.*;
@RestController @RequestMapping("/api") public class ApiController {
 final PracticeService s; public ApiController(PracticeService s){this.s=s;}
 @GetMapping("/problems") public List<Problem> problems(){return s.problems();}
 @PostMapping("/attempts") public Attempt start(@RequestParam Long problemId){return s.start(problemId);}
 @GetMapping("/attempts") public List<Attempt> attempts(){return s.attempts();}
 @GetMapping("/attempts/{id}") public Map<String,Object> detail(@PathVariable Long id){return s.detail(id);}
 @PutMapping("/attempts/{id}") public Attempt save(@PathVariable Long id,@RequestBody Map<String,Object> b){return s.save(id,b);}
 @PostMapping("/attempts/{id}/submit") public Attempt submit(@PathVariable Long id,@RequestBody Map<String,Object> b){return s.submit(id,b);}
 @GetMapping("/attempts/{id}/evaluation") public Evaluation evaluation(@PathVariable Long id){return s.evaluation(id);}
 @PostMapping("/attempts/{id}/challenge") public Map<String,Object> challenge(@PathVariable Long id,@RequestBody Map<String,Object> b){return s.evaluateChallenge(id,"DESIGN_CHALLENGE",String.valueOf(b.getOrDefault("response","")));}
 @PostMapping("/attempts/{id}/change") public Map<String,Object> change(@PathVariable Long id,@RequestBody Map<String,Object> b){return s.evaluateChallenge(id,"REQUIREMENT_CHANGE",String.valueOf(b.getOrDefault("response","")));}
 @GetMapping("/problems/{problemId}/compare") public Map<String,Object> compare(@PathVariable Long problemId){return s.compare(problemId);}
 @GetMapping("/progress") public Map<String,Object> progress(){return s.progress();}
 @GetMapping("/health") public Map<String,String> health(){return Map.of("status","UP","service","LLDX");}
}
