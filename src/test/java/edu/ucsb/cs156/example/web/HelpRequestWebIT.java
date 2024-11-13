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
public class HelpRequestWebIT extends WebTestCase {
    @Test
    public void admin_user_can_create_edit_delete_help_request() throws Exception {
        setupUser(true);

        page.getByText("Help Requests").click();

        page.getByText("Create Help Request").click();
        assertThat(page.getByText("Create New Help Request")).isVisible();
        page.getByTestId("HelpRequestForm-requesterEmail").fill("ttnguyen@ucsb.edu");
        page.getByLabel("Request Time (iso format)").fill("2024-10-31T00:00");
        page.getByTestId("HelpRequestForm-teamId").fill("f24-16");
        page.getByTestId("HelpRequestForm-tableOrBreakoutRoom").fill("Table 16");
        page.getByTestId("HelpRequestForm-explanation").fill("Need some help ordering some coffee!");
        page.getByLabel("Handled").selectOption("Solved");
        page.getByTestId("HelpRequestForm-submit").click();

        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-requesterEmail"))
                .hasText("ttnguyen@ucsb.edu");

        page.getByTestId("HelpRequestTable-cell-row-0-col-Edit-button").click();
        assertThat(page.getByText("Edit Help Request")).isVisible();
        page.getByTestId("HelpRequestForm-requesterEmail").fill("ttnguyenimpostor@ucsb.edu");
        page.getByTestId("HelpRequestForm-submit").click();

        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-requesterEmail")).hasText("ttnguyenimpostor@ucsb.edu");

        page.getByTestId("HelpRequestTable-cell-row-0-col-Delete-button").click();

        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-requesterEmail")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_help_request() throws Exception {
        setupUser(false);

        page.getByText("Help Requests").click();

        assertThat(page.getByText("Create Help Request")).not().isVisible();
        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-requesterEmail")).not().isVisible();
    }
}