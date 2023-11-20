import {NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { dataTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(req: NextRequest,
  {
    params,
  }: {
    params: {
      id: string;
    };
  },) {
  await db
    .delete(dataTable)
    .where(eq(dataTable.id, parseInt(params.id)));
  return NextResponse.json(
    {
      ok: "Sandra Super Smart!",
    },
    {
      status: 200,
    },
  );
}
