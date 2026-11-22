import { MongoClient } from "mongodb";

export async function GET() {
  const uri = process.env.MONGODB_URI;
  const info = {
    hasUri: !!uri,
    uriStart: uri ? uri.slice(0, 14) : null,
    dbName: process.env.DB_NAME || null,
    hasAuthSecret: !!process.env.BETTER_AUTH_SECRET,
    authUrl: process.env.BETTER_AUTH_URL || null,
  };
  try {
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });
    await client.connect();
    const count = await client
      .db(process.env.DB_NAME)
      .collection("user")
      .countDocuments();
    await client.close();
    return Response.json({ ok: true, userCount: count, ...info });
  } catch (e) {
    return Response.json({ ok: false, error: String(e.message), ...info });
  }
}