import { eq } from "drizzle-orm";
import { db } from "@/db";
import { usersToDocumentsTable } from "@/db/schema";

import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const ShareRequestSchema = z.object({
  docId: z.string(),
});

type ShareRequest = z.infer<typeof ShareRequestSchema>;

export async function POST(request: NextRequest) {
  console.log("ruote 1", request);
  const data = await request.json();
  console.log("route2", data);

  try {
    ShareRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { docId } = data as ShareRequest;
  console.log("route3", docId);

  try {
    const dbAuthors = await db.query.usersToDocumentsTable.findMany({
      where: eq(usersToDocumentsTable.documentId, docId),
      with: {
        user: {
            columns: {
            displayId: true,
            username: true,
            email: true,
            },
        },
      },
      columns: {},
    });

    const authors = dbAuthors.map((dbAuthor) => {
      const author = dbAuthor.user;
      return {
        id: author.displayId,
        username: author.username,
        email: author.email,
      };
    });

    return NextResponse.json({ authors }, { status: 200 });
    
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
