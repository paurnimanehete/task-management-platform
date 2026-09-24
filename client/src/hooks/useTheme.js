import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { toggleTheme, setTheme } from '../features/theme/themeSlice';

export const useTheme = () => {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.theme.mode);

  const toggle = useCallback(() => {
    dispatch(toggleTheme());
  }, [dispatch]);

  const changeTheme = useCallback(
    (newTheme) => {
      dispatch(setTheme(newTheme));
    },
    [dispatch]
  );

  return {
    mode,
    isDark: mode === 'dark',
    toggleTheme: toggle,
    setTheme: changeTheme,
  };
};

export default useTheme;
