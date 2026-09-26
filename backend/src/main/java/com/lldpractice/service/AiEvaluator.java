package com.lldpractice.service; import com.lldpractice.domain.*; import org.springframework.stereotype.Component;
@Component public class AiEvaluator implements Evaluator { public EvaluationResult evaluate(Problem p,Attempt a){ throw new UnsupportedOperationException("LLM provider not configured"); } }
