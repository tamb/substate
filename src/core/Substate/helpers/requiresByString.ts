function requiresByString(key: string): boolean {
  if (key === undefined) {
    throw new Error('String is undefined');
  }

  return key.includes('.') || key.includes('[');
}

export { requiresByString };
