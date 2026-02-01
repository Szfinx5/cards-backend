import type { Card, Size, Template } from "../types";

const dataURL = "https://moonpig.github.io/tech-test-node-backend";

const fetchData = async (endpoint: string) => {
  const response = await fetch(`${dataURL}/${endpoint}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch data from ${endpoint}`);
  }
  return response.json();
};

export const fetchCardsData = async (): Promise<Card[]> => {
  return fetchData("cards.json");
};

export const fetchTemplateData = async (): Promise<Template[]> => {
  return fetchData("templates.json");
};

export const fetchSizeData = async (): Promise<Size[]> => {
  return fetchData("sizes.json");
};
