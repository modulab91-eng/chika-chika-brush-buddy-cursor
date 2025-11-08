import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Dashboard from "../Dashboard";
import { Mode } from "@/types";

const renderDashboard = (mode: Mode, onSwitchMode = vi.fn()) =>
  render(
    <Dashboard
      mode={mode}
      onStartBrushing={() => {}}
      onSwitchMode={onSwitchMode}
    />,
  );

describe("Dashboard 모드 전환", () => {
  it("현재 모드를 헤더에 표시한다", () => {
    renderDashboard("learning");

    // 헤더에 학습 모드가 표시되는지 확인
    expect(screen.getByRole("heading", { name: /Chika Chika/ })).toBeInTheDocument();
    // 현재 모드 버튼이 비활성화되어 있는지 확인
    expect(
      screen.getByRole("button", { name: /학습 모드/ }),
    ).toBeDisabled();
  });

  it("다른 모드 버튼을 클릭하면 onSwitchMode가 호출된다", async () => {
    const user = userEvent.setup();
    const handleSwitch = vi.fn();
    renderDashboard("kids", handleSwitch);

    const learningButton = screen.getByRole("button", { name: /학습 모드/ });
    await user.click(learningButton);

    expect(handleSwitch).toHaveBeenCalledWith("learning");
  });

  it("세 가지 모드 버튼 모두 렌더링된다", () => {
    renderDashboard("normal");

    expect(screen.getByRole("button", { name: /키즈 모드/ })).toBeEnabled();
    expect(screen.getByRole("button", { name: /학습 모드/ })).toBeEnabled();
    expect(
      screen.getByRole("button", { name: /일반 모드/ }),
    ).toBeDisabled();
  });
});

