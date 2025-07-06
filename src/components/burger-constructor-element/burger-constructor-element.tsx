import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useAppDispatch } from '../../services/hooks';
import {
  removeIngredient,
  moveUpIngredientInList,
  moveDownIngredientInList
} from '../../services/slices/constructorBurgerSlice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useAppDispatch();

    // перемещаем элемент выше
    const handleMoveUp = () => {
      dispatch(moveUpIngredientInList(index));
    };

    // перемещаем элемент ниже
    const handleMoveDown = () => {
      dispatch(moveDownIngredientInList(index));
    };

    // удаляем элемент из списка
    const handleClose = () => {
      dispatch(removeIngredient(ingredient.id));
    };
    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
