import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface GoogleToken {
  sub: string;
  email: string;
  name: string;
  picture?: string;
}

export default function Login() {
  const navigate = useNavigate();
  const { user, login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleGoogleLoginSuccess = (credentialResponse: any) => {
    try {
      const decoded = jwtDecode<GoogleToken>(credentialResponse.credential);
      
      login({
        id: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
      });

      navigate("/");
    } catch (error) {
      console.error("로그인 오류:", error);
    }
  };

  const handleGoogleLoginError = () => {
    console.error("Google 로그인 실패");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Brush Buddy</CardTitle>
          <CardDescription className="text-lg mt-2">
            칫솔질 분석 어플리케이션
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <p className="text-center text-gray-600">
              Google 계정으로 로그인하여 시작하세요.
            </p>
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={handleGoogleLoginError}
              />
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t"></span>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">또는</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              // 테스트용 게스트 로그인
              login({
                id: "guest-" + Date.now(),
                email: "guest@example.com",
                name: "게스트 사용자",
              });
              navigate("/");
            }}
          >
            게스트로 계속
          </Button>

          <p className="text-center text-xs text-gray-500">
            이 앱을 사용하면 이용약관과 개인정보 보호정책에 동의하는 것입니다.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
