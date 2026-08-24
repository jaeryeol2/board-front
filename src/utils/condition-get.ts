type Condition = (() => boolean) | boolean;
type ValueOrSupplier<T> = T | (() => T);
type Rule<T> = [Condition, ValueOrSupplier<T>];

export interface ConditionGetInitial<T> {
  when(condition: Condition): ConditionGetDo<T>;
}

export interface ConditionGetDo<T> {
  /**
   * 조건이 참일 때 반환할 값 또는 실행할 함수를 지정합니다. (when 직후에는 do만 호출 가능)
   */
  do(action: ValueOrSupplier<T>): ConditionGetThen<T>;
}

export interface ConditionGetThen<T> {
  /**
   * 다음 조건을 추가합니다.
   */
  when(condition: Condition): ConditionGetDo<T>;
  /**
   * 모든 조건이 거짓일 때 반환할 기본값을 지정합니다.
   */
  other(action: ValueOrSupplier<T>): ConditionGetEnd<T>;
  /**
   * 조건을 순차 평가하여 일치하는 첫 번째 결과를 반환합니다.
   */
  get(): T | undefined;
}

export interface ConditionGetEnd<T> {
  /**
   * 조건을 순차 평가하여 일치하는 첫 번째 결과를 반환합니다.
   */
  get(): T | undefined;
}

/**
 * 모듈 레벨 공유 평가 함수 (길이 캐싱 및 구조분해 제거로 무할당 최적화)
 */
const evaluate = <T>(rules: Rule<T>[]): T | undefined => {
  for (let i = 0, len = rules.length; i < len; i++) {
    const rule = rules[i];
    const cond = rule[0];
    const isMatched = typeof cond === 'function' ? cond() : cond;
    if (isMatched) {
      const action = rule[1];
      return typeof action === 'function' ? (action as () => T)() : action;
    }
  }
  return undefined;
};

const createConditionGetChain = <T>(initialPending: Condition | null) => {
  const rules: Rule<T>[] = [];
  let pending: Condition | null = initialPending;

  const endStage: ConditionGetEnd<T> = {
    get(): T | undefined {
      return evaluate(rules);
    },
  };

  const thenStage: ConditionGetThen<T> = {
    when(cond: Condition): ConditionGetDo<T> {
      pending = cond;
      return doStage;
    },
    other(action: ValueOrSupplier<T>): ConditionGetEnd<T> {
      rules.push([true, action]);
      return endStage;
    },
    get(): T | undefined {
      return evaluate(rules);
    },
  };

  const doStage: ConditionGetDo<T> = {
    do(action: ValueOrSupplier<T>): ConditionGetThen<T> {
      if (pending !== null) {
        rules.push([pending, action]);
        pending = null;
      }
      return thenStage;
    },
  };

  return { doStage, thenStage };
};

/**
 * 조건부 분기 실행 유틸리티 (Type-State FSM & Memory-Optimized & Non-Thenable)
 *
 * 사용 예시:
 * 1) conditionGet.when(isAdmin).do('관리자').other('사용자').get();
 * 2) conditionGet<string>().when(a).do(() => 'A').other(() => 'B').get();
 */
export const conditionGet = <T = unknown>(
  initialCondition: Condition | null = null,
): ConditionGetInitial<T> => {
  const { thenStage } = createConditionGetChain<T>(initialCondition);

  return {
    when(cond: Condition): ConditionGetDo<T> {
      return thenStage.when(cond);
    },
  };
};

// 정적 진입점 제공 (Arrow Function)
conditionGet.when = <T = unknown>(cond: Condition): ConditionGetDo<T> => {
  const { doStage } = createConditionGetChain<T>(cond);
  return doStage;
};
