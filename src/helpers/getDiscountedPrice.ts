export const getDiscountedPrice = (age: number, basePrice: number) => {
  if (age < 2) return 0;
  if (age <= 6) return Math.round(basePrice * 0.5);
  
  return basePrice; 
};