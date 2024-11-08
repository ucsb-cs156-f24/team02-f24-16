const menuItemReviewFixtures = {
  oneMenuItemReview: {
    id: 1,
    itemId: 10,
    reviewerEmail: "rohanpreetam21@gmail.com",
    stars: 5,
    dateReviewed: "2022-01-02T12:00:00",
    comments: "Very good",
  },
  threeMenuItemReviews: [
    {
      id: 1,
      itemId: 10,
      reviewerEmail: "rohanpreetam21@gmail.com",
      stars: 5,
      dateReviewed: "2022-01-02T12:00:00",
      comments: "Very good",
    },
    {
      id: 2,
      itemId: 20,
      reviewerEmail: "rohanpreetam@ucsb.com",
      stars: 4,
      dateReviewed: "2022-04-03T12:00:00",
      comments: "Good",
    },
    {
      id: 3,
      itemId: 30,
      reviewerEmail: "salshriaan@ucsb.com",
      stars: 3,
      dateReviewed: "2022-07-04T12:00:00",
      comments: "Very average",
    },
  ],
};

export { menuItemReviewFixtures };
