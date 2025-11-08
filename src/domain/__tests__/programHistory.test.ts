import { programHistory } from "../programHistory";

describe("programHistory", () => {
  it("v1.0부터 v1.4까지 버전 이력을 포함한다", () => {
    const versions = programHistory.map((entry) => entry.version);
    expect(versions).toEqual(["v1.0", "v1.1", "v1.2", "v1.3", "v1.4"]);
  });

  it("각 버전은 사용자 프롬프트 전문을 포함한다", () => {
    programHistory.forEach((entry) => {
      expect(entry.prompts).toBeDefined();
      expect(Array.isArray(entry.prompts)).toBe(true);
      expect(entry.prompts.length).toBeGreaterThan(0);
      entry.prompts.forEach(({ text, agent, credits }) => {
        expect(text).toMatch(/사용자 질의/);
        expect(agent).toBeTruthy();
        expect(credits).toMatch(/크레딧/);
      });
    });
  });
});

