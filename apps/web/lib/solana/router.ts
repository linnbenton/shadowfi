export type Route = {
  path: string[];
  impact: number;
  priceOut: number;
};

export function chooseBestRoute(routes: Route[]) {
  // simple institutional logic v1
  return routes.sort((a, b) => {
    return a.impact - b.impact; // minimal price impact first
  })[0];
}
