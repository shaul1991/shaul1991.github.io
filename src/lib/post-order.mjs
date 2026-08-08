export function comparePostsNewestFirst(a, b) {
  const dateDifference = b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf();
  if (dateDifference !== 0) return dateDifference;

  const aSeries = a.data.series ?? '\uffff';
  const bSeries = b.data.series ?? '\uffff';
  const seriesDifference = aSeries === bSeries ? 0 : aSeries < bSeries ? -1 : 1;
  if (seriesDifference !== 0) return seriesDifference;

  const orderDifference = (b.data.seriesOrder ?? 0) - (a.data.seriesOrder ?? 0);
  if (orderDifference !== 0) return orderDifference;

  return a.id.localeCompare(b.id, 'ko');
}
