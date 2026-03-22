'use client';

/**
 * useValidator hook
 * @returns
 */
export const useValidator = () => {
  const validators: Array<{ condition: boolean; message?: string }> = [];
  const validate = () => {
    return validators.every((item) => {
      if (item.condition) {
        if (item?.message) {
          throw new Error(item.message);
        }

        return false;
      }

      return true;
    });
  };
  const instance = {
    verification(condition: boolean, message?: string) {
      validators.push({ condition, message });

      return instance;
    },
    validate,
  };

  return {
    verification(condition: boolean, message?: string) {
      validators.push({ condition, message });

      return instance;
    },
  };
};
