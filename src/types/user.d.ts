import { Board, BoardComment } from './board';

export type UserInfoType = {
  userId: string;
  userName: string;
  email?: string;
  userGender?: 'M' | 'W';
};

export interface PersonalUserInfoType extends UserInfoType {
  userAddr: string;
  writedContentList: Array<Board>;
  writedCommentList: Array<BoardComment>;
}

export type UserProfileUpdatePayload = {
  userName: string;
  email?: string;
  userAddr?: string;
};

export type UserPasswordUpdatePayload = {
  currentPassword: string;
  newPassword: string;
};

