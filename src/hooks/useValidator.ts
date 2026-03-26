'use client';

/**
 * useValidator hook
 * @returns
 */
export const useValidator = () => {
  const validators: Array<{ condition: () => boolean; message?: string }> = [];
  const validate = () => {
    return validators.every((item) => {
      if (item.condition?.()) {
        if (item?.message) {
          throw new Error(item.message);
        }

        return false;
      }

      return true;
    });
  };
  const instance = {
    verification(condition: (() => boolean) | boolean, message?: string) {
      validators.push({
        condition: typeof condition === 'boolean' ? () => condition : condition,
        message,
      });

      return instance;
    },
    validate,
  };

  return {
    validator: {
      verification(condition: (() => boolean) | boolean, message?: string) {
        validators.push({
          condition:
            typeof condition === 'boolean' ? () => condition : condition,
          message,
        });

        return instance;
      },
    },
  };
};
