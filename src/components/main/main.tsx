"use client";

import { useStepper, steps, Step } from "@/hooks/use-stepper";
import { Button } from "../ui/button";
import Header from "./header";
import { Fragment, useState } from "react";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { useClientTranslation } from "@/hooks/global/use-client-translation";
import { Separator } from "../ui/separator";
import AudioSelectionPannel from "./audio-selection-pannel";
import PhotoSelectionPannel from "./photo-selection-pannel";
import VideoGennerationPannel from "./video-genneration-pannel";
import { useLipsyncInfoStore } from "@/stores/use-lipsync-info-store";
import { mainContext } from "@/stores/main-context";
import useAsyncStoreLanguage from "@/hooks/use-async-store-language";

const Main = () => {
  useAsyncStoreLanguage();

  const { t } = useClientTranslation();

  const [loading, setLoading] = useState(false);

  const [generateVideo, setGenerateVideo] = useState(false);

  const infoStoreState = useLipsyncInfoStore();

  const [resetFlag, setResetFlag] = useState(0);

  const {
    nowMainTab,
    setNowMainTab,
    audioUrl,
    setAudioUrl,
    imageUrl,
    setImageUrl,
    setVideoUrl,
    reset,
  } = infoStoreState;

  const stepper = useStepper(nowMainTab);

  const onAudioPannelClickNext = (newAudioUrl: string) => {
    if (loading) return;
    setAudioUrl(newAudioUrl);
    stepper.goTo("photo-selection");
    setNowMainTab("photo-selection");
  };

  const onPhotoPannelClickNext = (newImageUrl: string) => {
    if (loading) return;
    setGenerateVideo(true);
    setVideoUrl(null);
    setImageUrl(newImageUrl);
    stepper.goTo("video-generation");
    setNowMainTab("video-generation");
  };

  const onClickStepper = (newId: Step) => {
    if (loading) return;
    if (newId !== "audio-selection" && audioUrl === null) {
      return;
    }
    stepper.goTo(newId);
    setNowMainTab(newId);
  };

  const onClickReset = () => {
    reset();
    stepper.goTo("audio-selection");
    setResetFlag(resetFlag + 1);
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center text-2xl">
      <Header />
      <mainContext.Provider
        value={{
          loading: loading,
          setLoading: (newFlag) => setLoading(newFlag),
          generateVideo: generateVideo,
          setGenerateVideo: (newFlag) => setGenerateVideo(newFlag),
          reset: () => onClickReset(),
        }}
      >
        <div
          className="container mx-auto flex h-full min-h-[500px] w-full max-w-[1024px] flex-1 flex-col items-center px-2 py-6"
          key={resetFlag + ""}
        >
          <nav
            aria-label="Checkout Steps"
            className="group mx-4 my-4 w-full px-4"
          >
            <ol className="flex items-start justify-between gap-2">
              {stepper.all.map((step, index, array) => (
                <Fragment key={step.id}>
                  <li className="flex flex-shrink-0 flex-col items-center gap-1">
                    <Button
                      type="button"
                      role="tab"
                      id={`step-${step.id}`}
                      variant={
                        index <= stepper.current.index ? "default" : "secondary"
                      }
                      aria-current={
                        stepper.current.id === step.id ? "step" : undefined
                      }
                      aria-posinset={index + 1}
                      aria-setsize={steps.length}
                      aria-selected={stepper.current.id === step.id}
                      className={cn(
                        "flex size-4 items-center justify-center rounded-full p-0 md:size-8",
                        true ? "pointer-events-auto" : "pointer-events-none"
                      )}
                      onClick={() => onClickStepper(step.id)}
                    >
                      {index + 1}
                    </Button>
                    <Label
                      className={cn(
                        "pointer-events-none cursor-pointer text-sm font-medium",
                        index <= stepper.current.index
                          ? "text-primary"
                          : "text-foreground"
                      )}
                      htmlFor={`step-${step.id}`}
                    >
                      {t(step.i18n)}
                    </Label>
                  </li>
                  {index < array.length - 1 && (
                    <Separator
                      className={`mt-2 flex-1 transition-all duration-300 md:mt-4 ${
                        index < stepper.current.index
                          ? "border-primary"
                          : "border-border"
                      }`}
                      dash
                    />
                  )}
                </Fragment>
              ))}
            </ol>
          </nav>
          <div className="flex w-full flex-1 flex-col">
            <div
              className={`flex flex-1 flex-col ${stepper.current.id !== "audio-selection" && "hidden"}`}
            >
              <AudioSelectionPannel
                onClickNext={(newAudioUrl) =>
                  !loading && onAudioPannelClickNext(newAudioUrl)
                }
              />
            </div>

            <div
              className={`flex flex-1 flex-col ${stepper.current.id !== "photo-selection" && "hidden"}`}
            >
              <PhotoSelectionPannel
                onClickPrev={() => !loading && stepper.goTo("audio-selection")}
                onClickNext={(newImageUrl) =>
                  onPhotoPannelClickNext(newImageUrl)
                }
              />
            </div>

            <div
              className={`flex flex-1 flex-col ${stepper.current.id !== "video-generation" && "hidden"}`}
            >
              <VideoGennerationPannel
                imageUrl={imageUrl}
                audioUrl={audioUrl}
                onClickBack={() => !loading && stepper.goTo("photo-selection")}
              />
            </div>
          </div>
        </div>
      </mainContext.Provider>
    </div>
  );
};
export default Main;