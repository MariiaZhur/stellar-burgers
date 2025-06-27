import { useState, useRef, useEffect, FC, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';

import { TIngredient, TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { Preloader } from '../ui/preloader';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { loadIngredients } from '../../services/slices/ingredientsSlice';

/** TODO: взять переменные из стора (done)*/
export const BurgerIngredients: FC = () => {
  const dispatch = useAppDispatch();

  // Получаем список ингредиентов и статус загрузки из Redux-хранилища
  const { list: ingredients, loading } = useAppSelector(
    (state) => state.ingredients
  );
  // const reduxState = useAppSelector((state) => state);
  // console.log(' Весь Redux state:', reduxState);
  // Активная вкладка (bun | main | sauce)
  const [activeTab, setActiveTab] = useState<TTabMode>('bun');

  // Ссылки на заголовки разделов (для прокрутки по вкладке)
  const titleRefs = {
    bun: useRef<HTMLHeadingElement>(null),
    main: useRef<HTMLHeadingElement>(null),
    sauce: useRef<HTMLHeadingElement>(null)
  };

  // Наблюдение за попаданием секций в область видимости (для автоматического переключения табов)
  const [bunRef, inViewBun] = useInView({ threshold: 0 });
  const [mainRef, inViewMain] = useInView({ threshold: 0 });
  const [sauceRef, inViewSauce] = useInView({ threshold: 0 });

  // Загружаем ингредиенты при первом монтировании, если ещё не загружены
  useEffect(() => {
    if (!ingredients.length) {
      dispatch(loadIngredients());
    }
  }, [dispatch, ingredients.length]);

  // Автоматическая смена активной вкладки при прокрутке разделов
  useEffect(() => {
    if (inViewBun) return setActiveTab('bun');
    if (inViewSauce) return setActiveTab('sauce');
    if (inViewMain) return setActiveTab('main');
  }, [inViewBun, inViewMain, inViewSauce]);

  // Отдельные массивы ингредиентов по типу, кэшируются через useMemo
  const buns = useMemo(
    () => ingredients.filter((item) => item.type === 'bun'),
    [ingredients]
  );
  const mains = useMemo(
    () => ingredients.filter((item) => item.type === 'main'),
    [ingredients]
  );
  const sauces = useMemo(
    () => ingredients.filter((item) => item.type === 'sauce'),
    [ingredients]
  );

  // Обработка нажатия на вкладку
  // прокрутка к нужному заголовку
  const handleTabClick = (tab: TTabMode) => {
    setActiveTab(tab);
    titleRefs[tab].current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Пока идёт загрузка данных — показываем прелоадер
  if (loading) return <Preloader />;

  // Основной рендер UI
  return (
    <BurgerIngredientsUI
      currentTab={activeTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleRefs.bun}
      titleMainRef={titleRefs.main}
      titleSaucesRef={titleRefs.sauce}
      bunsRef={bunRef}
      mainsRef={mainRef}
      saucesRef={sauceRef}
      onTabClick={handleTabClick}
    />
  );
};
