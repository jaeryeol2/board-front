export type ChildrenType = {
  children: React.ReactNode;
};

export type UserAgentType = {
  isBot: boolean;
  ua: string;
  browser: {
    name?: string;
    version?: string;
    major?: string;
  };
  device: {
    model?: string;
    type?: string;
    vendor?: string;
  };
  engine: {
    name?: string;
    version?: string;
  };
  os: {
    name?: string;
    version?: string;
  };
  cpu: {
    architecture?: string;
  };
};

export type ResponseApi<T> = {
  status: number;
  code: string;
  message: string;
  data: T | null;
};

export type ReducerActionType<T extends Record<string, unknown> = never> = {
  [key in keyof T]: T[key] extends undefined
    ? { type: key }
    : {
        type: key;
        payload: T[key];
      };
}[keyof T];

export type ParamsType<T = { slug: string }> = {
  params: Promise<T>;
};
export type SearchParamsType = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export type SlugType = ParamsType & SearchParamsType;

export type FetchErrorType = {
  status: number;
  code: string;
  message: string;
  data: null;
};
