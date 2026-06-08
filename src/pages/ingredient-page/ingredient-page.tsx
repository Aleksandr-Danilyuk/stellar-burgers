import { FC } from 'react';
import { IngredientDetails } from '@components';
import styles from './ingredient-page.module.css';

export const IngredientPage: FC = () => (
  <main className={styles.container}>
    <h1 className={`${styles.title} text text_type_main-large mb-6`}>
      Детали ингредиента
    </h1>
    <IngredientDetails />
  </main>
);
