export const generateBillingPeriods = () => {
  const periods: { value: string; label: string }[] = [];

  for (let i = 0; i < 12; i++) {
    const date = new Date(2025, i + 7, 1);

    const year = date.getFullYear();
    // Format month for the 'value' (e.g., "2025-08")
    const monthValue = (date.getMonth() + 1).toString().padStart(2, "0");

    // Format a human-readable label (e.g., "August 2025")
    const monthLabel = date.toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });

    periods.push({
      value: `${year}-${monthValue}`,
      label: monthLabel,
    });
  }
  return periods;
};
