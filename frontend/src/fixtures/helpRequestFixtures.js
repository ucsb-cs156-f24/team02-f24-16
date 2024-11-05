const helpRequestFixtures = {
  oneRequest: {
    id: 1,
    requesterEmail: "ttnguyen@ucsb.edu",
    teamId: "F24-16",
    tableOrBreakoutRoom: "Table_16",
    requestTime: "2024-11-04T12:45:00",
    explanation: "Needs_help_with_jpa03",
    solved: false,
  },
  threeRequests: [
    {
      id: 1,
      requesterEmail: "ttnguyen@ucsb.edu",
      teamId: "F24-16",
      tableOrBreakoutRoom: "Table_16",
      requestTime: "2024-11-04T12:45:00",
      explanation: "Needs_help_with_jpa03",
      solved: true,
    },
    {
      id: 2,
      requesterEmail: "f24-01-user@ucsb.edu",
      teamId: "F24-01",
      tableOrBreakoutRoom: "Table_01",
      requestTime: "2003-04-20T06:09:00",
      explanation: "Needs_help_with_team01",
      solved: false,
    },
    {
      id: 3,
      requesterEmail: "f24-02-user@ucsb.edu",
      teamId: "F24-02",
      tableOrBreakoutRoom: "Table_02",
      requestTime: "2000-11-15T00:00:00",
      explanation: "Needs_help_with_jpa00",
      solved: false,
    },
  ],
};

export { helpRequestFixtures };
