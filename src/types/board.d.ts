export type Board = {
  id: number;
  title: string;
  writerId: string;
  writerName: string;
  createdAt: string;
  viewCount: number;
  fileUrl: string;
};

type BoardComment = {
  id: number;
  parentId: number;
  content: string;
  writerId: string;
  writerName: string;
  createdAt: string;
  updatedAt: string;
};

type BoardFile = {
  id: number;
  boardId: number;
  fileUrl: string;
  originalFileName: string;
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
  commentList: Array<BoardComment>;
  fileList: Array<BoardFile>;
};
