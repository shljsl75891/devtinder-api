import mongoose from 'mongoose';
const {connect, ConnectionStates} = mongoose;

/** Connects the application with mongo database */
export default async function connectDB() {
  if (mongoose.connection.readyState !== ConnectionStates.connected)
    return connect(
      `${process.env.DATABASE_CLUSTER}${process.env.DATABASE_NAME}`,
      {serverSelectionTimeoutMS: 5000},
    );

  return mongoose;
}
