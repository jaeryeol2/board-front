export const condition = () => {
  let currentCondition!: () => boolean;
  const list: Array<{
    condition: () => boolean;
    action: () => void;
  }> = [];
  const execute = () => {
    for (const item of list) {
      if (item.condition?.()) {
        item.action();
        break;
      }
    }
  };
  const doInstance = {
    do(func: () => void) {
      list.push({
        condition: currentCondition,
        action: func,
      });

      return conditionInstance;
    },
  };
  const conditionInstance = {
    when(condition: (() => boolean) | boolean) {
      currentCondition =
        typeof condition === 'boolean' ? () => condition : condition;
      return doInstance;
    },
    other(func: () => void) {
      list.push({
        condition: () => true,
        action: func,
      });

      return { execute };
    },
    execute,
  };

  return {
    when(condition: (() => boolean) | boolean) {
      currentCondition =
        typeof condition === 'boolean' ? () => condition : condition;
      return doInstance;
    },
  };
};
