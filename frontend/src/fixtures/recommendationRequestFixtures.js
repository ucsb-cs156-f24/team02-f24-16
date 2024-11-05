const recommendationRequestFixtures = {
  oneRecommendationRequest: {
    id: 1,
    requesterEmail: "jaydenjardine@cs.ucsb.edu",
    professorEmail: "aubreydrakegraham@ovo.com",
    explanation: "I need a song with you and Ye ASAP.",
    dateRequested: "2024-10-31T12:37:00",
    dateNeeded: "2024-11-07T12:37:00",
    done: false,
  },
  threeRecommendationRequests: [
    {
      id: 1,
      requesterEmail: "jaydenjardine@cs.ucsb.edu",
      professorEmail: "taylor.alison@recordlabel.com",
      explanation:
        "Please feature on a track about college life. It could really resonate with students.",
      dateRequested: "2024-10-31T13:45:00",
      dateNeeded: "2024-11-10T13:45:00",
      done: false,
    },
    {
      id: 2,
      requesterEmail: "jaydenjardine@cs.ucsb.edu",
      professorEmail: "marshallm@shadyrecords.com",
      explanation:
        "We need your insight on a spoken word project for a class on lyrical writing. Your expertise would be invaluable.",
      dateRequested: "2024-10-31T14:53:00",
      dateNeeded: "2024-11-08T14:53:00",
      done: true,
    },
    {
      id: 3,
      requesterEmail: "jaydenjardine@cs.ucsb.edu",
      professorEmail: "rihanna.fenty@fentymusic.com",
      explanation:
        "Requesting your participation in a university event focusing on the influence of Caribbean music in pop culture.",
      dateRequested: "2024-10-31T15:30:00",
      dateNeeded: "2024-11-15T15:30:00",
      done: false,
    },
  ],
};
export { recommendationRequestFixtures };
