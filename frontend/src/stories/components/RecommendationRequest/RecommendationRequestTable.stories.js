import React from "react";
import RecommendationRequestTable from "main/components/RecommendationRequest/RecommendationRequestTable";
import { recommendationRequestFixtures } from "fixtures/recommendationRequestFixtures";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import { http, HttpResponse } from "msw";

export default {
  title: "components/RecommendationRequest/RecommendationRequestTable",
  component: RecommendationRequestTable,
};

const Template = (args) => {
  return <RecommendationRequestTable {...args} />;
};

export const Empty = Template.bind({});

Empty.args = {
  requests: [],
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeRequestsOrdinaryUser = Template.bind({});

ThreeRequestsOrdinaryUser.args = {
  requests: recommendationRequestFixtures.threeRecommendationRequests,
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeRequestsAdminUser = Template.bind({});
ThreeRequestsAdminUser.args = {
  requests: recommendationRequestFixtures.threeRecommendationRequests,
  currentUser: currentUserFixtures.adminUser,
};

ThreeRequestsAdminUser.parameters = {
  msw: [
    http.delete("/api/recommendationRequest", () => {
      return HttpResponse.json(
        { message: "Recommendation Request deleted successfully" },
        { status: 200 },
      );
    }),
  ],
};
