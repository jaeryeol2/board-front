export const conditionGet = <T>() => {
  let currentCondition!: () => boolean;
  const list: Array<{
    condition: () => boolean;
    action: () => T;
  }> = [];
  const get = () => {
    for (const item of list) {
      if (item.condition?.()) {
        return item.action();
      }
    }

    return undefined;
  };
  const doInstance = {
    do(func: () => T) {
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
    other(func: () => T) {
      list.push({
        condition: () => true,
        action: func,
      });

      return { get };
    },
    get,
  };

  return {
    when(condition: (() => boolean) | boolean) {
      currentCondition =
        typeof condition === 'boolean' ? () => condition : condition;
      return doInstance;
    },
  };
};
