type Condition = () => boolean;
type Action = () => void;
type Rule = [Condition, Action];

export interface ConditionInitial {
  when(condition: Condition): ConditionDo;
}

export interface ConditionDo {
  /**
   * 조건이 참일 때 실행할 액션을 지정합니다. (when 직후에는 do만 호출 가능)
   */
  do(action: Action): ConditionThen;
}

export interface ConditionThen {
  /**
   * 다음 조건을 추가합니다.
   */
  when(condition: Condition): ConditionDo;
  /**
   * 모든 조건이 거짓일 때 실행할 기본 액션을 지정합니다.
   */
  other(action: Action): ConditionEnd;
  /**
   * 조건을 순차 평가하여 일치하는 첫 번째 액션을 실행합니다.
   */
  execute(): void;
}

export interface ConditionEnd {
  /**
   * 조건을 순차 평가하여 일치하는 첫 번째 액션을 실행합니다.
   */
  execute(): void;
}

/**
 * 모듈 레벨 공유 실행 함수 (길이 캐싱 및 구조분해 제거로 무할당 최적화)
 */
const run = (rules: Rule[]): void => {
  for (let i = 0, len = rules.length; i < len; i++) {
    const rule = rules[i];
    if (rule[0]()) {
      rule[1]();
      break;
    }
  }
};

const createConditionChain = (initialPending: Condition | null) => {
  const rules: Rule[] = [];
  let pending: Condition | null = initialPending;

  const endStage: ConditionEnd = {
    execute(): void {
      run(rules);
    },
  };

  const thenStage: ConditionThen = {
    when(cond: Condition): ConditionDo {
      pending = cond;
      return doStage;
    },
    other(action: Action): ConditionEnd {
      rules.push([() => true, action]);
      return endStage;
    },
    execute(): void {
      run(rules);
    },
  };

  const doStage: ConditionDo = {
    do(action: Action): ConditionThen {
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
 * 조건부 액션 실행 유틸리티 (Type-State FSM & Memory-Optimized & Non-Thenable)
 *
 * 사용 예시:
 * 1) condition.when(() => isSuccess).do(() => alert('성공')).other(() => alert('실패')).execute();
 * 2) condition().when(() => a).do(() => fnA()).other(() => fnB()).execute();
 */
export const condition = (
  initialCondition: Condition | null = null,
): ConditionInitial => {
  const { thenStage } = createConditionChain(initialCondition);

  return {
    when(cond: Condition): ConditionDo {
      return thenStage.when(cond);
    },
  };
};

// 정적 진입점 제공 (Arrow Function)
condition.when = (cond: Condition): ConditionDo => {
  const { doStage } = createConditionChain(cond);
  return doStage;
};
