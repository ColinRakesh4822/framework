import { createGlobalStyle } from 'styled-components';
import Pricedown from 'fonts/pricedown.ttf';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800;900&family=Oswald:wght@300;400;500;600;700&display=swap');

  @font-face {
    font-family: 'Pricedown';
    src: url(${Pricedown});
  }
`;

export default GlobalStyle;

