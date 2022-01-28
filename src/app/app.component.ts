import { Component, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { MatRadioButton, MatRadioChange } from '@angular/material/radio';

type ProductProperties = {
  [key: string]: number;
};

type ProductPropertiesReadable = {
  [key: string]: string;
};

interface SearchResult {
  title: string;
  manufacturer: string;
  imageUrl: string;
  properties: ProductProperties;
}

interface FormattedSearchResult extends SearchResult {
  propertiesReadable: ProductPropertiesReadable;
  average: number;
  averageReadable: string;
}

const imageWidth = '200';

const imageHeight = '200';

const properties: string[] = [
  'Einbruchhemmung (Klasse)',
  'Profilmaterial',
  'Öffnungsarten',
  'Glasaufbau',
  'Bewertetes Schalldämmmaß - Rw (dB)',
  'Schlagregendichtheit (Klasse)',
];

const mockData: SearchResult[] = [
  {
    title: 'AWS 90 VV.SI+',
    manufacturer: 'SCHÜCO',
    imageUrl: `https://files.api.plan.one/v1/images/8a49e3ce-888e-4f63-88a7-229eea02cbf3?quality=80&background=white&mode=PAD&width=${imageWidth}&height=${imageHeight}`,
    properties: {
      'Einbruchhemmung (Klasse)': 30,
      Profilmaterial: 62,
      'Bewertetes Schalldämmmaß - Rw (dB)': 90,
      'Schlagregendichtheit (Klasse)': 48,
    },
  },
  {
    title: 'TA35 VB',
    manufacturer: 'batimet',
    imageUrl: `https://files.api.plan.one/v1/images/83086159-c049-4736-894d-2bf56b55617e?quality=80&background=white&mode=PAD&width=${imageWidth}&height=${imageHeight}`,
    properties: {
      'Einbruchhemmung (Klasse)': 42,
      Profilmaterial: 12,
      Öffnungsarten: 73,
    },
  },
  {
    title: 'AWS 75 VV.SI+',
    manufacturer: 'SCHÜCO',
    imageUrl: `https://files.api.plan.one/v1/images/68705794-a516-4d97-97bc-2b6e5efbcdb5?quality=80&background=white&mode=PAD&width=${imageWidth}&height=${imageHeight}`,
    properties: {
      Profilmaterial: 38,
      Öffnungsarten: 72,
      Glasaufbau: 65,
      'Schlagregendichtheit (Klasse)': 52,
    },
  },
  {
    title: 'MB-Slimline',
    manufacturer: 'Aluprof',
    imageUrl: `https://files.api.plan.one/v1/images/c06b5bf1-85f5-45e6-8356-df75851a196b?quality=80&background=white&mode=PAD&width=${imageWidth}&height=${imageHeight}`,
    properties: {
      'Einbruchhemmung (Klasse)': 87,
      Profilmaterial: 42,
      Öffnungsarten: 77,
      Glasaufbau: 21,
      'Bewertetes Schalldämmmaß - Rw (dB)': 49,
      'Schlagregendichtheit (Klasse)': 24,
    },
  },
  {
    title: 'Ideal 4000® NL',
    manufacturer: 'aluplast',
    imageUrl: `https://files.api.plan.one/v1/images/56c0795c-214f-4914-aeb3-eb0df3bf785d?quality=80&background=white&mode=PAD&width=${imageWidth}&height=${imageHeight}`,
    properties: {
      'Einbruchhemmung (Klasse)': 93,
      Profilmaterial: 100,
      Glasaufbau: 59,
      'Bewertetes Schalldämmmaß - Rw (dB)': 32,
      'Schlagregendichtheit (Klasse)': 4,
    },
  },
];

const sortSearchResults = (priority: string = 'none') => {
  let sortedSearchResults: FormattedSearchResult[] = [];

  if (priority !== 'none') {
    sortedSearchResults = _.sortBy(formattedSearchResults, [
      (searchResult: FormattedSearchResult) => {
        return searchResult.properties[priority];
      },
      (searchResult: FormattedSearchResult) => {
        return searchResult.average;
      },
    ]).reverse();
  } else {
    sortedSearchResults = _.sortBy(formattedSearchResults, [
      (searchResult: FormattedSearchResult) => {
        return searchResult.average;
      },
    ]).reverse();
  }

  return sortedSearchResults;
};

const formattedSearchResults: FormattedSearchResult[] = mockData.map(
  (result: SearchResult) => {
    const { properties: searchResultProperties, ...rest } = result;

    const values: number[] = Object.entries(searchResultProperties).map(
      ([key, value]) => {
        return value;
      }
    );

    const sum = values.reduce((subTotal, value) => subTotal + value, 0);

    const average: number = sum / properties.length;

    const averageReadable = new Intl.NumberFormat('de-DE', {
      style: 'percent',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(average / 100);

    let propertiesReadable: ProductPropertiesReadable = {};
    let cleanedSearchResultProperties: ProductProperties = {};

    properties.forEach((property) => {
      const propertyValue = searchResultProperties[property]
        ? searchResultProperties[property] / 100
        : 0;

      const propertyValueReadable = new Intl.NumberFormat('de-DE', {
        style: 'percent',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(propertyValue);

      cleanedSearchResultProperties = {
        ...cleanedSearchResultProperties,
        [property]: searchResultProperties[property]
          ? searchResultProperties[property]
          : 0,
      };

      propertiesReadable = {
        ...propertiesReadable,
        [property]: propertyValueReadable,
      };
    });

    return {
      ...rest,
      properties: cleanedSearchResultProperties,
      propertiesReadable,
      average,
      averageReadable,
    };
  }
);

sortSearchResults();

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  title = 'Search Result Matching';
  properties = properties;
  searchResults = sortSearchResults();
  priority = 'none';

  onChange(mrChange: MatRadioChange) {
    this.searchResults = sortSearchResults(mrChange.value);
    this.priority = mrChange.value;
  }
}
