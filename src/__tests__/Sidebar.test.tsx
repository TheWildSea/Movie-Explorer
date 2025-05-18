import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from '@/components/Sidebar';

const genres = [
  { id: 1, name: 'Action' },
  { id: 2, name: 'Comedy' },
];

jest.mock('@/hooks/useGanres', () => ({
  useGenres: () => ({
    data: { genres },
    isLoading: false,
    error: null,
  }),
}));

test('genre filter calls onToggleGenre', () => {
  const onToggleGenre = jest.fn();
  render(
    <Sidebar
      sidebarOpen={true}
      selectedGenres={[]}
      onToggleGenre={onToggleGenre}
      handleGenreClear={() => {}}
    />
  );

  const actionGenre = screen.getByText('Action');
  fireEvent.click(actionGenre);
  expect(onToggleGenre).toHaveBeenCalledWith(1);
});