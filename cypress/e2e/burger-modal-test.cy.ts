import { selectors } from '../support/selectors';

describe('Модальное окно ингредиента', () => {
  beforeEach(() => {
    // Подключаем наши моки
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as(
      'loadIngredients'
    );
    cy.intercept('GET', '**/auth/user', { fixture: 'fake-user.json' }).as(
      'getUser'
    );

    // Авторизация
    cy.setCookie('accessToken', 'test-space-token');

    // Открываем страницу
    cy.visit('/');
    cy.wait('@loadIngredients');
    cy.wait('@getUser');
  });

  it('открывает модалку при клике на ингредиент', () => {
    // Кликаем по ингредиенту
    cy.contains(selectors.bunName).click();

    // Проверяем, что модалка появилась
    cy.get(selectors.modal).should('exist');
  });

  it('закрывает модалку по кнопке крестика', () => {
    // Открываем модалку
    cy.contains(selectors.mainName).click();

    // Закрываем
    cy.get(selectors.modalClose).click();

    // Проверяем что исчезла
    cy.get(selectors.modal).should('not.exist');
  });

  it('закрывает модалку по фону', () => {
    // Открываем
    cy.contains(selectors.sauceName).click();

    // Кликаем по оверлею
    cy.get(selectors.modalCloseOverlay).click({ force: true });

    // Проверяем что закрылась
    cy.get(selectors.modal).should('not.exist');
  });
});
