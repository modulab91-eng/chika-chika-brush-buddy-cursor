// 로컬 스토리지에서 사용자 관리
interface StoredUser {
  id: string;
  email: string;
  name: string;
  password?: string; // 해시된 비밀번호
  picture?: string;
  createdAt: number;
}

// 간단한 비밀번호 해싱 (클라이언트 사이드)
export const hashPassword = async (password: string): Promise<string> => {
  // 클라이언트에서 bcrypt를 직접 사용하기 위해 간단한 해시 구현
  // 프로덕션 환경에서는 서버에서 해시를 수행해야 함
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
};

// 비밀번호 검증
export const verifyPassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
};

// 사용자 등록
export const registerUser = async (
  email: string,
  password: string,
  name: string
): Promise<{ success: boolean; message: string; user?: StoredUser }> => {
  try {
    // 이메일 검증
    if (!isValidEmail(email)) {
      return { success: false, message: "유효하지 않은 이메일입니다." };
    }

    // 비밀번호 검증
    if (password.length < 6) {
      return { success: false, message: "비밀번호는 6자 이상이어야 합니다." };
    }

    // 이름 검증
    if (!name.trim()) {
      return { success: false, message: "이름을 입력해주세요." };
    }

    // 기존 사용자 확인
    const users = getAllUsers();
    if (users.find((u) => u.email === email)) {
      return { success: false, message: "이미 가입된 이메일입니다." };
    }

    // 비밀번호 해싱
    const hashedPassword = await hashPassword(password);

    // 새 사용자 생성
    const newUser: StoredUser = {
      id: `user_${Date.now()}`,
      email,
      name: name.trim(),
      password: hashedPassword,
      createdAt: Date.now(),
    };

    // 사용자 저장
    const users_list = getAllUsers();
    users_list.push(newUser);
    localStorage.setItem("users", JSON.stringify(users_list));

    return {
      success: true,
      message: "회원가입 성공했습니다.",
      user: {
        ...newUser,
        password: undefined,
      },
    };
  } catch (error) {
    console.error("회원가입 오류:", error);
    return { success: false, message: "회원가입 중 오류가 발생했습니다." };
  }
};

// 이메일로 로그인
export const loginWithEmail = async (
  email: string,
  password: string
): Promise<{ success: boolean; message: string; user?: StoredUser }> => {
  try {
    const users = getAllUsers();
    const user = users.find((u) => u.email === email);

    if (!user) {
      return { success: false, message: "등록되지 않은 이메일입니다." };
    }

    if (!user.password) {
      return {
        success: false,
        message: "이 이메일은 Google 계정으로만 로그인할 수 있습니다.",
      };
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return { success: false, message: "비밀번호가 일치하지 않습니다." };
    }

    // 비밀번호 제거하고 반환
    const { password: _, ...userWithoutPassword } = user;
    return {
      success: true,
      message: "로그인 성공했습니다.",
      user: userWithoutPassword as StoredUser,
    };
  } catch (error) {
    console.error("로그인 오류:", error);
    return { success: false, message: "로그인 중 오류가 발생했습니다." };
  }
};

// 모든 사용자 조회 (내부용)
export const getAllUsers = (): StoredUser[] => {
  try {
    const users = localStorage.getItem("users");
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error("사용자 조회 오류:", error);
    return [];
  }
};

// 이메일 검증
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 사용자 정보 업데이트
export const updateUserProfile = (
  userId: string,
  updates: Partial<StoredUser>
): boolean => {
  try {
    const users = getAllUsers();
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      return false;
    }

    users[userIndex] = { ...users[userIndex], ...updates };
    localStorage.setItem("users", JSON.stringify(users));
    return true;
  } catch (error) {
    console.error("사용자 정보 업데이트 오류:", error);
    return false;
  }
};
