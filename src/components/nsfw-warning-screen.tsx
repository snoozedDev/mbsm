"use client";
import { useUpdateParams } from "@/hooks/useUpdateParams";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardDescription, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";

export const NsfwWarningScreen = () => {
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  const updateParams = useUpdateParams();

  const onContinue = () => updateParams("nsfw", "enabled");

  const onLeave = () => router.push("/");

  return (
    <div className="flex items-center justify-center space-x-4 py-12 px-4 w-full flex-1">
      <Card className="max-w-xl flex flex-col items-center space-y-8 py-4 px-8 text-center w-full">
        <AlertTriangle className="w-28 h-28" />
        <CardTitle>NSFW Warning</CardTitle>
        <CardDescription>
          This site contains NSFW content. If you are under 18 or are not
          comfortable with NSFW content, please leave.
        </CardDescription>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="nsfw"
            checked={checked}
            onCheckedChange={(e) => setChecked(!!e.valueOf())}
          />
          <label
            htmlFor="nsfw"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {`I understand`}
          </label>
        </div>
        <div className="flex space-x-4">
          <Button variant="secondary" onClick={onLeave}>
            Leave
          </Button>
          <Button disabled={!checked} variant="default" onClick={onContinue}>
            Continue
          </Button>
        </div>
      </Card>
    </div>
  );
};
