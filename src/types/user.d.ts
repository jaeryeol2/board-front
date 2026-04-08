import { Board, BoardComment } from './board';

export type UserInfoType = {
  userId: string;
  userName: string;
  userGender?: 'M' | 'W';
};

export interface PersonalUserInfoType extends UserInfoType {
  userAddr: string;
  writedContentList: Array<Board>;
  writedCommentList: Array<BoardComment>;
}
