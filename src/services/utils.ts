import type { Card, Size, Template } from "../types";

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

export const buildCardDetail = ({
  card,
  templates,
  sizes,
  sizeId = "md",
}: {
  card: Card;
  templates: Template[];
  sizes: Size[];
  sizeId?: string;
}) => {
  // Determine size and multiplier (Default to 'md' and 1 if sizeId is invalid or missing)
  const sizeInfo = sizes.find((s) => s.id === sizeId);
  const multiplier = sizeInfo?.priceMultiplier || 1;
  const sizeIdFinal = sizeInfo ? sizeId : "md";

  // Format available sizes
  const availableSizes = sizes
    .filter((s) => card.sizes.includes(s.id))
    .map((s) => ({ id: s.id, title: s.title }));

  // Map pages to include full template data
  const pages = card.pages.map((page) => {
    const template = templates.find((t) => t.id === page.templateId);
    return {
      title: page.title,
      width: template?.width || 0,
      height: template?.height || 0,
      imageUrl: template?.imageUrl || "",
    };
  });

  // Create the return object
  return {
    title: card.title,
    size: sizeIdFinal,
    availableSizes,
    imageUrl: pages[0]?.imageUrl || "",
    price: `£${((card.basePrice * multiplier) / 100).toFixed(2)}`,
    pages,
  };
};
