import {connect} from 'mongoose';

export async function connectDatabase() {
  await connect(process.env.DATABASE_URL);
}
