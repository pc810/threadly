export interface Post {
  id: string;
  userId: string;
  title: string;
  type: "TEXT" | "MEDIA" | "LINK";
  contentJson: any;
  contentHtml: string;
  contentText: string;
  link: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}
