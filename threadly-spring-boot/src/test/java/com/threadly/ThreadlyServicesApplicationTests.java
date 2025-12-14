package com.threadly;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.modulith.core.ApplicationModules;
import org.springframework.modulith.docs.Documenter;

//@Import(TestcontainersConfiguration.class)
@SpringBootTest
class ThreadlyServicesApplicationTests {

	@Test
	void contextLoads() {
	}


	@Test
	void modularityTests(){
		var am = ApplicationModules.of(ThreadlyServicesApplication.class);

		am.verify();

		new Documenter(am)
				.writeDocumentation()
				.writeModulesAsPlantUml()
				.writeIndividualModulesAsPlantUml();
	}

}
