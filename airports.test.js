fixture("Airport Gap - Public Endpoints");

test("Fetch all airports, limited to 30 per page", async (t) => {
  const response = await t.request("https://airportgap.dev-tester.com/api/airports");

  await t.expect(response.status).eql(200);
  await t.expect(response.body.data.length).eql(30);
});

test("Calculate the distance between two airports", async (t) => {
  const response = await t.request({
    url: "https://airportgap.dev-tester.com/api/airports/distance",
    method: "post",
    body: { from: "KIX", to: "HNL" },
  });

  await t.expect(response.status).eql(200);

  const attributes = response.body.data.attributes;
  await t.expect(attributes.kilometers).eql(6613.6637624983405);
  await t.expect(attributes.miles).eql(4106.679303789583);
  await t.expect(attributes.nautical_miles).eql(3568.6050364010352);
});
