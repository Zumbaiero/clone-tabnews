import database from "infra/database.js";
import { version } from "react";

async function status(rquest, response) {
  const updatedAt = new Date().toISOString();

  const databaseVersionResult = await database.query("SHOW server_version;");
  const databsaeVersionValue = databaseVersionResult.rows[0].server_version;

  const databaseMaxconnectionsResult = await database.query(
    "SHOW max_connections;",
  );
  const databaseMaxconnectionsValue =
    databaseMaxconnectionsResult.rows[0].max_connections;

  const databaseName = process.env.POSTGRES_DB;

  const databaseOpenedConnectionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  const databaseOpenedConnectionsValue =
    databaseOpenedConnectionsResult.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databsaeVersionValue,
        max_connections: parseInt(databaseMaxconnectionsValue),
        opened_connections: databaseOpenedConnectionsValue,
      },
    },
  });
}

export default status;
