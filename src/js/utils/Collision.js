export function checkEntityCollision(a, b, threshold = 12) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.hypot(dx, dy) < threshold;
}