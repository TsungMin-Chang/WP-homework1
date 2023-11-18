import { eq } from "drizzle-orm";
import { db } from "@/db";
import { documentsTable, usersToDocumentsTable } from "@/db/schema";

import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const NavBarRequestSchema = z.object({
  userId: z.string().nullable(),
  documentId: z.string().nullable(),
});

type NavBarRequest = z.infer<typeof NavBarRequestSchema>;

export async function POST(request: NextRequest) {
  console.log("NavBar POST", request);
  const data = await request.json();
  console.log("NavBar POST", data);

  try {
    NavBarRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { userId } = data as NavBarRequest;
  if (!userId) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  console.log("NavBar POST", userId);

  try {
    const newDocId = await db.transaction(async (tx) => {
      const [newDoc] = await tx
        .insert(documentsTable)
        .values({
          title: "New Document",
          content: "This is a new document",
        })
        .returning();
      await tx.insert(usersToDocumentsTable).values({
        userId: userId,
        documentId: newDoc.displayId,
      });
      return newDoc.displayId;
    });
    return NextResponse.json({ newDocId }, { status: 200 });
    
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  console.log("NavBar GET", request);
  const data = await request.json();
  console.log("NavBar GET", data);

  try {
    NavBarRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { userId } = data as NavBarRequest;
  if (!userId) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  console.log("NavBar GET", userId);

  try {
    const documents = await db.query.usersToDocumentsTable.findMany({
      where: eq(usersToDocumentsTable.userId, userId),
      with: {
        document: {
          columns: {
            displayId: true,
            title: true,
          },
        },
      },
    });
    return NextResponse.json({ documents }, { status: 200 });
    
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  console.log("NavBar DELETE", request);
  const data = await request.json();
  console.log("NavBar DELETE", data);

  try {
    NavBarRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { documentId } = data as NavBarRequest;
  if (!documentId) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  console.log("NavBar DELETE", documentId);

  try {
    await db
      .delete(documentsTable)
      .where(eq(documentsTable.displayId, documentId));
    return NextResponse.json({ status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
