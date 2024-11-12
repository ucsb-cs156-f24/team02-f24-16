package edu.ucsb.cs156.example.integration;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.fasterxml.jackson.databind.ObjectMapper;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDateTime;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import edu.ucsb.cs156.example.entities.UCSBRecommendationRequest;
import edu.ucsb.cs156.example.repositories.UCSBRecommendationRequestRepository;
import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.services.CurrentUserService;
import edu.ucsb.cs156.example.services.GrantedAuthoritiesService;
import edu.ucsb.cs156.example.testconfig.TestConfig;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("integration")
@Import(TestConfig.class)
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class RecommendationRequestIT {
    @Autowired
    public CurrentUserService currentUserService;

    @Autowired
    public GrantedAuthoritiesService grantedAuthoritiesService;

    @Autowired
    UCSBRecommendationRequestRepository ucsbRecommendationRequestRepository;

    @Autowired
    public MockMvc mockMvc;

    @Autowired
    public ObjectMapper mapper;

    @MockBean
    UserRepository userRepository;

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void an_admin_user_can_post_a_new_recommendationRequest() throws Exception {
        // arrange
        // page.getByTestId("RecommendationRequestForm-requesterEmail").fill("Chucknorris@ucsb.edu");
        // page.getByTestId("RecommendationRequestForm-professorEmail").fill("sickguyFoo@ucsb.edu");
        // page.getByTestId("RecommendationRequestForm-explanation").fill("Just need my
        // stuff.");
        // page.getByTestId("RecommendationRequestForm-dateRequested").fill("2012-12-12T04:28");
        // page.getByTestId("RecommendationRequestForm-dateNeeded").fill("2013-12-12T04:28");

        // UCSBRecommendationRequest recommendationRequest =
        // UCSBRecommendationRequest.builder()

        // .dateRequested(LocalDateTime.now())
        // .dateNeeded(LocalDateTime.now().plusDays(30))
        // .done(false)
        // .explanation("Just need my stuff.")
        // .professorEmail("sickguyFoo@ucsb.edu")
        // .requesterEmail("Chucknorris@ucsb.edu")
        // .build();

        LocalDateTime now = LocalDateTime.now();

        LocalDateTime testDateNeeded = LocalDateTime.of(2024, 11, 23, 20, 40, 10);
        UCSBRecommendationRequest newRequest = UCSBRecommendationRequest.builder()
                .id(2L)
                .requesterEmail("user@example.com")
                .professorEmail("prof@example.com")
                .explanation("Need%20this%20for%20graduate%20application.")
                .dateRequested(now)
                .dateNeeded(testDateNeeded)
                .done(true)
                .build();

        ucsbRecommendationRequestRepository.save((newRequest));

        String req1 = "/api/recommendationRequest/post?requesterEmail=user@example.com&professorEmail=prof@example.com&explanation=Need%20this%20for%20graduate%20application.&dateRequested=";
        req1 = req1 + now.toString();

        String reqf = req1 + "&dateNeeded=2024-11-23T20:40:10&done=true";

        // act
        MvcResult response = mockMvc.perform(
                post(reqf)
                .with(csrf()))
                .andExpect(status().isOk()).andReturn();

        // assert
        String expectedJson = mapper.writeValueAsString(newRequest);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }
}
