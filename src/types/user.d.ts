import { Board, BoardComment } from './board';

export type UserInfoType = {
  userId: string;
  userName: string;
  email?: string;
  userGender?: 'M' | 'W';
};

export interface PersonalUserInfoType extends UserInfoType {
  userAddr: string;
  /** 최근 작성 글 (첫 페이지분) */
  writedContentList: Array<Board>;
  /** 최근 작성 댓글 (첫 페이지분) */
  writedCommentList: Array<BoardComment>;
  /** 작성 글 전체 개수 */
  writedContentCount: number;
  /** 작성 댓글 전체 개수 */
  writedCommentCount: number;
}

export type UserProfileUpdatePayload = {
  userName: string;
  email?: string;
  userAddr?: string;
  userGender?: 'M' | 'W' | '';
};

export type UserPasswordUpdatePayload = {
  currentPassword: string;
  newPassword: string;
};
