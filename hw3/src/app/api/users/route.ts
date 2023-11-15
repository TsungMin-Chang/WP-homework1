import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { usersTable } from "@/db/schema";

const postUserRequestSchema = z.object({
  displayName: z.string(),
});

type PostUserRequest = z.infer<typeof postUserRequestSchema>;

export async function POST(request: NextRequest) {
  const data = await request.json();

  try {
    postUserRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { displayName } = data as PostUserRequest;

  try {
    const userid = await db
      .insert(usersTable)
      .values({
        displayName,
      })
      .returning({ id: usersTable.id })
      .execute();
    return NextResponse.json({ data: userid }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
