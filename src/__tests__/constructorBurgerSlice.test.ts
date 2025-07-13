// Тестируем редьюсер constructorBurgerSlice (сборка бургера)
// Покрываем основные действия (добавление, удаление, перемещение, очистка)

import constructorReducer, {
  addBun,
  addIngredient,
  removeIngredient,
  moveUpIngredientInList,
  moveDownIngredientInList,
  clearConstructor
} from '../services/slices/constructorBurgerSlice';

import { bunMock, sauceMock, mainMock } from '../__mocks__/ingredientsMock';

// ==== вынесенные повторяющиеся состояния для дальнейших тестов ====
const emptyConstructor = {
  bun: null,
  ingredients: []
};

const filledConstructor = {
  bun: bunMock,
  ingredients: [mainMock, sauceMock]
};

describe('[constructorBurgerSlice] Тесты логики конструктора бургера', () => {
  test('добавляет bun в конструктор', () => {
    const initialState = { bun: null, ingredients: [] };

    const result = constructorReducer(initialState, addBun(bunMock));

    // Проверяем что булка добавлена, начинка осталась пустой
    expect(result.bun).toEqual(bunMock); // toEqual() сравнивает содержимое объектов
    expect(result.ingredients).toEqual([]);
  });

  test('добавляем ингредиент в список начинок', () => {
    const initialState = emptyConstructor;

    const result = constructorReducer(initialState, addIngredient(mainMock));

    // Ожидаем что один ингредиент добавлен
    expect(result.ingredients).toHaveLength(1);
    //toHaveLength() - проверяем что у массива длина ровно ()
    expect(result.ingredients[0]).toEqual(mainMock);
    // проверяем что первый элемент в массиве ingredients [0]
    //  — точно такой же, как мок ингредиента mainMock.
  });

  test('удаляем ингредиент по уникальному id', () => {
    const initialState = {
      bun: null,
      ingredients: [mainMock, sauceMock]
    };

    const result = constructorReducer(
      initialState,
      removeIngredient(sauceMock.id)
    );

    // Ожидаем что sauceMock удалён, остался только mainMock
    expect(result.ingredients).toHaveLength(1);
    expect(result.ingredients[0]).toEqual(mainMock);
  });

  test('перемещает ингредиент вверх по списку', () => {
    const initialState = {
      bun: null,
      ingredients: [mainMock, sauceMock]
    };

    const result = constructorReducer(initialState, moveUpIngredientInList(1));

    // sauceMock должен оказаться на первом месте
    expect(result.ingredients[0]).toEqual(sauceMock);
    expect(result.ingredients[1]).toEqual(mainMock);
  });

  test('перемещает ингредиент вниз по списку', () => {
    const initialState = {
      bun: null,
      ingredients: [sauceMock, mainMock]
    };

    const result = constructorReducer(
      initialState,
      moveDownIngredientInList(0)
    );

    // mainMock должен быть теперь первым
    expect(result.ingredients[0]).toEqual(mainMock);
    expect(result.ingredients[1]).toEqual(sauceMock);
  });

  test('очищает весь конструктор (булку и ингредиенты)', () => {
    const initialState = filledConstructor;

    const result = constructorReducer(initialState, clearConstructor());

    // Проверяем что всё сброшено
    expect(result.bun).toBeNull();
    expect(result.ingredients).toEqual([]);
  });
});
