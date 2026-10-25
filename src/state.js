function freeze(value) {
  if (value && typeof value === "object") {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
}
export class Session {
  revision = 0;
  run = null;
  review = null;
  snapshot = null;
  invalidate() {
    this.revision++;
    this.run = null;
    this.review = null;
    this.snapshot = null;
  }
  begin() {
    this.invalidate();
    return this.revision;
  }
  complete(token, run) {
    if (token !== this.revision) return false;
    this.snapshot = run.snapshot ?? null;
    this.run = freeze(structuredClone(run));
    return true;
  }
}
