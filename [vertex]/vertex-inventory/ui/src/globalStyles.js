import { createGlobalStyle } from 'styled-components';
import Pricedown from 'fonts/pricedown.ttf';

const GlobalStyle = createGlobalStyle`
  /* Google Fonts'tan Geist import */
  @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100;200;300;400;500;600;700;800;900&display=swap');
  
  @font-face {
    font-family: 'Pricedown';
    src: url(${Pricedown});
  }
  
  /* Tüm sayfa için Geist font */
  * {
    font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
  }
  
  body {
    font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
  }
  
  /* Envanter component'leri için özel font */
  .inventory-container, .inventory-header, .slot, .weight-text {
    font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
  }
`;

export default GlobalStyle;
