"use client";

import LanguageSelectMenu from "@/components/LanguageSelectMenu";
import LoginButton from "@/components/LoginButton";
import SiteTextLogo from "@/components/SiteTextLogo";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "@/utils/i18n";
import { LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { type FC, useEffect } from "react";

const Main: FC = () => {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [router, user]);

  if (user) return null;
  return (
    <>
      {isLoading ? (
        <AuthWaitCompleted />
      ) : (
        <>
          <LoginForm />

          <div className="mt-12">
            <LanguageSelectMenu />
          </div>
        </>
      )}
    </>
  );
};

export default Main;

const LoginForm: FC = () => {
  const t = useTranslations("Components/Main");
  return (
    <Card>
      <CardHeader>{/* ... */}</CardHeader>
      <CardContent>
        <div className="p-8 pb-0 max-w-[420px]">
          <div className="scale-[3] mb-12 ml-2 mr-8">
            <SiteTextLogo />
          </div>

          <p className="mb-8 text-gray-500 text-center">{t("description")}</p>

          <div className="flex items-center justify-center mb-8">
            <LoginButton />
          </div>

          <Separator className="my-4" />

          <div className="my-4">
            <p className="px-8 text-center text-sm text-muted-foreground">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="hover:text-primary">
                    {t("terms_of_service")}
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This app is a demo</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span className="mx-2">|</span>{" "}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="hover:text-primary">
                    {t("privacy_policy")}
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This app is a demo</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const AuthWaitCompleted: FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoaderCircle color="#999999" size={48} className="animate-spin" />
    </div>
  );
};
