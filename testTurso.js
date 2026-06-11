const { createClient } = require('@libsql/client');
async function test() {
  const remoteUrl = "libsql://hiperfoco3d-gabrielparra.aws-us-east-2.turso.io";
  const remoteToken = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODExMTk5ODUsImlkIjoiMDE5ZWIzMDMtNjEwMS03OWViLTg5Y2UtN2Q3M2FiNGIxYmQ2IiwicmlkIjoiNTdkYzY3NjktNWQzOS00YzE4LTllZDItMzQ5N2I2NjU0NDc1In0.U8mekuFcfnX0ZscED9-HGUgKGuguMY4-1SYsh16Z6pwrIMvNpcWgSthGO2ETyqD_MO7mNQE1l4OgomFCKBxaAw";
  const client = createClient({ url: remoteUrl, authToken: remoteToken });

  try {
    const res = await client.execute("SELECT * FROM Category");
    console.log("Query success! Rows:", res.rows.length);
  } catch (err) {
    console.error("Query failed!", err);
  }
}
test().catch(console.error);
