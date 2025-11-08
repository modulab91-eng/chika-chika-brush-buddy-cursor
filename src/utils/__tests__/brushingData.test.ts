import {
  getMode,
  setMode,
  getEncouragementMessage,
} from "@/utils/brushingData";

describe("brushingData mode 관리", () => {
  const storage = new Map<string, string>();

  beforeEach(() => {
    storage.clear();
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => {
        storage.set(key, value);
      },
      removeItem: (key: string) => {
        storage.delete(key);
      },
      clear: () => {
        storage.clear();
      },
      key: () => null,
      length: 0,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("학습 모드를 저장하고 다시 불러올 수 있다", () => {
    setMode("learning");
    expect(getMode()).toBe("learning");
  });

  it("학습 모드 격려 메시지가 정상적으로 반환된다", () => {
    const message = getEncouragementMessage("learning", true);
    expect(typeof message).toBe("string");
    expect(message.length).toBeGreaterThan(0);
  });
});

