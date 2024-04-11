import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { FetcherError } from "@xata.io/client";
import { getXataClient } from "../../_lib/getXataClient";

const xata = getXataClient();

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      message: "Only `POST` requests",
    };
  }

  if (!event.body) {
    return {
      statusCode: 400,
      message: "Please provide score data",
    };
  }

  try {
    const data = await JSON.parse(event.body);
    const record = await xata.db.scores.create(data);

    return {
      statusCode: 200,
      body: JSON.stringify(record),
    };
  } catch (error) {
    if (error instanceof FetcherError) {
      return {
        statusCode: error.errors?.[0]?.status || 500,
        message: error.errors?.[0]?.message || "xata error",
      };
    }

    return {
      statusCode: 500,
      message: JSON.stringify(error),
    };
  }
};

export { handler };
