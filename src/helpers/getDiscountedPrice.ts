export const getDiscountedPrice = (ageAtCampStart: number, basePrice: number) => {
  console.log(ageAtCampStart);
  
  if (ageAtCampStart < 2) return 0;
  if (ageAtCampStart <= 6) return Math.round(basePrice * 0.5);
  
  return basePrice; 
};