import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ModeSelector from "../ModeSelector";
import { Mode } from "@/types";

describe("ModeSelector", () => {
  it("세 가지 모드 카드가 모두 렌더링된다", () => {
    render(<ModeSelector onSelectMode={() => {}} />);

    expect(screen.getByText("키즈 모드")).toBeInTheDocument();
    expect(screen.getByText("학습 모드")).toBeInTheDocument();
    expect(screen.getByText("일반 모드")).toBeInTheDocument();
  });

  it("각 모드 버튼 선택 시 콜백이 올바른 모드로 호출된다", async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    render(<ModeSelector onSelectMode={handler} />);

    const startButtons = screen.getAllByRole("button", { name: "시작하기" });
    expect(startButtons).toHaveLength(3);

    const modes: Mode[] = ["kids", "learning", "normal"];

    for (let index = 0; index < startButtons.length; index += 1) {
      await user.click(startButtons[index]);
      expect(handler).toHaveBeenLastCalledWith(modes[index]);
    }

    expect(handler).toHaveBeenCalledTimes(3);
  });
});
import { render, screen } from "@testing-library/react";
import ModeSelector from "../ModeSelector";

describe("ModeSelector", () => {
  it("학습 모드 카드를 표시한다", () => {
    render(<ModeSelector onSelectMode={() => {}} />);

    expect(
      screen.getByRole("heading", { name: /학습 모드/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/명언 영어.*오늘의 영어 한 문장 외우기/i),
    ).toBeInTheDocument();
  });
});

