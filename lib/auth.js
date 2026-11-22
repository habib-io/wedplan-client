import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db(process.env.DB_NAME);

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  emailAndPassword: { enabled: true },
  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "customer", input: true },
      isBlocked: { type: "boolean", defaultValue: false, input: false },
      businessName: { type: "string", required: false, input: true },
      subscriptionPlan: { type: "string", defaultValue: "free", input: false },
      subscriptionExpiresAt: { type: "date", required: false, input: false },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const role = user.role === "vendor" ? "vendor" : "customer";
          return { data: { ...user, role } };
        },
      },
    },
  },
});