'use client';

import { ValidatorType } from '@/types/base';

/**
 * useValidator hook
 * @returns
 */
export const useValidator = () => {
  /**
   * validate check
   * @param validators
   * @returns
   */
  const validate = (validators: Array<ValidatorType>) =>
    validators.every((valid) =>
      typeof valid === 'function' ? valid() : valid.validate(),
    );

  return {
    validate,
  };
};
