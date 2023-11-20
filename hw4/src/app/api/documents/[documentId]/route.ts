import { NextResponse, type NextRequest } from "next/server";
import Pusher from "pusher";
import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { usersToDocumentsTable, dataTable, readTable, usersTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { privateEnv } from "@/lib/env/private";
import { publicEnv } from "@/lib/env/public";
import { updateDocSchema } from "@/validators/updateDocument";

type UpdateDataProps = {
  documentDisplayId: string,
  authorDisplayId: string,
  content: string,
};

type DataProps = {
  id: number,
  authorDisplayId: string,
  createdAt: Date | null,
  content: string,
  isRead: string[],
}

// POST /api/documents/:documentId
export async function POST(req: NextRequest) {
  try {
    // Get user from session
    const session = await auth();
    if (!session || !session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    // Parse the request body
    const reqBody = await req.json();
    const validatedReqBody: UpdateDataProps = updateDocSchema.parse(reqBody);
    const { documentDisplayId, authorDisplayId, content } = validatedReqBody;
    
    // Insert data table
    await db
      .insert(dataTable)
      .values({
        documentDisplayId, 
        authorDisplayId, 
        content
      })
      .execute();

    // Get the members
    const dbMember = await db.query.usersToDocumentsTable.findMany({
      where: eq(usersToDocumentsTable.documentId, documentDisplayId),
    });
    // Get all the users
    const dbUsers = await db
      .select({
        displayId: usersTable.displayId,
        username:  usersTable.username,
      })
      .from(usersTable);
    const users: { [key: string]: string } = {};
    dbUsers.map((ele) => users[ele.displayId] = ele.username);
    const members: { [key: string]: string } = {};
    dbMember.map((ele) => members[ele.userId] = users[ele.userId]);

    // Get all the data
    const dbData = await db
      .select({
        id: dataTable.id,
        authorDisplayId: dataTable.authorDisplayId,
        createdAt: dataTable.createdAt,
        content: dataTable.content
      })
      .from(dataTable)
      .where(eq(dataTable.documentDisplayId, documentDisplayId));

    // Get the reads
    const dbRead = await db
      .select({
        dataId: readTable.dataId,
        readerDisplayId: readTable.readerDisplayId,
      })
      .from(readTable)
      .where(eq(readTable.documentDisplayId, documentDisplayId));

     const data: {[key: string]: DataProps} = {};
     dbData.map((ele) => {
       data[ele.id] = {
         id: ele.id,
         authorDisplayId: ele.authorDisplayId,
         createdAt: ele.createdAt,
         content: ele.content,
         isRead: []
       }
     });
     dbRead.map((ele) => {
       data[ele.dataId].isRead.push(ele.readerDisplayId)
     });

    // Trigger pusher event
    const pusher = new Pusher({
      appId: privateEnv.PUSHER_ID,
      key: publicEnv.NEXT_PUBLIC_PUSHER_KEY,
      secret: privateEnv.PUSHER_SECRET,
      cluster: publicEnv.NEXT_PUBLIC_PUSHER_CLUSTER,
      useTLS: true,
    });

    // Private channels are in the format: private-...
    await pusher.trigger(`private-${documentDisplayId}`, "doc:update", {
      senderId: userId,
      document: {
        id: documentDisplayId,
        members,
        data,
      },
    });

    return NextResponse.json(
      {
        id: documentDisplayId,
        members,
        data
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}

// GET /api/documents/:documentId
export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      documentId: string;
    };
  },
) {
  try {
    // Get user from session
    const session = await auth();
    if (!session || !session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    // Get the document
    const dbDocument = await db.query.usersToDocumentsTable.findFirst({
      where: and(
        eq(usersToDocumentsTable.userId, userId),
        eq(usersToDocumentsTable.documentId, params.documentId),
      ),
      with: {
        document: {
          columns: {
            displayId: true,
          },
        },
      },
    });
    if (!dbDocument?.document) {
      return NextResponse.json({ error: "Doc Not Found" }, { status: 404 });
    }

    // Get the members
    const dbMember = await db.query.usersToDocumentsTable.findMany({
      where: eq(usersToDocumentsTable.documentId, params.documentId),
    });
    // Get all the users
    const dbUsers = await db
      .select({
        displayId: usersTable.displayId,
        username:  usersTable.username,
      })
      .from(usersTable);
    const users: { [key: string]: string } = {};
    dbUsers.map((ele) => users[ele.displayId] = ele.username);
    const members: { [key: string]: string } = {};
    dbMember.map((ele) => members[ele.userId] = users[ele.userId]);

    // Get all the data
    const dbData = await db
      .select({
        id: dataTable.id,
        authorDisplayId: dataTable.authorDisplayId,
        createdAt: dataTable.createdAt,
        content: dataTable.content
      })
      .from(dataTable)
      .where(eq(dataTable.documentDisplayId, params.documentId));

    // Get the reads
    const dbRead = await db
      .select({
        dataId: readTable.dataId,
        readerDisplayId: readTable.readerDisplayId,
      })
      .from(readTable)
      .where(eq(readTable.documentDisplayId, params.documentId));

     const data: {[key: string]: DataProps} = {};
     dbData.map((ele) => {
       data[ele.id] = {
         id: ele.id,
         authorDisplayId: ele.authorDisplayId,
         createdAt: ele.createdAt,
         content: ele.content,
         isRead: []
       }
     });
     dbRead.map((ele) => {
       data[ele.dataId].isRead.push(ele.readerDisplayId)
     });

    const document = dbDocument.document;
    return NextResponse.json(
      {
        id: document.displayId,
        members,
        data
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}