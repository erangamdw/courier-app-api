import mongoose, { ConnectOptions } from "mongoose";

export const databaseSetup = async () => {
  await mongoose.connect(getMongooseUri() as string);
  console.log("database connection established");
};

function getMongooseUri() {
  return process.env.NODE_ENV !== "test"
    ? process.env.DB_URI
    : process.env.TEST_MONGOOSE_URI;
}
