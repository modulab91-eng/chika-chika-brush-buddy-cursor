import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProgramInfoButton from "../ProgramInfoButton";

describe("ProgramInfoButton", () => {
  it("버튼 클릭 시 프로그램 정보 모달을 표시한다", async () => {
    const user = userEvent.setup();
    render(<ProgramInfoButton />);

    const infoButton = screen.getByRole("button", { name: /프로그램 설명/i });
    await user.click(infoButton);

    expect(
      screen.getByRole("heading", { name: /프로그램 개발 이력/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText((content) => content.includes("v1.4")),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/사용자 질의 1: 해당 서비스는 바이브코딩 프롬프트 방식으로 구성되었습니다/i),
    ).toBeInTheDocument();
  });
});

