import '@testing-library/jest-dom'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import Home from '../src/app/page'
 
global.fetch = jest.fn();

console.error = jest.fn();

describe('Composant Home', () => {
    beforeEach(() => {
      fetch.mockClear();
    });
  
    test('Affiche l\'interface correctement', () => {
      render(<Home />);
      
      expect(screen.getByText('Entrez votre prenom ci-dessous')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Entrez votre prénom')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Envoyer' })).toBeInTheDocument();
      
      expect(screen.queryByText(/Bonjour/)).not.toBeInTheDocument();
    });
    
    test('Permet de saisir un prénom dans le champ de texte', () => {
      render(<Home />);
      
      const inputElement = screen.getByPlaceholderText('Entrez votre prénom');
      fireEvent.change(inputElement, { target: { value: 'Antoine' } });
      
      expect(inputElement.value).toBe('Antoine');
    });
    
    test('Affiche le message après avoir cliqué sur le bouton', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Bonjour Antoine !' }),
      });
      
      render(<Home />);
      
      const inputElement = screen.getByPlaceholderText('Entrez votre prénom');
      fireEvent.change(inputElement, { target: { value: 'Antoine' } });
      
      const buttonElement = screen.getByRole('button', { name: 'Envoyer' });
      fireEvent.click(buttonElement);
      
      await waitFor(() => {
        expect(screen.getByText('Bonjour Antoine !')).toBeInTheDocument();
      });
      
      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/bonjour?prenom=Antoine');
    });

    test('Affiche un message d\'erreur si la réponse API n\'est pas ok', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Not found' }),
      });
      
      render(<Home />);
      
      const inputElement = screen.getByPlaceholderText('Entrez votre prénom');
      fireEvent.change(inputElement, { target: { value: 'Antoine' } });
      
      const buttonElement = screen.getByRole('button', { name: 'Envoyer' });
      fireEvent.click(buttonElement);
      
      await waitFor(() => {
        expect(screen.getByText('Erreur lors de la récupération du message')).toBeInTheDocument();
      });
    });
    
    test('Affiche un message d\'erreur si fetch échoue', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));
      
      render(<Home />);
      
      const inputElement = screen.getByPlaceholderText('Entrez votre prénom');
      fireEvent.change(inputElement, { target: { value: 'Antoine' } });
      
      const buttonElement = screen.getByRole('button', { name: 'Envoyer' });
      fireEvent.click(buttonElement);
      
      await waitFor(() => {
        expect(screen.getByText('Erreur lors de la requête API')).toBeInTheDocument();
      });
      
      expect(console.error).toHaveBeenCalled();
    });
  });