export class FusionSystem {
  constructor() { this.recipes = []; }
  addRecipe(recipe) { this.recipes.push(recipe); }
  check(ingredients) { /* ... */ return null; }
  fuse(ingredients) { const r = this.check(ingredients); return r ? r.result : null; }
}
