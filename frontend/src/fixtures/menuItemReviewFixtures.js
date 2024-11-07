const menuItemReviewFixtures = {
  oneReview: {
    id: 1,
    reviewerEmail: "rohanpreetam21@gmail.com",
    stars: 5,
    dateReviewed: "2022-01-02T12:00:00",
    comments: "Very good",
  },
  threeReviews: [
    {
      id: 1,
      reviewerEmail: "rohanpreetam21@gmail.com",
      stars: 5,
      dateReviewed: "2022-01-02T12:00:00",
      comments: "Very good",
    },
    {
      id: 2,
      reviewerEmail: "rohanpreetam@ucsb.com",
      stars: 4,
      dateReviewed: "2022-04-03T12:00:00",
      comments: "Good",
    },
    {
      id: 3,
      reviewerEmail: "salshriaan@ucsb.com",
      stars: 3,
      dateReviewed: "2022-07-04T12:00:00",
      comments: "Very average",
    },
  ],
};

export { menuItemReviewFixtures };
