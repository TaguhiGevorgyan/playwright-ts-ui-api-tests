import { join } from 'path';
import { readFileSync, existsSync } from 'fs';

// Simple function to load environment variables from config.env file
function loadEnvFile(filePath: string): void {
  try {
    if (existsSync(filePath)) {
      const content = readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine && !trimmedLine.startsWith('#')) {
          const [key, ...valueParts] = trimmedLine.split('=');
          if (key && valueParts.length > 0) {
            const value = valueParts.join('=').trim();
            if (!process.env[key]) {
              process.env[key] = value;
            }
          }
        }
      }
    }
  } catch (e) {
    console.warn('Failed to load config.env file:', e);
  }
}

// Load environment variables from config.env file
loadEnvFile(join(__dirname, '..', 'config.env'));

export interface TestConfig {
  urls: {
    base: string;
    homepage: string;
    productPage: string;
  };
  timeouts: {
    searchResults: number;
    pageLoad: number;
    itemAdd: number;
    basketNavigation: number;
    formFill: number;
  };
  testData: {
    userName: string;
    userPhone: string;
    userAddress: string;
  };
  search: {
    keywords: {
      pizza: string;
      sushi: string;
      tunaPizza: string;
      nonexistent: string;
      longQuery: string;
      specialChars: string;
      numbers: string;
      englishPizza: string;
      fieldPlaceholder: string;
    };
  };
  basket: {
    emptyMessages: {
      armenian: string;
      english: string;
      armenianAlt: string;
    };
    countZero: string;
    totalLabel: string;
    quantity: {
      inBasket1: string;
      inBasket1Alt: string;
      addToBasket: string;
    };
  };
  order: {
    confirmation: {
      armenian: string;
      english: string;
      englishAlt: string;
    };
    registration: {
      armenian: string;
      english: string;
      englishAlt: string;
    };
    formFields: {
      name: string;
      phone: string;
      address: string;
    };
    formFieldPlaceholders: {
      name: string;
      phone: string;
      address: string;
      nameArmenian: string;
      phoneArmenian: string;
      addressArmenian: string;
    };
  };
  navigation: {
    sale: {
      armenian: string;
      english: string;
      englishCapital: string;
    };
    logo: string;
  };
  locators: {
    basketIcon: string[];
    errorMessage: string[];
    saleLink: string[];
    saleText: string[];
    emptyBasketText: string[];
    orderRegistrationText: string[];
    confirmOrderButton: string[];
    addBasketButton: string[];
  };
  performance: {
    searchThreshold: number;
  };
}

// Helper function to get environment variable with fallback
function getEnvVar(key: string, fallback: string): string {
  return process.env[key] || fallback;
}

function getEnvVarNumber(key: string, fallback: number): number {
  const value = process.env[key];
  return value ? parseInt(value, 10) : fallback;
}

function getEnvVarArray(key: string, fallback: string[]): string[] {
  const value = process.env[key];
  return value ? value.split(',') : fallback;
}

// Export configuration object
export const testConfig: TestConfig = {
  urls: {
    base: getEnvVar('BASE_URL', 'https://sushimushi.am/'),
    homepage: getEnvVar('HOMEPAGE_URL', 'sushimushi.am'),
    productPage: getEnvVar('PRODUCT_PAGE_URL', 'sushimushi.am'),
  },
  timeouts: {
    searchResults: getEnvVarNumber('SEARCH_RESULTS_TIMEOUT', 2000),
    pageLoad: getEnvVarNumber('PAGE_LOAD_TIMEOUT', 2000),
    itemAdd: getEnvVarNumber('ITEM_ADD_TIMEOUT', 1000),
    basketNavigation: getEnvVarNumber('BASKET_NAVIGATION_TIMEOUT', 2000),
    formFill: getEnvVarNumber('FORM_FILL_TIMEOUT', 1000),
  },
  testData: {
    userName: getEnvVar('TEST_USER_NAME', 'Test User'),
    userPhone: getEnvVar('TEST_USER_PHONE', '+37412345678'),
    userAddress: getEnvVar('TEST_USER_ADDRESS', 'Test Address'),
  },
  search: {
    keywords: {
      pizza: getEnvVar('SEARCH_KEYWORD_PIZZA', 'պիցցա'),
      sushi: getEnvVar('SEARCH_KEYWORD_SUSHI', 'սուշի'),
      tunaPizza: getEnvVar('SEARCH_KEYWORD_TUNA_PIZZA', 'թունա պիցցա'),
      nonexistent: getEnvVar('SEARCH_KEYWORD_NONEXISTENT', 'nonexistentproduct12345'),
      longQuery: getEnvVar('SEARCH_KEYWORD_LONG_QUERY', 'այս շատ երկար որոնման հարցում է որը պետք է աշխատի'),
      specialChars: getEnvVar('SEARCH_KEYWORD_SPECIAL_CHARS', 'սուշի & պիցցա'),
      numbers: getEnvVar('SEARCH_KEYWORD_NUMBERS', '500'),
      englishPizza: getEnvVar('SEARCH_KEYWORD_ENGLISH_PIZZA', 'pizza'),
      fieldPlaceholder: getEnvVar('SEARCH_FIELD_PLACEHOLDER', 'պ'),
    },
  },
  basket: {
    emptyMessages: {
      armenian: getEnvVar('BASKET_EMPTY_MESSAGE_ARMENIAN', 'Ձեր զամբյուղը Դատարկ է'),
      english: getEnvVar('BASKET_EMPTY_MESSAGE_ENGLISH', 'Your basket is empty'),
      armenianAlt: getEnvVar('BASKET_EMPTY_MESSAGE_ARMENIAN_ALT', 'Զամբյուղը դատարկ է'),
    },
    countZero: getEnvVar('BASKET_COUNT_ZERO', '0'),
    totalLabel: getEnvVar('BASKET_TOTAL_LABEL', 'Ընդհանուր՝'),
    quantity: {
      inBasket1: getEnvVar('BASKET_QUANTITY_IN_BASKET_1', 'Զամբյուղում 1 հատ'),
      inBasket1Alt: getEnvVar('BASKET_QUANTITY_IN_BASKET_1_ALT', '1 հատ'),
      addToBasket: getEnvVar('BASKET_QUANTITY_ADD_TO_BASKET', 'Add to basket'),
    },
  },
  order: {
    confirmation: {
      armenian: getEnvVar('ORDER_CONFIRMATION_ARMENIAN', 'Հաստատել պատվերը'),
      english: getEnvVar('ORDER_CONFIRMATION_ENGLISH', 'Confirm order'),
      englishAlt: getEnvVar('ORDER_CONFIRMATION_ENGLISH_ALT', 'Submit order'),
    },
    registration: {
      armenian: getEnvVar('ORDER_REGISTRATION_ARMENIAN', 'Պատվերի գրանցում'),
      english: getEnvVar('ORDER_REGISTRATION_ENGLISH', 'Order registration'),
      englishAlt: getEnvVar('ORDER_REGISTRATION_ENGLISH_ALT', 'Order form'),
    },
    formFields: {
      name: getEnvVar('FORM_FIELD_NAME', 'name'),
      phone: getEnvVar('FORM_FIELD_PHONE', 'phone'),
      address: getEnvVar('FORM_FIELD_ADDRESS', 'address'),
    },
    formFieldPlaceholders: {
      name: getEnvVar('FORM_FIELD_PLACEHOLDER_NAME', 'name'),
      phone: getEnvVar('FORM_FIELD_PLACEHOLDER_PHONE', 'phone'),
      address: getEnvVar('FORM_FIELD_PLACEHOLDER_ADDRESS', 'address'),
      nameArmenian: getEnvVar('FORM_FIELD_PLACEHOLDER_NAME_ARMENIAN', 'անուն'),
      phoneArmenian: getEnvVar('FORM_FIELD_PLACEHOLDER_PHONE_ARMENIAN', 'հեռախոս'),
      addressArmenian: getEnvVar('FORM_FIELD_PLACEHOLDER_ADDRESS_ARMENIAN', 'հասցե'),
    },
  },
  navigation: {
    sale: {
      armenian: getEnvVar('SALE_ARMENIAN', 'զեղչ'),
      english: getEnvVar('SALE_ENGLISH', 'sale'),
      englishCapital: getEnvVar('SALE_ENGLISH_CAPITAL', 'Sale'),
    },
    logo: getEnvVar('LOGO_TEXT', 'Sushi Mushi'),
  },
  locators: {
    basketIcon: getEnvVarArray('CSS_BASKET_ICON', ['.cart-fixed-btn', '.cart-icon', '.basket-icon']),
    errorMessage: getEnvVarArray('CSS_ERROR_MESSAGE', ['.error-message', '.validation-error', '.required-field-error']),
    saleLink: getEnvVarArray('CSS_SALE_LINK', ['a:has-text("զեղչ")', 'a:has-text("sale")', 'a:has-text("Sale")']),
    saleText: getEnvVarArray('CSS_SALE_TEXT', ['text=/զեղչ|sale|Sale/']),
    emptyBasketText: getEnvVarArray('CSS_EMPTY_BASKET_TEXT', ['text=/Ձեր զամբյուղը Դատարկ է|Your basket is empty|Զամբյուղը դատարկ է/']),
    orderRegistrationText: getEnvVarArray('CSS_ORDER_REGISTRATION_TEXT', ['text=/Պատվերի գրանցում|Order registration|Order form/']),
    confirmOrderButton: getEnvVarArray('CSS_CONFIRM_ORDER_BUTTON', ['button:has-text("Հաստատել պատվերը")', 'button:has-text("Confirm order")', 'button:has-text("Submit order")']),
    addBasketButton: getEnvVarArray('CSS_ADD_BASKET_BUTTON', ['button:has-text("Զամբյուղում 1 հատ")', 'button:has-text("1 հատ")', 'button:has-text("Add to basket")']),
  },
  performance: {
    searchThreshold: getEnvVarNumber('SEARCH_PERFORMANCE_THRESHOLD', 10000),
  },
};

// Export individual sections for easier access
export const { urls, timeouts, testData, search, basket, order, navigation, locators, performance } = testConfig;

// Export default config
export default testConfig; 