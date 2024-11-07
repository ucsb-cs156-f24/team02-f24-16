package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.testconfig.TestConfig;
import edu.ucsb.cs156.example.ControllerTestCase;
import edu.ucsb.cs156.example.entities.MenuItemReview;
import edu.ucsb.cs156.example.repositories.MenuItemReviewRepository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import java.util.Optional;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@WebMvcTest(controllers = MenuItemReviewController.class)
@Import(TestConfig.class)

public class MenuItemReviewControllerTests extends ControllerTestCase {
    
    @MockBean
    MenuItemReviewRepository menuItemReviewRepository;

    @MockBean
    UserRepository userRepository;

    // Authorization tests for /api/menuItemReview/admin/all

    @Test
    public void logged_out_users_cannot_get_all() throws Exception {
            mockMvc.perform(get("/api/MENUITEMREVIEW/all"))
                            .andExpect(status().is(403)); // logged out users can't get all
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void logged_in_users_can_get_all() throws Exception {
            mockMvc.perform(get("/api/MENUITEMREVIEW/all"))
                            .andExpect(status().is(200)); // logged
    }

    
     
    @Test
    public void logged_out_users_cannot_get_by_id() throws Exception {
            mockMvc.perform(get("/api/MENUITEMREVIEW?id=7"))
                            .andExpect(status().is(403)); // logged out users can't get by id
    }

    
    // Authorization tests for /api/menuItemReview/post
    // (Perhaps should also have these for put and delete)

    @Test
    public void logged_out_users_cannot_post() throws Exception {
            mockMvc.perform(post("/api/MENUITEMREVIEW/post"))
                            .andExpect(status().is(403));
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void logged_in_regular_users_cannot_post() throws Exception {
            mockMvc.perform(post("/api/MENUITEMREVIEW/post"))
                            .andExpect(status().is(403)); // only admins can post
    }

    // Tests with mocks for database actions

    @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {

                // arrange
                LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");

                MenuItemReview review_1 = MenuItemReview.builder()
                                .itemId(3)
                                .reviewerEmail("rohanpreetam21@gmail.com")
                                .stars(4)
                                .dateReviewed(ldt1)
                                .comments("It was very good")
                                .build();

                when(menuItemReviewRepository.findById(eq(7L))).thenReturn(Optional.of(review_1));

                // act
                MvcResult response = mockMvc.perform(get("/api/MENUITEMREVIEW?id=7"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(menuItemReviewRepository, times(1)).findById(eq(7L));
                String expectedJson = mapper.writeValueAsString(review_1);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_does_not_exist() throws Exception {

                // arrange

                when(menuItemReviewRepository.findById(eq(7L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(get("/api/MENUITEMREVIEW?id=7"))
                                .andExpect(status().isNotFound()).andReturn();

                // assert

                verify(menuItemReviewRepository, times(1)).findById(eq(7L));
                Map<String, Object> json = responseToJson(response);
                assertEquals("EntityNotFoundException", json.get("type"));
                assertEquals("MenuItemReview with id 7 not found", json.get("message"));
        }


    @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_user_can_get_all_menuItemReviews() throws Exception {

                // arrange

                LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");

                MenuItemReview review_1 = MenuItemReview.builder()
                                .itemId(2)
                                .reviewerEmail("rohanpreetam21@gmail.com")
                                .stars(4)
                                .dateReviewed(ldt1)
                                .comments("It was very good")
                                .build();
                
                LocalDateTime ldt2 = LocalDateTime.parse("2022-03-11T00:00:00");

                MenuItemReview review_2 = MenuItemReview.builder()
                                .itemId(3)
                                .reviewerEmail("rohanpreetam@ucsb.com")
                                .stars(3)
                                .dateReviewed(ldt2)
                                .comments("It was average")
                                .build();


                ArrayList<MenuItemReview> expectedReviews = new ArrayList<>();
                expectedReviews.addAll(Arrays.asList(review_1, review_2));

                when(menuItemReviewRepository.findAll()).thenReturn(expectedReviews);

                // act
                MvcResult response = mockMvc.perform(get("/api/MENUITEMREVIEW/all"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(menuItemReviewRepository, times(1)).findAll();
                String expectedJson = mapper.writeValueAsString(expectedReviews);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void an_admin_user_can_post_a_new_review() throws Exception {
                // arrange

                LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");

                MenuItemReview review_1 = MenuItemReview.builder()

                                .itemId(2)
                                .reviewerEmail("rohanpreetam21@gmail.com")
                                .stars(4)
                                .dateReviewed(ldt1)
                                .comments("It was very good")
                                .build();

                when(menuItemReviewRepository.save(eq(review_1))).thenReturn(review_1);

                // act  (DOUBT HERE)
                MvcResult response = mockMvc.perform(
                                post("/api/MENUITEMREVIEW/post")
                                    .param("itemId", "2")
                                    .param("reviewerEmail","rohanpreetam21@gmail.com")
                                    .param("stars", "4")
                                    .param("dateReviewed", "2022-01-03T00:00:00")
                                    .param("comments", "It was very good")
                                    .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(menuItemReviewRepository, times(1)).save(review_1);
                String expectedJson = mapper.writeValueAsString(review_1);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }
        

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_delete_a_review() throws Exception {
                // arrange

                LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");

                MenuItemReview review_1 = MenuItemReview.builder()
                                .itemId(5)
                                .reviewerEmail("rohanpreetam21@gmail.com")
                                .stars(4)
                                .dateReviewed(ldt1)
                                .comments("It was very good")
                                .build();

                when(menuItemReviewRepository.findById(eq(15L))).thenReturn(Optional.of(review_1));

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/MENUITEMREVIEW?id=15")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(menuItemReviewRepository, times(1)).findById(15L);
                verify(menuItemReviewRepository, times(1)).delete(any());

                Map<String, Object> json = responseToJson(response);
                assertEquals("MenuItemReview with id 15 deleted", json.get("message"));
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_tries_to_delete_non_existant_menuitemreview_and_gets_right_error_message()
                        throws Exception {
                // arrange

                when(menuItemReviewRepository.findById(eq(15L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/MENUITEMREVIEW?id=15")
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(menuItemReviewRepository, times(1)).findById(15L);
                Map<String, Object> json = responseToJson(response);
                assertEquals("MenuItemReview with id 15 not found", json.get("message"));
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_edit_an_existing_menuitemreview() throws Exception {
                // arrange

                LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");
                LocalDateTime ldt2 = LocalDateTime.parse("2023-01-03T00:00:00");

                MenuItemReview review_1_Original = MenuItemReview.builder()
                                .itemId(5)
                                .reviewerEmail("rohanpreetam21@gmail.com")
                                .stars(4)
                                .dateReviewed(ldt1)
                                .comments("It was very good")
                                .build();

                MenuItemReview review_1_Edited = MenuItemReview.builder()
                                .itemId(6)
                                .reviewerEmail("rohanpreetam21@hotmail.com")
                                .stars(3)
                                .dateReviewed(ldt2)
                                .comments("It was very average")
                                .build();

                String requestBody = mapper.writeValueAsString(review_1_Edited);

                when(menuItemReviewRepository.findById(eq(67L))).thenReturn(Optional.of(review_1_Original));

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/MENUITEMREVIEW?id=67")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(menuItemReviewRepository, times(1)).findById(67L);
                verify(menuItemReviewRepository, times(1)).save(review_1_Edited); // should be saved with correct user
                String responseString = response.getResponse().getContentAsString();
                assertEquals(requestBody, responseString);
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_cannot_edit_menureview_that_does_not_exist() throws Exception {
                // arrange

                LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");

                MenuItemReview reviewEdited = MenuItemReview.builder()
                                .itemId(6)
                                .reviewerEmail("rohanpreetam21@hotmail.com")
                                .stars(3)
                                .dateReviewed(ldt1)
                                .comments("It was very average")
                                .build();

                String requestBody = mapper.writeValueAsString(reviewEdited);

                when(menuItemReviewRepository.findById(eq(67L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/MENUITEMREVIEW?id=67")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(menuItemReviewRepository, times(1)).findById(67L);
                Map<String, Object> json = responseToJson(response);
                assertEquals("MenuItemReview with id 67 not found", json.get("message"));

        }

}
