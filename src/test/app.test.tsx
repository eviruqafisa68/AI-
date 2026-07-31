import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, test } from 'vitest';
import HomePage from '../pages/HomePage';

test('renders the primary film workflow entry', () => {
  render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  );

  expect(
    screen.getByRole('heading', { name: /从一个想法/ }),
  ).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /开始创作/ })).toHaveAttribute(
    'href',
    '/projects/new',
  );
});
