import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import Outfits from './Outfits';
import axios from 'axios';
import { useAuth } from '../authContext';

jest.mock('../authContext');
jest.mock('axios');

describe('Outfits Component - Category Functionality', () => {
  beforeEach(() => {
    useAuth.mockReturnValue({ user: { userID: '12345' } });
  });

  it('fetches categories on mount and displays them', async () => {
    
    axios.get.mockResolvedValue({
      data: { data: [{ id: 1, name: 'Tops' }, { id: 2, name: 'Bottoms' }] },
    });

    const { getByText } = render(<Outfits />);

   
    await waitFor(() => {
      expect(getByText('Tops')).toBeTruthy();
      expect(getByText('Bottoms')).toBeTruthy();
    });
  });

  afterEach(() => {
    jest.clearAllMocks(); 
  });
});







