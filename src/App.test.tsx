import { render, screen } from '@testing-library/react';

import App from '@/App';

describe('App scaffold', () => {
  it('renders scaffold heading', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Rangoon Mapper' })).toBeInTheDocument();
  });
});
