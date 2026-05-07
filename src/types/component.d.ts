import { ImageProps as NextImageProps } from 'next/image';
import Link from 'next/link';
import { ComponentPropsWithoutRef, ComponentPropsWithRef } from 'react';
import { ChildrenType } from './base';

type BaseInputPropsWithRef = Omit<ComponentPropsWithRef<'input'>, 'type'>;
type BaseInputPropsWithoutRef = Omit<ComponentPropsWithoutRef<'input'>, 'type'>;

export interface LinkProps
  extends Omit<ComponentPropsWithRef<typeof Link>, 'href'>, ChildrenType {
  href: string;
}
/** text props type */
export interface TextProps extends BaseInputPropsWithRef {
  label?: string;
}
/** email props type */
export interface EmailProps extends BaseInputPropsWithRef {
  label?: string;
}
/** password props type witout ref */
export interface PasswordProps extends BaseInputPropsWithoutRef {
  label?: string;
}
/** number component props type */
export interface NumericProps extends BaseInputPropsWithRef {}
/** radio props type */
export interface RadioProps extends BaseInputPropsWithRef {}
/** checkbox component props type */
export interface CheckboxProps extends BaseInputPropsWithRef {}
/** file input props type */
export interface FileInputProps extends BaseInputPropsWithRef {}

/** button component props type */
export interface ButtonProps extends Omit<
  ComponentPropsWithRef<'button'>,
  'type'
> {}
/** selectbox props type */
export interface SelectProps extends ComponentPropsWithRef<'select'> {
  startAll?: boolean;
  options: Array<{
    label: string;
    value: string;
    disabled?: boolean;
  }>;
}
/** image props type */
export interface ImageProps extends NextImageProps {}

export interface TextareaProps extends ComponentPropsWithRef<'textarea'> {
  label?: string;
}
