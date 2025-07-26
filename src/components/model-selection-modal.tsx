"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { VideoOptions, GenerationMode } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CheckCircle2, UploadCloud, SwitchCamera } from "lucide-react";

interface ModelSelectionModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  mode: GenerationMode;
  options: VideoOptions;
  onSave: (newOptions: VideoOptions) => void;
  onImageUpload: (file: File) => void;
  onModeChange: (newMode: GenerationMode) => void;
  uploadedImageFile: File | null;
  styleModels: any[]; // 추가
  characterModels: any[]; // 추가
}

// const styles = [
//   { name: "Cinematic", img: "/placeholder.svg?width=120&height=80" },
//   { name: "Anime", img: "/placeholder.svg?width=120&height=80" },
//   { name: "Photorealistic", img: "/placeholder.svg?width=120&height=80" },
//   { name: "Claymation", img: "/placeholder.svg?width=120&height=80" },
//   { name: "Pixel Art", img: "/placeholder.svg?width=120&height=80" },
//   { name: "Fantasy", img: "/placeholder.svg?width=120&height=80" },
//   { name: "Vintage", img: "/placeholder.svg?width=120&height=80" },
//   { name: "Modern", img: "/placeholder.svg?width=120&height=80" },
//   { name: "Abstract", img: "/placeholder.svg?width=120&height=80" },
//   { name: "Cartoon", img: "/placeholder.svg?width=120&height=80" },
// ];

// const characters = [
//   { name: "Hero", img: "/placeholder.svg?width=120&height=80" },
//   { name: "Villain", img: "/placeholder.svg?width=120&height=80" },
//   { name: "Cute Animal", img: "/placeholder.svg?width=120&height=80" },
//   { name: "Robot", img: "/placeholder.svg?width=120&height=80" },
//   { name: "Fantasy Creature", img: "/placeholder.svg?width=120&height=80" },
//   { name: "Superhero", img: "/placeholder.svg?width=120&height=80" },
//   { name: "Wizard", img: "/placeholder.svg?width=120&height=80" },
//   { name: "Warrior", img: "/placeholder.svg?width=120&height=80" },
// ];

export function ModelSelectionModal({
  isOpen,
  onOpenChange,
  mode,
  options,
  onSave,
  onImageUpload,
  onModeChange,
  uploadedImageFile,
  styleModels, // 추가
  characterModels, // 추가
}: ModelSelectionModalProps) {
  const [tempMode, setTempMode] = useState<GenerationMode>(mode);
  const [tempOptions, setTempOptions] = useState<VideoOptions>(options);
  const [tempImageFile, setTempImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTempMode(mode);
    setTempOptions(options);
    setTempImageFile(uploadedImageFile);
  }, [isOpen, mode, options, uploadedImageFile]);

  const handleSave = () => {
    onSave(tempOptions);
    if (tempMode !== mode) {
      onModeChange(tempMode);
    }
    if (tempImageFile && tempImageFile !== uploadedImageFile) {
      onImageUpload(tempImageFile);
    }
    onOpenChange(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTempImageFile(file);
    }
  };

  const renderHeader = () => (
    <DialogHeader>
      <DialogTitle>
        {tempMode === "t2v" ? "Text-to-Video" : "Image-to-Video"} Settings
      </DialogTitle>
      <DialogDescription>
        {tempMode === "t2v"
          ? "Choose a style or character for your video generation."
          : "Adjust settings and upload an image for your video."}
      </DialogDescription>
    </DialogHeader>
  );

  const renderFooter = () => (
    <DialogFooter className="sm:justify-between">
      <Button
        variant="ghost"
        onClick={() => setTempMode(tempMode === "t2v" ? "i2v" : "t2v")}
        className="flex items-center gap-2"
      >
        <SwitchCamera className="h-4 w-4" />
        Switch to {tempMode === "t2v" ? "Image-to-Video" : "Text-to-Video"}
      </Button>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </DialogFooter>
  );

  const renderOptionSelectors = (isT2V: boolean) => (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 pt-4",
        isT2V ? "md:grid-cols-3" : "md:grid-cols-2"
      )}
    >
      {isT2V && (
        <OptionGroup title="Aspect Ratio">
          <RadioGroup
            value={tempOptions.aspectRatio}
            onValueChange={(value) =>
              setTempOptions((prev) => ({ ...prev, aspectRatio: value as any }))
            }
            className="flex space-x-2"
          >
            {["1:1", "16:9", "9:16"].map((ratio) => (
              <Label
                key={ratio}
                htmlFor={`ratio-${ratio}`}
                className="flex-1 text-center border rounded-md p-2 cursor-pointer transition-colors hover:bg-muted has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary"
              >
                <RadioGroupItem
                  value={ratio}
                  id={`ratio-${ratio}`}
                  className="sr-only"
                />
                {ratio}
              </Label>
            ))}
          </RadioGroup>
        </OptionGroup>
      )}
      <OptionGroup title="Duration (s)">
        <RadioGroup
          value={String(tempOptions.duration)}
          onValueChange={(value) =>
            setTempOptions((prev) => ({ ...prev, duration: Number(value) }))
          }
          className="flex space-x-2"
        >
          {[2, 4, 8].map((sec) => (
            <Label
              key={sec}
              htmlFor={`sec-${sec}`}
              className="flex-1 text-center border rounded-md p-2 cursor-pointer transition-colors hover:bg-muted has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary"
            >
              <RadioGroupItem
                value={String(sec)}
                id={`sec-${sec}`}
                className="sr-only"
              />
              {sec}s
            </Label>
          ))}
        </RadioGroup>
      </OptionGroup>
      <OptionGroup title="Quality">
        <RadioGroup
          value={tempOptions.quality}
          onValueChange={(value) =>
            setTempOptions((prev) => ({ ...prev, quality: value as any }))
          }
          className="flex space-x-2"
        >
          {["480p", "720p"].map((q) => (
            <Label
              key={q}
              htmlFor={`q-${q}`}
              className="flex-1 text-center border rounded-md p-2 cursor-pointer transition-colors hover:bg-muted has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary"
            >
              <RadioGroupItem value={q} id={`q-${q}`} className="sr-only" />
              {q}
            </Label>
          ))}
        </RadioGroup>
      </OptionGroup>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        {renderHeader()}
        {tempMode === "t2v" ? (
          <>
            <Tabs defaultValue="style" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="style"
                  className={cn(tempOptions.style?.name && "text-primary")}
                >
                  Style
                </TabsTrigger>
                <TabsTrigger
                  value="character"
                  className={cn(tempOptions.character?.name && "text-primary")}
                >
                  Character
                </TabsTrigger>
              </TabsList>
              <TabsContent value="style">
                <Card>
                  <CardContent className="p-4 max-h-[300px] overflow-y-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {styleModels.map((style) => (
                        <VisualSelectButton
                          key={style.name}
                          label={style.name}
                          imgSrc={style.img}
                          isSelected={tempOptions.style?.name === style.name}
                          onClick={() =>
                            setTempOptions((prev) => ({
                              ...prev,
                              style: style,
                              character: null,
                            }))
                          }
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="character">
                <Card>
                  <CardContent className="p-4 max-h-[300px] overflow-y-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {characterModels.map((char) => (
                        <VisualSelectButton
                          key={char.name}
                          label={char.name}
                          imgSrc={char.img}
                          isSelected={tempOptions.character?.name === char.name}
                          onClick={() =>
                            setTempOptions((prev) => ({
                              ...prev,
                              character: char,
                              style: null,
                            }))
                          }
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            {renderOptionSelectors(true)}
          </>
        ) : (
          <div className="py-4 space-y-6">
            <div
              className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50"
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud className="w-10 h-10 text-muted-foreground" />
              <p className="mt-2 text-sm font-semibold">
                {tempImageFile
                  ? tempImageFile.name
                  : "Click to upload an image"}
              </p>
              <p className="text-xs text-muted-foreground">
                {tempImageFile
                  ? `${(tempImageFile.size / 1024).toFixed(2)} KB`
                  : "PNG, JPG, GIF"}
              </p>
              {tempImageFile && (
                <Button variant="link" size="sm" className="mt-1 -mb-2">
                  Change Image
                </Button>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            {renderOptionSelectors(false)}
          </div>
        )}
        {renderFooter()}
      </DialogContent>
    </Dialog>
  );
}

function OptionGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <h4 className="font-medium text-sm">{title}</h4>
      {children}
    </div>
  );
}

function VisualSelectButton({
  label,
  imgSrc,
  isSelected,
  onClick,
}: {
  label: string;
  imgSrc: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={cn(
        "relative rounded-lg overflow-hidden border-2 transition-all",
        isSelected
          ? "border-primary"
          : "border-transparent hover:border-muted-foreground/50"
      )}
      onClick={onClick}
    >
      <img
        src={imgSrc || "/placeholder.svg"}
        alt={label}
        className="w-full h-auto object-cover aspect-[3/2]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      <p className="absolute bottom-1 left-2 text-white text-sm font-semibold">
        {label}
      </p>
      {isSelected && (
        <CheckCircle2 className="absolute top-1 right-1 h-5 w-5 text-primary-foreground bg-primary rounded-full" />
      )}
    </button>
  );
}
