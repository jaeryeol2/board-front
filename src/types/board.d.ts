export type BoardFilter = {
  page: number;
  rowsPerPage: number;
};

export type Board = {
  id: number;
  title: string;
  /** 게시판 타입명 (예: BOARD_FREE) */
  boardType: string;
  writerId: string | null;
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
  writerId: string | null;
  writerName: string;
  content: string;
  viewCount: number;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
  commentList: Array<BoardComment>;
  fileList: Array<BoardFile>;
  /** 요청자가 작성자인지 여부 (서버 계산) */
  author?: boolean;
};
