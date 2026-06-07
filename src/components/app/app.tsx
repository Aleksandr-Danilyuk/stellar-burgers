import {
  ConstructorPage,
  Feed,
  IngredientPage,
  WrapperPage,
  NotFound404
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader } from '@components';
import { Preloader } from '@ui';

import { useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import {
  fetchIngredientsThunk,
  getIngredients,
  getIngredientsLoading,
  getIngredientsError
} from '../../services/slices/ingredientsSlice';

import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { OrderInfo } from '../order-info';
import { Modal } from '../modal';
import { IngredientDetails } from '../ingredient-details';
import { Login } from '../../pages/login';
import { Register } from '../../pages/register';
import { ForgotPassword } from '../../pages/forgot-password';
import { ResetPassword } from '../../pages/reset-password';
import { Profile } from '../../pages/profile';
import { ProfileOrders } from '../../pages/profile-orders';
import { ProtectedRoute } from '../protected-route/protected-route'; // импорт защищённого маршрута

const App = () => {
  /** TODO: взять переменные из стора */
  //const isIngredientsLoading = false;
  //const ingredients = [];
  //const error = null;
  const dispatch = useDispatch();
  const isIngredientsLoading = useSelector(getIngredientsLoading);
  const ingredients = useSelector(getIngredients);
  const error = useSelector(getIngredientsError);

  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state as { background?: Location };

  useEffect(() => {
    dispatch(fetchIngredientsThunk());
  }, [dispatch]);

  const closeModal = () => {
    navigate(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      {isIngredientsLoading ? (
        <Preloader />
      ) : error ? (
        <div className={`${styles.error} text text_type_main-medium pt-4`}>
          {error}
        </div>
      ) : ingredients.length > 0 ? (
        <>
          <Routes location={background?.background || location}>
            <Route path='/' element={<ConstructorPage />} />
            <Route path='/feed' element={<Feed />} />
            <Route
              path='/feed/:number'
              element={
                <Modal title='' onClose={closeModal}>
                  <OrderInfo />
                </Modal>
              }
            />
            {/* <Route path='/ingredients/:id' element={<IngredientPage />} /> */}
            <Route
              path='/ingredients/:id'
              element={
                <WrapperPage>
                  <IngredientPage />
                </WrapperPage>
              }
            />
            {/* Защищённые маршруты */}
            <Route
              path='/login'
              element={
                <ProtectedRoute onlyUnAuth>
                  <Login />
                </ProtectedRoute>
              }
            />
            <Route
              path='/register'
              element={
                <ProtectedRoute>
                  <Register />
                </ProtectedRoute>
              }
            />
            <Route
              path='/forgot-password'
              element={
                <ProtectedRoute>
                  <ForgotPassword />
                </ProtectedRoute>
              }
            />
            <Route
              path='/reset-password'
              element={
                <ProtectedRoute>
                  <ResetPassword />
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile'
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile/orders'
              element={
                <ProtectedRoute>
                  <ProfileOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile/orders/:number'
              element={
                <ProtectedRoute>
                  <Modal title='' onClose={closeModal}>
                    <OrderInfo />
                  </Modal>
                </ProtectedRoute>
              }
            />
            {/* Страница 404 */}
            <Route path='*' element={<NotFound404 />} />
          </Routes>
          {background?.background && (
            <Routes>
              <Route
                path='/feed/:number'
                element={
                  <Modal title='Детали feed' onClose={closeModal}>
                    <OrderInfo />
                  </Modal>
                }
              />
              <Route
                path='/ingredients/:id'
                element={
                  <Modal title='Детали ингредиента' onClose={closeModal}>
                    <IngredientDetails />
                  </Modal>
                }
              />
            </Routes>
          )}
        </>
      ) : (
        <div className={`${styles.title} text text_type_main-medium pt-4`}>
          Нет игредиентов
        </div>
      )}
    </div>
  );
};

export default App;
