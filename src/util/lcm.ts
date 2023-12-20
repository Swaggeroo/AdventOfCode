const lcm = (...arr: number[]) => {
    const gcd = (x: number, y: number): number => (!y ? x : gcd(y, x % y));
    const _lcm = (x: number, y: number) => (x * y) / gcd(x, y);
    return [...arr].reduce((a, b) => _lcm(a, b));
};

export { lcm };