package com.lldpractice.config;
import com.lldpractice.domain.Problem; import com.lldpractice.repo.ProblemRepository; import org.springframework.boot.CommandLineRunner; import org.springframework.context.annotation.Bean; import org.springframework.context.annotation.Configuration;
@Configuration public class DataSeeder {
 @Bean CommandLineRunner seed(ProblemRepository r){return args->{if(r.count()>0)return;
  r.save(new Problem("Parking Lot","Design a parking system supporting multiple vehicle and spot types.","Support vehicle entry/exit, spot allocation, tickets, extensible vehicle types and clean responsibilities.","MEDIUM","OOP,SOLID,Strategy,Factory","Your design currently assumes one payment provider. What changes if Stripe and Razorpay must both be supported?","Parking spots must now support electric vehicles with charging."));
  r.save(new Problem("Vending Machine","Design a vending machine that manages inventory, payments and dispensing.","Support product selection, inventory, payment, refund and multiple payment methods.","EASY","OOP,State,Strategy,SOLID","How would you add UPI without changing core vending logic?","Products now require age verification."));
  r.save(new Problem("Elevator","Design an elevator control system for multiple elevators and request priorities.","Support requests, scheduling, movement, door states and extensible scheduling policies.","MEDIUM","OOP,Strategy,State,Concurrency","How would emergency requests take priority without coupling Elevator to scheduling policy?","Add destination-control elevators."));
  r.save(new Problem("Splitwise","Design an expense sharing system supporting multiple split strategies.","Support equal, percentage and weighted splits with balances and settlements.","MEDIUM","OOP,Strategy,Factory,SOLID","How would you add percentage and weighted splits without changing expense logic?","Support multiple currencies."));
 };}
}
