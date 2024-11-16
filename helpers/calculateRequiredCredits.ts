export const calculateRequiredCredits = ({
  user,
  amount,
}: {
  user: any;
  amount: number;
}) => {
  let deductedSubscriptionCredits = 0;
  let deductedPermanentCredit = 0;

  // Deduct credits from subscriptionCredits first
  if (user.subscriptionCredits >= amount) {
    deductedSubscriptionCredits = amount;
  } else {
    deductedSubscriptionCredits = user.subscriptionCredits;
    deductedPermanentCredit = amount - user.subscriptionCredits;
  }

  return { deductedSubscriptionCredits, deductedPermanentCredit };
};
