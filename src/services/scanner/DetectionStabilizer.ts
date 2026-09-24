interface Candidate {
  value: string;
  count: number;
  lastSeenAt: number;
}

export class DetectionStabilizer {
  private candidate: Candidate | null = null;

  constructor(
    private readonly requiredMatches = 2,
    private readonly matchWindowMs = 1500,
  ) {}

  push(rawValue: string, now = Date.now()): string | null {
    const value = rawValue.trim();
    if (!value) return null;

    const isSameCandidate = this.candidate?.value === value
      && now - this.candidate.lastSeenAt <= this.matchWindowMs;

    this.candidate = isSameCandidate
      ? { value, count: this.candidate!.count + 1, lastSeenAt: now }
      : { value, count: 1, lastSeenAt: now };

    if (this.candidate.count < this.requiredMatches) return null;

    this.reset();
    return value;
  }

  reset(): void {
    this.candidate = null;
  }
}
