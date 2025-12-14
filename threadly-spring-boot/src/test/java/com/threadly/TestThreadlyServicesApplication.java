package com.threadly;

import org.springframework.boot.SpringApplication;

public class TestThreadlyServicesApplication {

	public static void main(String[] args) {
		SpringApplication.from(ThreadlyServicesApplication::main)
//				.with(TestcontainersConfiguration.class)
				.run(args);
	}

}
