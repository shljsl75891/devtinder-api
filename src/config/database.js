import {connect} from 'mongoose';

/** Connects the application with mongo database */
export default function connectDB() {
  return connect(`${process.env.DATABASE_CLUSTER}${process.env.DATABASE_NAME}`);
}
