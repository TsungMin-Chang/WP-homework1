import { eq } from "drizzle-orm";
import { db } from "@/db";
import { usersTable, usersToDocumentsTable } from "@/db/schema";

import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const ShareRequestSchema = z.object({
  docId: z.string(),
  email: z.string(),
});

type ShareRequest = z.infer<typeof ShareRequestSchema>;

export async function POST(request: NextRequest) {
  const dataAdd = await request.json();

  try {
    ShareRequestSchema.parse(dataAdd);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { docId, email } = dataAdd as ShareRequest;

  try {

    // Find the user by email
    const [user] = await db
      .select({
        displayId: usersTable.displayId,
      })
      .from(usersTable)
      .where(eq(usersTable.email, email));
    
    if (!user) {
      return NextResponse.json(
        { error: "Invalid request" }, 
        { status: 400 }
      );
    }

    await db.insert(usersToDocumentsTable).values({
      documentId: docId,
      userId: user.displayId,
    });

    return new NextResponse("OK", { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
