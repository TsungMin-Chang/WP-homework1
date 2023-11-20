import { eq } from "drizzle-orm";

import { db } from "@/db";
import { documentsTable, usersToDocumentsTable, usersTable } from "@/db/schema";

export const createDocument = async (userId: string) => {
  "use server";
  console.log("[createDocument]");

  const newDocId = await db.transaction(async (tx) => {
    const [newDoc] = await tx
      .insert(documentsTable)
      .values({})
      .returning();
    await tx.insert(usersToDocumentsTable).values({
      userId: userId,
      documentId: newDoc.displayId,
    });
    return newDoc.displayId;
  });
  return newDocId;
};

export const getDocuments = async (userId: string) => {
  "use server";

  const documents = await db.query.usersToDocumentsTable.findMany({
    where: eq(usersToDocumentsTable.userId, userId),
    with: {
      document: {
        columns: {
          displayId: true,
        },
      },
    },
  });
  // Get all the users
  const dbUsers = await db
    .select({
      displayId: usersTable.displayId,
      username: usersTable.username
    })
    .from(usersTable);
  // Get all the members
  const dbMembers = await db
    .select({
      userId: usersToDocumentsTable.userId,
      documentId: usersToDocumentsTable.documentId
    })
    .from(usersToDocumentsTable);
  
  const users: {[key: string]: string} = {};
  dbUsers.map((user) => users[user.displayId] = user.username);

  const memberForEachDocument: {[key: string]: string[]} = {};
  documents.map((document) => memberForEachDocument[document.documentId] = []);
  dbMembers.map((ele) => {
    if (ele.userId !== userId && memberForEachDocument[ele.documentId] !== undefined) {
      memberForEachDocument[ele.documentId].push(users[ele.userId]);
    }
  }); 

  return memberForEachDocument;
};

export const deleteDocument = async (documentId: string) => {
  "use server";
  console.log("[deleteDocument]");
  await db
    .delete(documentsTable)
    .where(eq(documentsTable.displayId, documentId));
  return;
};
