export type Board = {
  id: number;
  title: string;
  writerId: string;
  writerName: string;
  createdAt: string;
};

export type BoardDetail = {
  id: number;
  title: string;
  writerId: string;
  writerName: string;
  content: string;
  viewCount: number;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
  commentList: Array<unknown>;
};
