import { rootReducer } from '../services/store';

// Тестируем главный редьюсер приложения
describe('Тест rootReducer', () => {
  // Проверяем что все редьюсеры подключены правильно
  test('Должен содержать все редьюсеры', () => {
    // Получаем начальное состояние
    const initialState = rootReducer(undefined, { type: '@@INIT' });
    //type: '@@INIT' внутренний экшен Redux,
    //который имитирует инициализацию хранилища

    // Проверяем список подключенных редьюсеров
    expect(Object.keys(initialState)).toEqual([
      'user',
      'feed',
      'ingredients',
      'constructorBurger',
      'order',
      'auth'
    ]);
  });

  // реакция на неизвестный экшен
  test('Должен корректно обрабатывать неизвестный экшен', () => {
    // Создаем экшен с несуществующим типом
    const resultState = rootReducer(undefined, {
      type: 'UNKNOWN_ACTION_TYPE',
      payload: { test: true }
    });

    // Проверяем что состояние возвращается
    expect(resultState).toBeDefined();

    // Проверяем что ингредиенты в дефолтном состоянии
    expect(resultState.ingredients).toEqual({
      list: [],
      loading: false,
      errorMessage: null
    });
  });

  // Проверка 3: Начальные состояния
  test('Должен возвращать правильные начальные состояния', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });

    // Проверяем состояние конструктора
    expect(initialState.constructorBurger).toEqual({
      bun: null,
      ingredients: []
    });

    // Проверяем состояние заказов
    expect(initialState.order).toEqual({
      order: null,
      loading: false,
      error: null,
      userOrders: []
    });
  });
});
