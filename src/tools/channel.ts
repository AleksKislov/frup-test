import { connect } from "amqplib";
import { EXCHANGE, QUEUE, ROUT_KEY } from "./consts";

export async function createPubChannel() {
  const connection = await connect(process.env.MQ_URI);
  const channel = await connection.createChannel();
  await channel.assertExchange(EXCHANGE, "direct", { durable: true });
  return channel;
}

export async function createSubChannel() {
  const channel = await createPubChannel();
  await channel.assertQueue(QUEUE, { durable: true });
  await channel.bindQueue(QUEUE, EXCHANGE, ROUT_KEY);
  return channel;
}
