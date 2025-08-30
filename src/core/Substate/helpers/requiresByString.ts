function requiresByString(key: string) : boolean {
    return key.includes('.') || key.includes('[');
}

export { requiresByString };