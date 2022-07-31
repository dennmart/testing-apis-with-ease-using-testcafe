fixture("Airport Gap - Favorites");

test("Creating favorite airports requires authentication", async (t) => {
  const response = await t.request({
    url: "https://airportgap.dev-tester.com/api/favorites",
    method: "post",
    body: {
      airport_id: "JFK",
      note: "My usual layover when visiting family",
    },
  });

  await t.expect(response.status).eql(401);
});

test("End-to-end flow for managing favorite airports", async (t) => {
  // Create a new favorite airport.
  const postResponse = await t.request({
    url: "https://airportgap.dev-tester.com/api/favorites",
    method: "post",
    body: {
      airport_id: "JFK",
      note: "My usual layover when visiting family",
    },
    headers: {
      Authorization: `Bearer token=${process.env.AIRPORT_GAP_TOKEN}`,
    },
  });

  await t.expect(postResponse.status).eql(201);
  await t.expect(postResponse.body.data.attributes.airport.name).eql("John F Kennedy International Airport");
  await t.expect(postResponse.body.data.attributes.note).eql("My usual layover when visiting family");

  const favoriteId = postResponse.body.data.id;

  // Modify the note of the created favorite airport.
  const putResponse = await t.request({
    url: `https://airportgap.dev-tester.com/api/favorites/${favoriteId}`,
    method: "put",
    body: { note: "My usual layover when visiting family and friends" },
    headers: {
      Authorization: `Bearer token=${process.env.AIRPORT_GAP_TOKEN}`,
    },
  });

  await t.expect(putResponse.status).eql(200);
  await t.expect(putResponse.body.data.attributes.note).eql("My usual layover when visiting family and friends");

  // Delete the created favorite airport.
  const deleteResponse = await t.request({
    url: `https://airportgap.dev-tester.com/api/favorites/${favoriteId}`,
    method: "delete",
    headers: {
      Authorization: `Bearer token=${process.env.AIRPORT_GAP_TOKEN}`,
    },
  });

  await t.expect(deleteResponse.status).eql(204);

  // Verify that the favorite airport was deleted.
  const getResponse = await t.request({
    url: `https://airportgap.dev-tester.com/api/favorites/${favoriteId}`,
    method: "get",
    headers: {
      Authorization: `Bearer token=${process.env.AIRPORT_GAP_TOKEN}`,
    },
  });

  await t.expect(getResponse.status).eql(404);
});
