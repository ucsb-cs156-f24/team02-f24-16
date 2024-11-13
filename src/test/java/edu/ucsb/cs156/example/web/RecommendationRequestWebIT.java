package edu.ucsb.cs156.example.web;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class RecommendationRequestWebIT extends WebTestCase {
    @Test
    public void admin_user_can_create_recommendationRequest() throws Exception {
        setupUser(true);

        page.getByText("Recommendation Request").click();

        page.getByText("Create recommendationRequest").click();

        assertThat(page.getByText("Create New recommendationRequest")).isVisible();
        page.getByTestId("RecommendationRequestForm-requesterEmail").fill("Chucknorris@ucsb.edu");
        page.getByTestId("RecommendationRequestForm-professorEmail").fill("sickguyFoo@ucsb.edu");
        page.getByTestId("RecommendationRequestForm-explanation").fill("Just need my stuff.");
        page.getByTestId("RecommendationRequestForm-dateRequested").fill("2012-12-12T04:28");
        page.getByTestId("RecommendationRequestForm-dateNeeded").fill("2013-12-12T04:28");
        page.getByTestId("RecommendationRequestForm-submit").click();

        assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-requesterEmail"))
                .hasText("Chucknorris@ucsb.edu");
        assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-professorEmail"))
                .hasText("sickguyFoo@ucsb.edu");
        assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-explanation"))
                .hasText("Just need my stuff.");
        assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-dateRequested"))
                .hasText("2012-12-12T04:28:00");
        assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-dateNeeded"))
                .hasText("2013-12-12T04:28:00");
    }
}