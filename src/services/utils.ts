import { Card, Template } from "../types";

export const transformToCardsList = (cards: Card[], templates: Template[]) => {
  return cards.map((card) => {
    const frontPageTemplate = templates.find(
      (template) => template.id === card.pages[0]?.templateId,
    );

    return {
      title: card.title,
      imageUrl: frontPageTemplate?.imageUrl || "",
      url: `/cards/${card.id}`,
    };
  });
};
