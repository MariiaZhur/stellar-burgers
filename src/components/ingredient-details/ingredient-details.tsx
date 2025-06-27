import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../services/hooks';
import { selectAllIngredients, selectIngredientsLoading } from '@selectors';

export const IngredientDetails: FC = () => {
  const { id } = useParams();
  const ingredients = useAppSelector(selectAllIngredients);
  const loading = useAppSelector(selectIngredientsLoading);

  const ingredientData = ingredients.find((item) => item._id === id) || null;

  // Показываем прелоадер пока идёт загрузка или пока нет данных
  if (loading || !ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
