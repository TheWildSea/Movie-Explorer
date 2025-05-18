import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Search from '@/components/Search';

test('calls onChange when typing in search input', () => {
  const handleChange = jest.fn();
  render(<Search query="" onChange={handleChange} onClear={() => {}} />);
  const input = screen.getByPlaceholderText(/search movies/i);

  fireEvent.change(input, { target: { value: 'batman' } });
  expect(handleChange).toHaveBeenCalled();
});