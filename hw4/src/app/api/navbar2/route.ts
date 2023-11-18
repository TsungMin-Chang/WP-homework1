import { eq } from "drizzle-orm";
import { db } from "@/db";
import { usersToDocumentsTable } from "@/db/schema";

import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const NavBarRequestSchema = z.object({
  userId: z.string().nullable(),
  documentId: z.string().nullable(),
});

type NavBarRequest = z.infer<typeof NavBarRequestSchema>;

export async function POST(request: NextRequest) {
  console.log("NavBar2 GET", request);
  const data = await request.json();
  console.log("NavBar2 GET", data);

  try {
    NavBarRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { userId } = data as NavBarRequest;
  if (!userId) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  console.log("NavBar2 GET", userId);

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
