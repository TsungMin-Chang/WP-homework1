export type User = {
  id: string;
  username: string;
  email: string;
  provider: "github" | "credentials";
};

export type Document = {
  id: string;
  members: { [key: string]: string };
  data: {
    [key: string]: {
      id: number,
      authorDisplayId: string, 
      createdAt: Date,
      content: string,
      isRead: string[],
    }
  };
};
