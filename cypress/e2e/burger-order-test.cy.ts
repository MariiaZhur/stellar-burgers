import { selectors } from '../support/selectors';

describe('Оформление заказа и очистка конструктора', () => {
  beforeEach(() => {
    // Моки для ингредиентов, пользователя и заказа
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as(
      'loadIngredients'
    );
    cy.intercept('GET', '**/auth/user', { fixture: 'fake-user.json' }).as(
      'getUser'
    );
    cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );

    // Авторизация
    cy.setCookie('accessToken', 'test-space-token');

    // Заход на страницу
    cy.visit('/');
    cy.wait('@loadIngredients');
    cy.wait('@getUser');
  });

  it('оформляет заказ и показывает номер', () => {
    // Добавляем булку и начинку
    cy.get(selectors.addBunButton).children('button').click();
    cy.get(selectors.addMainButton).children('button').click();

    // Кликаем "Оформить заказ"
    cy.get(selectors.orderButton).click();

    // Проверяем модалку и номер заказа
    cy.wait('@createOrder');
    cy.get(selectors.modal).should('exist');
    cy.contains('121121').should('exist');
  });

  it('закрывает модалку заказа и очищает бургер', () => {
    // Добавляем ингредиенты и оформляем
    cy.get(selectors.addBunButton).children('button').click();
    cy.get(selectors.addMainButton).children('button').click();
    cy.get(selectors.orderButton).click();
    cy.wait('@createOrder');
    cy.get(selectors.modal).should('exist');

    // Закрываем модалку
    cy.get(selectors.modalClose).click();

    // Проверяем, что закрылась
    cy.get(selectors.modal).should('not.exist');

    // Проверяем, что бургер пуст
    cy.get(selectors.constructorArea).should('not.contain', selectors.bunName);
    cy.get(selectors.constructorArea).should('not.contain', selectors.mainName);
  });
});
