export default function formatNumber(number){
  const formatter = Intl.NumberFormat('en', { notation: "compact", maximumFractionDigits:2 });
  return formatter.format(number);
}