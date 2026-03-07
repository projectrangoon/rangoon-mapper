import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import AutoComplete from '@/components/route/AutoComplete';
import type { BusStop, UniqueStop } from '@/types';

const stop: BusStop = {
  bus_stop_id: 1,
  lat: 16.8,
  lng: 96.1,
  name_en: 'Sule Square',
  name_mm: 'ဆူးလေ',
  road_en: 'Maha Bandula Road',
  road_mm: 'မဟာဗန္ဓုလလမ်း',
  township_en: 'Kyauktada',
  township_mm: 'ကျောက်တံတား',
  services: [{ service_name: 1, color: '#fff', sequence: 1 }],
};

describe('AutoComplete', () => {
  it('clears the input when the selected stop is removed externally', () => {
    const { rerender } = render(
      <AutoComplete
        label="From"
        variant="start"
        stops={[stop as UniqueStop]}
        selectedStop={stop}
        routePlanned={false}
        onSelect={() => undefined}
      />,
    );

    expect(screen.getByDisplayValue('Sule Square')).toBeInTheDocument();

    rerender(
      <AutoComplete
        label="From"
        variant="start"
        stops={[stop as UniqueStop]}
        selectedStop={null}
        routePlanned={false}
        onSelect={() => undefined}
      />,
    );

    expect(screen.getByPlaceholderText('Search bus stop')).toHaveValue('');
  });

  it('clears via the x button and calls onSelect with null', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <AutoComplete
        label="From"
        variant="start"
        stops={[stop as UniqueStop]}
        selectedStop={stop}
        routePlanned={false}
        onSelect={onSelect}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Clear From' }));

    expect(screen.getByPlaceholderText('Search bus stop')).toHaveValue('');
    expect(onSelect).toHaveBeenCalledWith(null);
  });
});
