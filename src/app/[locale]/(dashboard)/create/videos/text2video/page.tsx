"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Send,
  Play,
  Download,
  Share2,
  Settings,
  Sparkles,
  FileVideo,
  User,
  Bot,
} from "lucide-react";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface VideoGeneration {
  id: string;
  prompt: string;
  progress: number;
  isComplete: boolean;
  isGenerating: boolean;
  timestamp: Date;
}

const ChatStyleVideoGenerator: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "Hi! I'm ready to create amazing videos from your text descriptions. Just describe what you want to see and I'll generate it for you!",
      timestamp: new Date(),
    },
  ]);

  const [currentInput, setCurrentInput] = useState("");
  const [videoGenerations, setVideoGenerations] = useState<VideoGeneration[]>(
    []
  );
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = () => {
    if (!currentInput.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: currentInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Start video generation
    const videoId = `video-${Date.now()}`;
    const newVideoGeneration: VideoGeneration = {
      id: videoId,
      prompt: currentInput,
      progress: 0,
      isComplete: false,
      isGenerating: true,
      timestamp: new Date(),
    };

    setVideoGenerations((prev) => [...prev, newVideoGeneration]);
    setCurrentInput("");
    setIsTyping(true);

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: `Great! I'm now generating a video based on: "${currentInput}". This will take a few minutes...`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);

    // Simulate video generation progress
    const progressInterval = setInterval(() => {
      setVideoGenerations((prev) =>
        prev.map((video) => {
          if (video.id === videoId && video.isGenerating) {
            const newProgress = Math.min(video.progress + 10, 100);
            return {
              ...video,
              progress: newProgress,
              isComplete: newProgress === 100,
              isGenerating: newProgress < 100,
            };
          }
          return video;
        })
      );
    }, 800);

    // Complete generation after progress reaches 100%
    setTimeout(() => {
      clearInterval(progressInterval);
      const completionMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: "assistant",
        content:
          "Your video is ready! You can play, download, or share it using the controls above.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, completionMessage]);
    }, 8500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">AI Video Generator</h1>
              <p className="text-sm text-gray-500">
                Create videos from text descriptions
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Online
            </Badge>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Video Results Area */}
      {videoGenerations.length > 0 && (
        <div className="flex-shrink-0 bg-white border-b p-6">
          <div className="space-y-4">
            {videoGenerations.map((video) => (
              <Card key={video.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-video bg-black relative flex items-center justify-center">
                    {video.isGenerating ? (
                      <div className="text-center text-white space-y-4">
                        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="text-lg">Generating video...</p>
                        <div className="w-64 space-y-2">
                          <Progress value={video.progress} className="h-2" />
                          <p className="text-sm text-gray-300">
                            {video.progress}% complete
                          </p>
                        </div>
                      </div>
                    ) : video.isComplete ? (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <div className="text-center text-white space-y-4">
                          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto cursor-pointer hover:bg-white/30 transition-colors">
                            <Play className="w-10 h-10 text-white" />
                          </div>
                          <p className="text-lg">Video Generated!</p>
                          <p className="text-sm text-gray-300">Click to play</p>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {video.isComplete && (
                    <div className="p-4 bg-gray-900 text-white">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium truncate">
                            {video.prompt}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Generated at {video.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-white/20"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-white/20"
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`flex max-w-[80%] ${
                message.type === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === "user"
                    ? "bg-blue-500 ml-3"
                    : "bg-purple-500 mr-3"
                }`}
              >
                {message.type === "user" ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>
              <div
                className={`px-4 py-2 rounded-lg ${
                  message.type === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-white border shadow-sm"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.type === "user" ? "text-blue-100" : "text-gray-500"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex max-w-[80%]">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-purple-500 mr-3">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="px-4 py-2 rounded-lg bg-white border shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 bg-white border-t p-4">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <Input
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe the video you want to create..."
              className="pr-12 py-3 text-base"
              disabled={isTyping}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <FileVideo className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!currentInput.trim() || isTyping}
            className="px-6 py-3"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <span>Press Enter to send</span>
            <span>•</span>
            <span className="flex items-center">
              <Sparkles className="w-3 h-3 mr-1" />
              Pro mode enabled
            </span>
          </div>
          <span>{currentInput.length}/500</span>
        </div>
      </div>
    </div>
  );
};

export default ChatStyleVideoGenerator;
