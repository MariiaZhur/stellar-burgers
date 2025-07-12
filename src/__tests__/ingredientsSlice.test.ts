import { ingredientsApiMock } from '../__mocks__/ingredientsApiMock';
import ingredientsReducer, {
  loadIngredients
} from '../services/slices/ingredientsSlice';
describe('[INGREDIENTS_SLICE] поведение при разных состояниях запроса ингредиентов', () => {
  test('начало загрузки ингредиентов (loading должен стать true)', () => {
    // создаём стартовое состояние с false
    const stateBefore = {
      list: [],
      loading: false,
      errorMessage: null
    };

    // применяем pending action, как будто начался запрос
    const result = ingredientsReducer(stateBefore, {
      type: loadIngredients.pending.type
    });

    // начинаем загрузку и показываем спиннер, сбрасываем старую ошибку
    expect(result.loading).toBe(true);
    expect(result.errorMessage).toBeNull();
  });

  test('успешная загрузка ингредиентов — данные в list, loading false', () => {
    const stateBefore = {
      list: [],
      loading: true,
      errorMessage: null
    };

    // action с payload — передаём моковые данные
    const result = ingredientsReducer(stateBefore, {
      type: loadIngredients.fulfilled.type,
      payload: ingredientsApiMock
    });

    // После успешного получения ингредиентов флаг загрузки сбрасывается,
    // список ингредиентов обновляется из моков в ингридиент мок
    expect(result.loading).toBe(false);
    expect(result.list).toEqual(ingredientsApiMock);
  });

  test('ошибка при загрузке — loading false и появляется сообщение об ошибке', () => {
    const stateBefore = {
      list: [],
      loading: true,
      errorMessage: null
    };

    const error = 'Сервер обиделся и не отвечает';

    const result = ingredientsReducer(stateBefore, {
      type: loadIngredients.rejected.type,
      payload: error
    });

    expect(result.loading).toBe(false); // загрузка остановлена
    expect(result.errorMessage).toBe(error); // записали ошибку
  });
});
