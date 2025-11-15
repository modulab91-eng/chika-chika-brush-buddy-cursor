import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "@/context/AuthContext";
import { loginWithEmail } from "@/utils/authUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface GoogleToken {
  sub: string;
  email: string;
  name: string;
  picture?: string;
}

export default function Login() {
  const navigate = useNavigate();
  const { user, login, isAuthenticated } = useAuth();

  const [emailForm, setEmailForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmailForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await loginWithEmail(
        emailForm.email,
        emailForm.password
      );

      if (result.success && result.user) {
        login({
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          picture: result.user.picture,
        });
        navigate("/");
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("로그인 중 오류가 발생했습니다.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

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
      setError("Google 로그인 중 오류가 발생했습니다.");
    }
  };

  const handleGoogleLoginError = () => {
    console.error("Google 로그인 실패");
    setError("Google 로그인에 실패했습니다.");
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
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email">이메일</TabsTrigger>
              <TabsTrigger value="google">Google</TabsTrigger>
            </TabsList>

            {/* 이메일 로그인 탭 */}
            <TabsContent value="email" className="space-y-4">
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="example@email.com"
                    value={emailForm.email}
                    onChange={handleEmailChange}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">비밀번호</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="비밀번호를 입력하세요"
                      value={emailForm.password}
                      onChange={handleEmailChange}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "로그인 중..." : "로그인"}
                </Button>
              </form>

              <div className="text-center text-sm text-gray-600">
                계정이 없으신가요?{" "}
                <Link to="/signup" className="font-semibold text-blue-600 hover:text-blue-700">
                  회원가입
                </Link>
              </div>
            </TabsContent>

            {/* Google 로그인 탭 */}
            <TabsContent value="google" className="space-y-4">
              <p className="text-center text-gray-600">
                Google 계정으로 로그인하여 시작하세요.
              </p>
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleLoginSuccess}
                  onError={handleGoogleLoginError}
                />
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
            </TabsContent>
          </Tabs>

          <p className="text-center text-xs text-gray-500">
            이 앱을 사용하면 이용약관과 개인정보 보호정책에 동의하는 것입니다.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
