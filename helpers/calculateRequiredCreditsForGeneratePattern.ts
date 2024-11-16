export const calculateRequiredCreditsForGeneratePattern = (
  canvasSize: number,
  numberOfImages: number,
) => {
  const creditsAmount =
    canvasSize === 512
      ? numberOfImages * +process.env.NEXT_PUBLIC_IMG_GENERATION_COST!
      : numberOfImages * +process.env.NEXT_PUBLIC_IMG_GENERATION_COST! * 2;

  return creditsAmount;
};
