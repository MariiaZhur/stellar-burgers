import { RefObject } from 'react';
import { TIngredient, TTabMode } from '@utils-types';
import { InViewHookResponse } from 'react-intersection-observer';

export type BurgerIngredientsUIProps = {
  currentTab: TTabMode;
  buns: TIngredient[];
  mains: TIngredient[];
  sauces: TIngredient[];
  titleBunRef: RefObject<HTMLHeadingElement>;
  titleMainRef: RefObject<HTMLHeadingElement>;
  titleSaucesRef: RefObject<HTMLHeadingElement>;
  bunsRef: InViewHookResponse['ref'];
  mainsRef: InViewHookResponse['ref'];
  saucesRef: InViewHookResponse['ref'];
  onTabClick: (val: TTabMode) => void;
};
