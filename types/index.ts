/**
 * Shared TypeScript interfaces for the Kisan Seva app.
 * Import these instead of using `any` in useState and render functions.
 */

/** Weather data returned from OpenWeatherMap API (processed) */
export interface WeatherData {
  location: string;
  temperature: string;
  condition: string;
  humidity: string;
  windSpeed: string;
  iconName: string;
}

/** A news article from the GNews API */
export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  image?: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

/** A product listed on the marketplace */
export interface Product {
  id: string;
  name: string;
  price: string;
  quantity: string;
  image: string;
}

/** A featured product shown on the buyer dashboard */
export interface FeaturedProduct {
  id: string;
  name: string;
  price: string;
  seller: string;
  icon: string;
}

/** A government subsidy scheme */
export interface Subsidy {
  id: string;
  title: string;
  description: string;
  eligibility: string;
  link: string;
}
