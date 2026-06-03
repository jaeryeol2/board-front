export type BoardFilter = {
  page: number;
  rowsPerPage: number;
};

export type Board = {
  id: number;
  title: string;
  writerId: string;
  writerName: string;
  createdAt: string;
  viewCount: number;
  fileUrl: string;
};

export type BoardComment = {
  id: number;
  parentId: number;
  content: string;
  writerId: string;
  writerName: string;
  createdAt: string;
  updatedAt: string;
};

export type BoardFile = {
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
